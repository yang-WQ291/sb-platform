"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["数码", "书籍", "生活", "其他"];

export function EditForm({ product }: { product: { id: string; title: string; description: string; price: number; category: string; status: string; images: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: String(product.price),
    category: product.category,
    status: product.status,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/market/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: parseInt(form.price),
        category: form.category,
        status: form.status,
      }),
    });
    if (res.ok) router.push(`/market/${product.id}`);
    else { const d = await res.json(); setError(d.error || "保存失败"); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">标题</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">描述</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4}
          className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">价格 (SB)</label>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">分类</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">状态</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
          <option value="active">在售</option>
          <option value="off">下架</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
        {loading ? "保存中..." : "保存修改"}
      </button>
    </form>
  );
}
