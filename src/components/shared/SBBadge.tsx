export function SBBadge({ balance }: { balance: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-sm font-medium">
      <span className="text-xs">SB</span> {balance}
    </span>
  );
}
