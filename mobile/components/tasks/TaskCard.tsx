import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Card } from "../ui/Card";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskCardProps {
  task: { id: string; title: string; rewardSb: number; status: string; publisher: { username: string } };
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link href={`/tasks/${task.id}`} asChild>
      <Card leftBorder="amber" className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold text-stone-800 flex-1" numberOfLines={1}>
            {task.title}
          </Text>
          <TaskStatusBadge status={task.status} />
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-amber-500 font-bold">{task.rewardSb} SB</Text>
          <Text className="text-xs text-stone-400">@{task.publisher.username}</Text>
        </View>
      </Card>
    </Link>
  );
}
