export function MessageBubble({
  content,
  isMine,
  time,
}: {
  content: string;
  isMine: boolean;
  time: string;
}) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
        style={{
          background: isMine ? "linear-gradient(135deg, #10b981, #059669)" : "#ffffff",
          color: isMine ? "white" : "#1c1917",
          border: isMine ? "none" : "1px solid #e5e7eb",
        }}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <span className={`text-xs mt-1 block ${isMine ? "text-emerald-100" : "text-stone-400"}`}>{time}</span>
      </div>
    </div>
  );
}
