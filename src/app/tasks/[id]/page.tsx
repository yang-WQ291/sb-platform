import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { TaskApplication } from "@/components/tasks/TaskApplication";
import { SBBadge } from "@/components/shared/SBBadge";
import Link from "next/link";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      publisher: { select: { id: true, username: true } },
      assignee: { select: { id: true, username: true } },
      applications: { include: { applicant: { select: { id: true, username: true } } } },
    },
  });

  if (!task) notFound();

  const hasApplied = user
    ? task.applications.some((a) => a.applicantId === user.id)
    : false;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/tasks" className="text-sm text-gray-400 hover:underline mb-4 inline-block">&larr; 返回悬赏大厅</Link>

      <div className="bg-white rounded-xl border p-6 mb-4">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-xl font-bold">{task.title}</h1>
          <TaskStatusBadge status={task.status} />
        </div>
        <p className="text-gray-600 whitespace-pre-wrap mb-4">{task.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <SBBadge balance={task.rewardSb} />
          <span>发布者: @{task.publisher.username}</span>
          {task.assignee && <span>执行者: @{task.assignee.username}</span>}
          <span>{new Date(task.createdAt).toLocaleDateString("zh-CN")}</span>
          {task.deadline && <span>截止: {new Date(task.deadline).toLocaleDateString("zh-CN")}</span>}
        </div>
      </div>

      <TaskApplication
        taskId={task.id}
        taskStatus={task.status}
        publisherId={task.publisherId}
        currentUserId={user?.id}
        assignedUserId={task.assignedUserId}
        hasApplied={hasApplied}
      />

      {task.applications.length > 0 && task.publisherId === user?.id && task.status === "open" && (
        <div className="bg-white rounded-xl border p-4 mt-4">
          <h3 className="font-semibold mb-3">申请列表 ({task.applications.length})</h3>
          <ul className="divide-y">
            {task.applications.map((app) => (
              <li key={app.id} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">@{app.applicant.username}</span>
                  {app.message && <p className="text-gray-400 text-xs mt-0.5">{app.message}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
