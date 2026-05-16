"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CreatePostForm({ boardId }: { boardId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm text-white bg-[#0066FF] hover:bg-[#0055DD] px-4 py-1.5 transition-colors">
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
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-5 space-y-3">
      {error && <div className="bg-red-50 text-red-600 p-2 text-xs">{error}</div>}
      <input name="title" required placeholder="标题" className="w-full text-base font-medium placeholder-gray-400 focus:outline-none" />
      <textarea name="content" required rows={4} placeholder="写下你的内容..." className="w-full text-sm placeholder-gray-400 focus:outline-none resize-none" />
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button type="submit" className="text-sm text-white bg-[#0066FF] hover:bg-[#0055DD] px-4 py-1.5 transition-colors">发布</button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-gray-400 hover:text-gray-600">取消</button>
      </div>
    </form>
  );
}
