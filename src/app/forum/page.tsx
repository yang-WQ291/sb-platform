import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ForumPage() {
  const boards = await prisma.board.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">八卦专区</h1>
      {boards.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">还没有版块</p>
          <p className="text-sm">管理员将陆续开设热门版块，敬请期待</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {boards.map((board) => (
            <Link key={board.id} href={`/forum/${board.id}`} className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg">{board.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{board.description}</p>
              <span className="text-xs text-gray-400 mt-2 inline-block">{board._count.posts} 个帖子</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
