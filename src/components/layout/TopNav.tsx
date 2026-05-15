import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { SBBadge } from "@/components/shared/SBBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";

export async function TopNav() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-xl text-blue-600 shrink-0">
          SB 悬赏
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/tasks" className="text-gray-600 hover:text-gray-900">悬赏大厅</Link>
          <Link href="/forum" className="text-gray-600 hover:text-gray-900">八卦专区</Link>
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
            </>
          ) : (
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
