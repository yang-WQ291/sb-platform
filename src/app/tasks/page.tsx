import { prisma } from "@/lib/prisma";
import { TaskCard } from "@/components/tasks/TaskCard";
import Link from "next/link";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "open";
  const page = parseInt(params.page || "1");
  const pageSize = 20;

  const where = status === "all" ? {} : { status };
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { publisher: { select: { id: true, username: true } } },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">悬赏大厅</h1>
        <Link href="/tasks/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          发布悬赏
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        {["open", "in_progress", "completed", "all"].map((s) => (
          <Link
            key={s}
            href={`/tasks?status=${s}`}
            className={`px-3 py-1 rounded-full text-sm ${status === s ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
          >
            {{ open: "进行中", in_progress: "已接取", completed: "已完成", all: "全部" }[s]}
          </Link>
        ))}
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-400 mt-8 text-center">暂无任务</p>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/tasks?status=${status}&page=${i + 1}`}
              className={`px-3 py-1 rounded text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
