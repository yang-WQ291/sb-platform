import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { CommentTree } from "@/components/forum/CommentTree";
import { CommentForm } from "@/components/forum/CommentForm";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ boardId: string; postId: string }>;
}) {
  const { boardId, postId } = await params;
  const user = await getCurrentUser();

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true } },
      board: { select: { id: true, name: true } },
    },
  });
  if (!post) notFound();

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, username: true } },
    },
  });

  return (
    <div className="max-w-[650px] mx-auto">
      <Link href={`/forum/${boardId}`} className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        &larr; 返回 {post.board.name}
      </Link>

      {/* Post Header */}
      <article>
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-4">{post.title}</h1>

        {/* Author bar */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
          <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 hover:opacity-80">
            <UserAvatar username={post.author.username} size={36} />
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author.username}</p>
              <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString("zh-CN")}</p>
            </div>
          </Link>
        </div>

        {/* Post body */}
        <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap mb-8">
          {post.content}
        </div>
      </article>

      {/* Actions bar */}
      <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100 mb-6 text-sm text-gray-500">
        <span>{comments.length} 条评论</span>
      </div>

      {/* Comments */}
      <div className="mb-8">
        {user ? (
          <div className="mb-6">
            <CommentForm postId={postId} />
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-6">
            <Link href="/login" className="text-[#0066FF] hover:underline">登录</Link>后参与评论
          </p>
        )}
        {comments.length > 0 ? (
          <CommentTree comments={comments} postId={postId} />
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">暂无评论，来说点什么吧</p>
        )}
      </div>
    </div>
  );
}
