import Link from "next/link";
import { ProductStatusBadge } from "./ProductStatusBadge";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    status: string;
    category: string;
    images: string;
    createdAt: Date;
    seller: { id: string; username: string };
    _count?: { favorites: number };
    sellerRating?: { average: number; count: number };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const images: string[] = (() => {
    try { return JSON.parse(product.images); } catch { return []; }
  })();

  return (
    <Link
      href={`/market/${product.id}`}
      className="flex gap-4 bg-white rounded-lg border border-emerald-200 p-4 hover:shadow-lg transition-all"
      style={{ borderLeft: "4px solid #10b981", boxShadow: "0 1px 4px rgba(16,185,129,0.06)" }}
    >
      <div className="w-20 h-20 rounded-lg bg-stone-100 flex items-center justify-center text-2xl shrink-0"
        style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}>
        {images[0] ? (
          <img src={images[0]} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span>&#x1F4E6;</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-800 truncate">{product.title}</h3>
          <ProductStatusBadge status={product.status} />
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-stone-500 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-medium">
            SB {product.price}
          </span>
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{product.category}</span>
          {product.sellerRating && (
            <span className="text-xs text-stone-400">
              &#x2B50;{product.sellerRating.average}({product.sellerRating.count})
            </span>
          )}
          <span className="text-xs text-stone-400">@{product.seller.username}</span>
        </div>
      </div>
    </Link>
  );
}
