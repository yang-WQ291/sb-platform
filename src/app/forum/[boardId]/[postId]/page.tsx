import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    <div className="max-w-2xl mx-auto">
      <Link href={`/forum/${boardId}`} className="text-sm text-gray-400 hover:underline mb-2 inline-block">
        &larr; 返回 {post.board.name}
      </Link>

      <div className="bg-white rounded-xl border p-6 mb-4">
        <h1 className="text-xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600 whitespace-pre-wrap mb-4">{post.content}</p>
        <div className="text-sm text-gray-400">
          @{post.author.username} · {new Date(post.createdAt).toLocaleString("zh-CN")}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-4">
        <h3 className="font-semibold mb-4">评论 ({comments.length})</h3>
        {user ? (
          <div className="mb-4 pb-4 border-b">
            <CommentForm postId={postId} />
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-4">
            <Link href="/login" className="text-blue-600 hover:underline">登录</Link>后参与评论
          </p>
        )}
        {comments.length > 0 ? (
          <CommentTree comments={comments} postId={postId} />
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">暂无评论</p>
        )}
      </div>
    </div>
  );
}
