import { prisma } from "@/lib/prisma";
import { TaskCard } from "@/components/tasks/TaskCard";
import { PostCard } from "@/components/forum/PostCard";
import Link from "next/link";

export default async function HomePage() {
  const [latestTasks, latestPosts] = await Promise.all([
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
  ]);

  return (
    <div>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">最新悬赏</h2>
          <Link href="/tasks" className="text-sm text-blue-600 hover:underline">查看全部</Link>
        </div>
        {latestTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无悬赏任务</p>
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
          <h2 className="text-xl font-bold">热门帖子</h2>
          <Link href="/forum" className="text-sm text-blue-600 hover:underline">进入八卦专区</Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无帖子</p>
        ) : (
          <div className="grid gap-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} boardId={post.board.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
