export function UserAvatar({ username, size = 28 }: { username: string; size?: number }) {
  const initial = username.charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-sm"
      style={{ width: size, height: size }}
      title={username}
    >
      {initial}
    </div>
  );
}
