"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["数码", "书籍", "生活", "其他"];

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "其他", imageUrl: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim() || !form.price) {
      setError("请填写所有必填字段");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/market", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        price: form.price,
        category: form.category,
        images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      }),
    });
    if (res.ok) {
      const product = await res.json();
      router.push(`/market/${product.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "发布失败");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-emerald-900 mb-6">发布商品</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">标题 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="商品名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">描述 *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="描述商品状况、使用时间等"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">价格 (SB) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              min="1"
              className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="SB 数量"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">分类</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">图片链接</label>
          <input
            type="text"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        >
          {loading ? "发布中..." : "发布商品"}
        </button>
      </form>
    </div>
  );
}
