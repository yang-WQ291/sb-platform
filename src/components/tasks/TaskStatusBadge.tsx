const STATUS_MAP: Record<string, { label: string; className: string }> = {
  open: { label: "进行中", className: "bg-green-100 text-green-700" },
  in_progress: { label: "已接取", className: "bg-blue-100 text-blue-700" },
  completed: { label: "已完成", className: "bg-gray-100 text-gray-600" },
  cancelled: { label: "已取消", className: "bg-red-100 text-red-600" },
};

export function TaskStatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || { label: status, className: "bg-gray-100" };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}
