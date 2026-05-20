export function UserAvatar({ username, size = 28 }: { username: string; size?: number }) {
  const initial = username.charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full text-white flex items-center justify-center font-medium text-sm"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      }}
      title={username}
    >
      {initial}
    </div>
  );
}
