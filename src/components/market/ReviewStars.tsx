"use client";

import { useState } from "react";

export function ReviewStarsDisplay({ rating, count }: { rating: number; count: number }) {
  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  return (
    <span className="text-sm text-amber-500">
      {stars} <span className="text-stone-400 ml-1">({count})</span>
    </span>
  );
}

export function ReviewStarsInput({ onChange }: { onChange: (rating: number) => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => { setRating(star); onChange(star); }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-colors"
          style={{ color: star <= (hover || rating) ? "#f59e0b" : "#d1d5db" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
