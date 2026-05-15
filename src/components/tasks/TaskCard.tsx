import Link from "next/link";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { SBBadge } from "@/components/shared/SBBadge";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    rewardSb: number;
    status: string;
    createdAt: Date;
    publisher: { id: string; username: string };
  };
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`} className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
        <SBBadge balance={task.rewardSb} />
        <span>@{task.publisher.username}</span>
        <span>{new Date(task.createdAt).toLocaleDateString("zh-CN")}</span>
      </div>
    </Link>
  );
}
