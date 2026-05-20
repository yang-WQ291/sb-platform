"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SendForm({ toId }: { toId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toId, productId: "direct", content: content.trim() }),
    });
    if (res.ok) {
      setContent("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入消息..."
        className="flex-1 border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
      >
        发送
      </button>
    </form>
  );
}
