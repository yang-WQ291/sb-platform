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
    <Link
      href={`/tasks/${task.id}`}
      className="block bg-white rounded-lg border border-amber-200 p-4 hover:shadow-lg transition-shadow"
      style={{ borderLeft: "4px solid #f59e0b", boxShadow: "0 1px 4px rgba(245,158,11,0.06)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-800 truncate">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm text-stone-500">
        <SBBadge balance={task.rewardSb} />
        <span>@{task.publisher.username}</span>
        <span>{new Date(task.createdAt).toLocaleDateString("zh-CN")}</span>
      </div>
    </Link>
  );
}
