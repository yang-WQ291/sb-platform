"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["全部", "数码", "书籍", "生活", "其他"];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "全部";

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            if (cat === "全部") params.delete("category");
            else params.set("category", cat);
            params.delete("page");
            router.push(`/market?${params.toString()}`);
          }}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            background: current === cat ? "#10b981" : "#d1fae5",
            color: current === cat ? "white" : "#065f46",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
