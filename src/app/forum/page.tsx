import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ForumPage() {
  const boards = await prisma.board.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">八卦专区</h1>
      {boards.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base mb-2">还没有版块</p>
        </div>
      ) : (
        <div className="space-y-0">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/forum/${board.id}`}
              className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 px-1 -mx-1 transition-colors"
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">{board.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{board.description}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0 ml-4">{board._count.posts} 个帖子</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
