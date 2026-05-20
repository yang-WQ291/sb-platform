import { getProducts } from "@/lib/market";
import { ProductCard } from "@/components/market/ProductCard";
import { CategoryFilter } from "@/components/market/CategoryFilter";
import { SearchBar } from "@/components/market/SearchBar";
import Link from "next/link";
import { Suspense } from "react";

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const { products, total } = await getProducts({
    category: sp.category,
    search: sp.search,
    page,
  });
  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900">二手市场</h1>
          <p className="text-sm text-stone-500 mt-1">闲置交易 · 物尽其用</p>
        </div>
        <Link
          href="/market/create"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        >
          发布商品
        </Link>
      </div>

      <div className="space-y-4 mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <CategoryFilter />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">&#x1F6D2;</div>
          <p className="text-stone-400">暂无商品</p>
          <Link href="/market/create" className="text-emerald-600 hover:underline text-sm mt-2 inline-block">
            发布第一件商品
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => {
            const p = i + 1;
            const href = `/market?${new URLSearchParams({ ...(sp.category ? { category: sp.category } : {}), ...(sp.search ? { search: sp.search } : {}), page: String(p) }).toString()}`;
            return (
              <Link
                key={p}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: p === page ? "#10b981" : "#d1fae5",
                  color: p === page ? "white" : "#065f46",
                }}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
