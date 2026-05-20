import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TaskCard } from "@/components/tasks/TaskCard";
import { PostCard } from "@/components/forum/PostCard";
import { ProductCard } from "@/components/market/ProductCard";
import Link from "next/link";

export default async function HomePage() {
  const user = await getCurrentUser();

  const [latestTasks, latestPosts, latestProducts, productCount] = await Promise.all([
    prisma.task.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { publisher: { select: { id: true, username: true } } },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { comments: true } },
        board: { select: { id: true } },
      },
    }),
    prisma.product.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        seller: { select: { id: true, username: true } },
        _count: { select: { favorites: true } },
      },
    }),
    prisma.product.count({ where: { status: "active" } }),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 40%, #dc2626 100%)" }}
      >
        <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: 80, bottom: -40, width: 100, height: 100, background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
        <h2 className="text-2xl font-bold mb-2 relative">SB 社区</h2>
        <p className="text-sm opacity-90 relative">悬赏互助 · 八卦吃瓜 · 二手闲置 — 一站式校园社区</p>
        <div className="flex gap-3 mt-4 relative flex-wrap">
          {user ? (
            <>
              <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                SB {user.wallet?.balance ?? 0}
              </span>
              <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
                {productCount} 件在售
              </span>
            </>
          ) : (
            <Link href="/login" className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}>
              登录探索更多
            </Link>
          )}
        </div>
      </div>

      {/* Three Zone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/tasks"
          className="bg-white rounded-xl p-5 hover:shadow-lg transition-all"
          style={{ borderTop: "4px solid #f59e0b", boxShadow: "0 2px 8px rgba(245,158,11,0.08)" }}>
          <div className="text-2xl mb-2">&#x1F3AF;</div>
          <h4 className="font-semibold text-amber-900 mb-1">悬赏任务</h4>
          <p className="text-xs text-stone-400 mb-3">发布悬赏 · 赚取 SB</p>
          <span className="text-xs font-semibold text-amber-500">{latestTasks.length} 个进行中 &rarr;</span>
        </Link>
        <Link href="/forum"
          className="bg-white rounded-xl p-5 hover:shadow-lg transition-all"
          style={{ borderTop: "4px solid #6366f1", boxShadow: "0 2px 8px rgba(99,102,241,0.08)" }}>
          <div className="text-2xl mb-2">&#x1F4AC;</div>
          <h4 className="font-semibold text-indigo-900 mb-1">八卦专区</h4>
          <p className="text-xs text-stone-400 mb-3">4 个版块 · 畅快吃瓜</p>
          <span className="text-xs font-semibold text-indigo-500">10+ 个新帖 &rarr;</span>
        </Link>
        <Link href="/market"
          className="bg-white rounded-xl p-5 hover:shadow-lg transition-all"
          style={{ borderTop: "4px solid #10b981", boxShadow: "0 2px 8px rgba(16,185,129,0.08)" }}>
          <div className="text-2xl mb-2">&#x1F6D2;</div>
          <h4 className="font-semibold text-emerald-900 mb-1">二手市场</h4>
          <p className="text-xs text-stone-400 mb-3">闲置交易 · SB 支付</p>
          <span className="text-xs font-semibold text-emerald-500">{productCount} 件在售 &rarr;</span>
        </Link>
      </div>

      {/* Latest Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <span style={{ color: "#f59e0b" }}>&#x25C6;</span> 最新悬赏
            </h2>
            <Link href="/tasks" className="text-sm text-amber-600 hover:underline">查看全部</Link>
          </div>
          {latestTasks.length === 0 ? (
            <p className="text-stone-400 text-sm">暂无悬赏任务</p>
          ) : (
            <div className="grid gap-3">
              {latestTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <span style={{ color: "#10b981" }}>&#x25C6;</span> 最新二手
            </h2>
            <Link href="/market" className="text-sm text-emerald-600 hover:underline">查看全部</Link>
          </div>
          {latestProducts.length === 0 ? (
            <p className="text-stone-400 text-sm">暂无商品</p>
          ) : (
            <div className="grid gap-3">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
