import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProductCard } from "@/components/market/ProductCard";
import { redirect } from "next/navigation";

export default async function MyMarketPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [myProducts, favProducts] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, username: true } },
        _count: { select: { favorites: true } },
      },
    }),
    prisma.product.findMany({
      where: { favorites: { some: { userId: user.id } } },
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, username: true } },
        _count: { select: { favorites: true } },
      },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">我的交易</h1>
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-stone-700 mb-3">我发布的 ({myProducts.length})</h2>
        {myProducts.length === 0 ? (
          <p className="text-stone-400 text-sm">暂无发布</p>
        ) : (
          <div className="grid gap-3">
            {myProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-stone-700 mb-3">我收藏的 ({favProducts.length})</h2>
        {favProducts.length === 0 ? (
          <p className="text-stone-400 text-sm">暂无收藏</p>
        ) : (
          <div className="grid gap-3">
            {favProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
