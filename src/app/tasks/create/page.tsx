"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          rewardSb: parseInt(form.get("rewardSb") as string),
          deadline: form.get("deadline") || null,
        }),
      });

      if (res.ok) {
        const task = await res.json();
        router.push(`/tasks/${task.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "发布失败");
      }
    } catch {
      setError("网络错误，请稍后重试");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">发布悬赏</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">任务标题</label>
          <input name="title" required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="简短描述你要做什么" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">详细描述</label>
          <textarea name="description" required rows={5} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="详细说明任务要求..." />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">悬赏金额 (SB)</label>
            <input name="rewardSb" type="number" required min={1} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">截止日期（可选）</label>
            <input name="deadline" type="date" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium">
          发布悬赏
        </button>
      </form>
    </div>
  );
}
