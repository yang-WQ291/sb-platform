import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-48 shrink-0 hidden lg:block p-4 text-sm">
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#d97706" }}>悬赏任务</h3>
        <ul className="space-y-1">
          <li><Link href="/tasks" className="text-stone-600 hover:text-amber-600 transition-colors">全部任务</Link></li>
          <li><Link href="/tasks/create" className="text-stone-600 hover:text-amber-600 transition-colors">发布悬赏</Link></li>
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#4f46e5" }}>八卦专区</h3>
        <ul className="space-y-1">
          <li><Link href="/forum" className="text-stone-600 hover:text-indigo-600 transition-colors">全部版块</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#059669" }}>二手市场</h3>
        <ul className="space-y-1">
          <li><Link href="/market" className="text-stone-600 hover:text-emerald-600 transition-colors">商品大厅</Link></li>
          <li><Link href="/market/create" className="text-stone-600 hover:text-emerald-600 transition-colors">发布商品</Link></li>
          <li><Link href="/market/my" className="text-stone-600 hover:text-emerald-600 transition-colors">我的交易</Link></li>
        </ul>
      </div>
    </aside>
  );
}
