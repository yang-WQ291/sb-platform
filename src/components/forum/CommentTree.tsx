"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { CommentForm } from "./CommentForm";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: { id: string; username: string };
  replies?: CommentData[];
}

function CommentItem({ comment, postId, depth = 0 }: { comment: CommentData; postId: string; depth?: number }) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className={depth > 0 ? "ml-10" : ""}>
      <div className="py-3 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-1.5">
          <UserAvatar username={comment.author.username} size={22} />
          <span className="text-sm font-medium text-gray-800">{comment.author.username}</span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleString("zh-CN")}
          </span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed ml-[30px]">{comment.content}</p>
        <div className="ml-[30px] mt-1.5">
          <button
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-gray-400 hover:text-[#0066FF]"
          >
            {showReply ? "取消回复" : "回复"}
          </button>
          {showReply && (
            <div className="mt-2 mb-1">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={() => setShowReply(false)}
              />
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} postId={postId} depth={depth + 1} />
      ))}
    </div>
  );
}

export function CommentTree({ comments, postId }: { comments: CommentData[]; postId: string }) {
  const roots: CommentData[] = [];
  const map = new Map<string, CommentData>();

  comments.forEach((c) => {
    map.set(c.id, { ...c, replies: [] });
  });

  map.forEach((c) => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies!.push(c);
    } else {
      roots.push(c);
    }
  });

  return (
    <div>
      {roots.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}
