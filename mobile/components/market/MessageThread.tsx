import React, { useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  fromId: string;
  fromUser: { username: string };
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId?: string;
}

export function MessageThread({ messages, currentUserId = "" }: MessageThreadProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  return (
    <ScrollView ref={scrollRef} className="flex-1 px-4 py-2">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.content}
          createdAt={msg.createdAt}
          isOwn={msg.fromId === currentUserId}
          fromUsername={msg.fromUser.username}
        />
      ))}
    </ScrollView>
  );
}
