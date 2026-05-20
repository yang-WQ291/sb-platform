"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (value.trim()) params.set("search", value.trim());
        else params.delete("search");
        params.delete("page");
        router.push(`/market?${params.toString()}`);
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索商品..."
        className="flex-1 border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
      >
        搜索
      </button>
    </form>
  );
}
