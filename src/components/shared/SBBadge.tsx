export function SBBadge({ balance }: { balance: number }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium text-white"
      style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
    >
      <span className="text-xs opacity-90">SB</span> {balance}
    </span>
  );
}
