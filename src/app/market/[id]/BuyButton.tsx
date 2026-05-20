"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BuyButton({ productId, price, sellerId }: { productId: string; price: number; sellerId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleBuy() {
    if (!confirm(`确认购买？将支付 SB ${price}`)) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/market/${productId}/buy`, { method: "POST" });
    if (res.ok) {
      router.push(`/market/${productId}`);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "购买失败");
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full py-3 rounded-lg text-white font-medium text-sm transition-colors"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
      >
        {loading ? "处理中..." : `立即购买 — SB ${price}`}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
