import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-48 shrink-0 hidden lg:block p-4 text-sm">
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">悬赏任务</h3>
        <ul className="space-y-1">
          <li><Link href="/tasks" className="text-gray-600 hover:text-gray-900">全部任务</Link></li>
          <li><Link href="/tasks/create" className="text-gray-600 hover:text-gray-900">发布悬赏</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">八卦专区</h3>
        <ul className="space-y-1">
          <li><Link href="/forum" className="text-gray-600 hover:text-gray-900">全部版块</Link></li>
        </ul>
      </div>
    </aside>
  );
}
