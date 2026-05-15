"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function TransferForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toUsername: form.get("toUsername"),
          amount: parseInt(form.get("amount") as string),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("转账成功");
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        setError(data.error || "转账失败");
      }
    } catch {
      setError("网络错误，请稍后重试");
    }
  }

  return (
    <>
      {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-2 rounded mb-3 text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input name="toUsername" placeholder="对方用户名" required className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input name="amount" type="number" placeholder="金额" required min={1} className="w-24 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">转账</button>
      </form>
    </>
  );
}
