import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TaskCard } from "@/components/tasks/TaskCard";
import { UserAvatar } from "@/components/shared/UserAvatar";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user) notFound();

  const [publishedTasks, completedTasks] = await Promise.all([
    prisma.task.findMany({
      where: { publisherId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { publisher: { select: { id: true, username: true } } },
    }),
    prisma.task.findMany({
      where: { assignedUserId: userId, status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { publisher: { select: { id: true, username: true } } },
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border p-6 mb-6 flex items-center gap-4">
        <UserAvatar username={user.username} size={64} />
        <div>
          <h1 className="text-xl font-bold">@{user.username}</h1>
          <p className="text-gray-500 text-sm">SB 余额: {user.wallet?.balance ?? 0}</p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">发布的悬赏</h2>
        {publishedTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无</p>
        ) : (
          <div className="grid gap-2">
            {publishedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">完成的任务</h2>
        {completedTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无</p>
        ) : (
          <div className="grid gap-2">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
