import Link from "next/link";

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
    <Link href={`/forum/${boardId}/${post.id}`} className="block bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-900">{post.title}</h3>
      <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
        <span>@{post.author.username}</span>
        <span>{post._count.comments} 条评论</span>
        <span>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
      </div>
    </Link>
  );
}
