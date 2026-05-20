"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewStarsInput } from "@/components/market/ReviewStars";

export function ReviewForm({ productId, sellerId }: { productId: string; sellerId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    const res = await fetch(`/api/market/${productId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, toId: sellerId }),
    });
    if (res.ok) {
      setDone(true);
      router.refresh();
    }
    setLoading(false);
  }

  if (done) return <p className="text-emerald-600 text-sm">评价已提交，感谢反馈！</p>;

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-stone-100">
      <h3 className="text-sm font-semibold text-stone-700 mb-3">评价卖家</h3>
      <ReviewStarsInput onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        placeholder="写下你的评价（可选）"
      />
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="mt-3 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
        style={{ background: rating === 0 ? "#d1d5db" : "linear-gradient(135deg, #f59e0b, #d97706)" }}
      >
        {loading ? "提交中..." : "提交评价"}
      </button>
    </form>
  );
}
