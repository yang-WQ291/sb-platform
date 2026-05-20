import React from "react";
import { View, Text } from "react-native";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "在售", color: "text-emerald-800", bg: "bg-emerald-100" },
  sold: { label: "已售", color: "text-stone-500", bg: "bg-stone-100" },
  off: { label: "已下架", color: "text-red-600", bg: "bg-red-100" },
};

export function ProductStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.off;
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${config.bg}`}>
      <Text className={`text-xs font-medium ${config.color}`}>{config.label}</Text>
    </View>
  );
}
