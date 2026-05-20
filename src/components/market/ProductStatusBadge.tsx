export function ProductStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "在售", className: "bg-emerald-100 text-emerald-700" },
    sold: { label: "已售", className: "bg-stone-100 text-stone-500" },
    off: { label: "已下架", className: "bg-red-100 text-red-600" },
  };
  const { label, className } = map[status] || map.active;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
