"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CreatePostForm({ boardId }: { boardId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
        发布新帖
      </button>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch(`/api/forum/${boardId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          content: form.get("content"),
        }),
      });
      if (res.ok) {
        router.refresh();
        setOpen(false);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("网络错误");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-4 space-y-3">
      {error && <div className="bg-red-50 text-red-600 p-2 rounded text-sm">{error}</div>}
      <input name="title" required placeholder="帖子标题" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <textarea name="content" required rows={3} placeholder="内容..." className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">发布</button>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-500 text-sm hover:underline">取消</button>
      </div>
    </form>
  );
}
