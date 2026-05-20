import React from "react";
import { View, Text } from "react-native";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "开放中", color: "text-amber-800", bg: "bg-amber-100" },
  in_progress: { label: "进行中", color: "text-indigo-800", bg: "bg-indigo-100" },
  completed: { label: "已完成", color: "text-emerald-800", bg: "bg-emerald-100" },
  cancelled: { label: "已取消", color: "text-stone-500", bg: "bg-stone-100" },
};

export function TaskStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.open;
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${config.bg}`}>
      <Text className={`text-xs font-medium ${config.color}`}>{config.label}</Text>
    </View>
  );
}
