import { prisma } from "./prisma";

export async function getProducts({
  category,
  search,
  page = 1,
  pageSize = 12,
}: {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const where: Record<string, unknown> = {};
  if (category && category !== "全部") where.category = category;
  if (search) where.title = { contains: search };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        seller: { select: { id: true, username: true } },
        _count: { select: { favorites: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);
  return { products, total, page, pageSize };
}

export async function buyProduct(buyerId: string, productId: string) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("商品不存在");
    if (product.status !== "active") throw new Error("商品已售出或已下架");
    if (product.sellerId === buyerId) throw new Error("不能购买自己的商品");

    const buyerWallet = await tx.wallet.findUnique({ where: { userId: buyerId } });
    if (!buyerWallet || buyerWallet.balance < product.price) throw new Error("余额不足");

    await tx.wallet.update({ where: { userId: buyerId }, data: { balance: { decrement: product.price } } });
    await tx.wallet.update({ where: { userId: product.sellerId }, data: { balance: { increment: product.price } } });
    await tx.product.update({ where: { id: productId }, data: { status: "sold" } });

    await tx.transaction.create({
      data: {
        fromUserId: buyerId,
        toUserId: product.sellerId,
        amount: product.price,
        type: "market_buy",
        taskId: null,
      },
    });

    return { success: true };
  });
}

export async function toggleFavorite(userId: string, productId: string) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false };
  } else {
    await prisma.favorite.create({ data: { userId, productId } });
    return { favorited: true };
  }
}

export async function createReview(fromId: string, toId: string, productId: string, rating: number, comment: string) {
  if (rating < 1 || rating > 5) throw new Error("评分需在1-5之间");
  return prisma.review.create({
    data: { fromId, toId, productId, rating, comment },
  });
}

export async function getUserRating(userId: string) {
  const reviews = await prisma.review.findMany({ where: { toId: userId } });
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return { average: Math.round(avg * 10) / 10, count: reviews.length };
}
