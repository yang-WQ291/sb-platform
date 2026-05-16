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
    if (!content.trim()) return;
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
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "写下你的回复..." : "写下你的评论..."}
        rows={3}
        className="w-full px-0 py-2 text-sm placeholder-gray-400 focus:outline-none border-b border-gray-200 focus:border-gray-400 resize-none bg-transparent transition-colors"
      />
      <div className="flex justify-end mt-2">
        <button type="submit" className="text-sm text-white bg-[#0066FF] hover:bg-[#0055DD] px-5 py-1.5 transition-colors">
          发布
        </button>
      </div>
    </form>
  );
}
