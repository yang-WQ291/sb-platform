import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getUserRating } from "@/lib/market";
import { ProductStatusBadge } from "@/components/market/ProductStatusBadge";
import { FavoriteButton } from "@/components/market/FavoriteButton";
import { ReviewStarsDisplay } from "@/components/market/ReviewStars";
import { BuyButton } from "./BuyButton";
import { ReviewForm } from "./ReviewForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: { select: { id: true, username: true } },
      _count: { select: { favorites: true } },
    },
  });
  if (!product) notFound();

  const sellerRating = await getUserRating(product.sellerId);
  const images: string[] = (() => { try { return JSON.parse(product.images); } catch { return []; } })();

  const isFavorited = user
    ? !!(await prisma.favorite.findUnique({ where: { userId_productId: { userId: user.id, productId: id } } }))
    : false;

  const isSeller = user?.id === product.sellerId;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/market" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">&larr; 返回市场</Link>
      <div className="bg-white rounded-xl p-6" style={{ border: "1px solid #d1fae5", borderLeft: "4px solid #10b981" }}>
        {/* Image */}
        <div className="w-full h-64 rounded-lg mb-6 flex items-center justify-center text-6xl"
          style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}>
          {images[0] ? (
            <img src={images[0]} alt={product.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span>&#x1F4E6;</span>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-stone-800">{product.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl font-bold" style={{ color: "#059669" }}>SB {product.price}</span>
              <ProductStatusBadge status={product.status} />
            </div>
          </div>
          {user && !isSeller && <FavoriteButton productId={product.id} initialFavorited={isFavorited} />}
        </div>

        {/* Seller info */}
        <div className="flex items-center gap-3 py-3 border-y border-stone-100 mb-4">
          <Link href={`/profile/${product.seller.id}`} className="flex items-center gap-2 hover:underline">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              {product.seller.username.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-stone-700">{product.seller.username}</span>
          </Link>
          <ReviewStarsDisplay rating={sellerRating.average} count={sellerRating.count} />
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-2">商品描述</h3>
          <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed">{product.description}</p>
        </div>

        {/* Meta */}
        <div className="flex gap-4 text-xs text-stone-400 mb-6">
          <span className="bg-stone-100 px-2 py-1 rounded">{product.category}</span>
          <span>{product._count.favorites} 人收藏</span>
          <span>{new Date(product.createdAt).toLocaleDateString("zh-CN")} 发布</span>
        </div>

        {/* Actions */}
        {user && !isSeller && product.status === "active" && (
          <BuyButton productId={product.id} price={product.price} sellerId={product.sellerId} />
        )}
        {isSeller && product.status === "active" && (
          <div className="flex gap-3">
            <Link href={`/market/${product.id}/edit`}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors">
              编辑商品
            </Link>
          </div>
        )}

        {/* Review Form */}
        {user && user.id !== product.sellerId && product.status === "sold" && (
          <ReviewForm productId={product.id} sellerId={product.sellerId} />
        )}
      </div>
    </div>
  );
}
