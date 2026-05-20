import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SBBadge } from "@/components/shared/SBBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { LogoutButton } from "./LogoutButton";

export async function TopNav() {
  const user = await getCurrentUser();

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b shadow-sm"
      style={{ borderBottom: "2px solid transparent", borderImage: "linear-gradient(90deg, #f59e0b, #6366f1, #10b981) 1" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-xl text-transparent bg-clip-text shrink-0"
          style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #dc2626)" }}>
          SB 悬赏
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/tasks" className="text-stone-600 hover:text-amber-600 transition-colors">悬赏大厅</Link>
          <Link href="/forum" className="text-stone-600 hover:text-indigo-600 transition-colors">八卦专区</Link>
          <Link href="/market" className="text-stone-600 hover:text-emerald-600 transition-colors">二手市场</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Link href="/wallet">
                <SBBadge balance={user.wallet?.balance ?? 0} />
              </Link>
              <Link href={`/profile/${user.id}`}>
                <UserAvatar username={user.username} />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="text-sm text-amber-600 hover:underline">登录</Link>
          )}
        </div>
      </div>
    </header>
  );
}
