"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FavoriteButton({ productId, initialFavorited }: { productId: string; initialFavorited: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/market/${productId}/favorite`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setFavorited(data.favorited);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
      style={{
        background: favorited ? "#fef3c7" : "#d1fae5",
        color: favorited ? "#d97706" : "#065f46",
      }}
    >
      {favorited ? "★ 已收藏" : "☆ 收藏"}
    </button>
  );
}
