import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  isOwn: boolean;
  fromUsername: string;
}

export function MessageBubble({ content, createdAt, isOwn, fromUsername }: MessageBubbleProps) {
  return (
    <View className={`mb-3 ${isOwn ? "items-end" : "items-start"}`}>
      <Text className="text-xs text-stone-400 mb-1">{fromUsername}</Text>
      {isOwn ? (
        <LinearGradient
          colors={["#10b981", "#059669"]}
          className="rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]"
        >
          <Text className="text-white text-sm">{content}</Text>
        </LinearGradient>
      ) : (
        <View className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[80%]">
          <Text className="text-stone-700 text-sm">{content}</Text>
        </View>
      )}
      <Text className="text-xs text-stone-300 mt-1">
        {new Date(createdAt).toLocaleString("zh-CN", {
          month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
        })}
      </Text>
    </View>
  );
}
