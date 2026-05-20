"use client";

import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  fromId: string;
}

export function MessageThread({ messages, currentUserId }: { messages: Message[]; currentUserId: string }) {
  return (
    <div>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.content}
          isMine={msg.fromId === currentUserId}
          time={new Date(msg.createdAt).toLocaleString("zh-CN")}
        />
      ))}
    </div>
  );
}
