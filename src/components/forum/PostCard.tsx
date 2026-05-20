import Link from "next/link";
import { UserAvatar } from "@/components/shared/UserAvatar";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    createdAt: Date;
    author: { id: string; username: string };
    _count: { comments: number };
  };
  boardId: string;
}

export function PostCard({ post, boardId }: PostCardProps) {
  return (
    <Link
      href={`/forum/${boardId}/${post.id}`}
      className="block py-4 px-3 rounded-lg hover:bg-white transition-colors"
      style={{ borderLeft: "4px solid #6366f1" }}
    >
      <h3 className="text-base font-semibold text-stone-800 leading-snug">{post.title}</h3>
      <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
        <div className="flex items-center gap-1.5">
          <UserAvatar username={post.author.username} size={18} />
          <span className="text-stone-500">{post.author.username}</span>
        </div>
        <span>{post._count.comments} 条评论</span>
        <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
      </div>
    </Link>
  );
}
