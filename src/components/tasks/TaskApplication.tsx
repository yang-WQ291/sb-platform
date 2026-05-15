"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  taskId: string;
  taskStatus: string;
  publisherId: string;
  currentUserId?: string;
  assignedUserId?: string | null;
  hasApplied: boolean;
}

export function TaskApplication({ taskId, taskStatus, publisherId, currentUserId, assignedUserId, hasApplied }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function apply() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tasks/${taskId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        setError(data.error);
      }
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }

  async function handleAction(action: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch {
      setError("网络错误");
    }
    setLoading(false);
  }

  if (!currentUserId) {
    return <p className="text-gray-400 text-sm">请先登录后再操作</p>;
  }

  if (taskStatus === "open" && currentUserId !== publisherId && !hasApplied) {
    return (
      <div className="bg-white rounded-xl border p-4">
        {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">{error}</div>}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="简单介绍一下你自己...（可选）"
          rows={2}
          className="w-full px-3 py-2 border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={apply} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          {loading ? "提交中..." : "申请接取"}
        </button>
      </div>
    );
  }

  if (taskStatus === "open" && currentUserId === publisherId) {
    return (
      <button onClick={() => handleAction("cancel")} disabled={loading} className="text-red-500 text-sm hover:underline">
        取消悬赏（退还 SB）
      </button>
    );
  }

  if (taskStatus === "in_progress" && currentUserId === publisherId) {
    return (
      <button onClick={() => handleAction("complete")} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
        确认完成（SB 将转给执行者）
      </button>
    );
  }

  if (hasApplied) {
    return <span className="text-sm text-gray-400">已申请，等待发布者确认</span>;
  }

  return null;
}
