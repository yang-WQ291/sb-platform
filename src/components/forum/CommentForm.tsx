"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });
      if (res.ok) {
        setContent("");
        router.refresh();
        onSuccess?.();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("网络错误");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && <div className="bg-red-50 text-red-600 p-1 rounded text-xs">{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "回复..." : "写下你的评论..."}
        rows={2}
        required
        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">发表</button>
    </form>
  );
}
