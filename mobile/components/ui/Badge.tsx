import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  color?: "amber" | "indigo" | "emerald" | "stone" | "red";
  className?: string;
}

const colorMap = {
  amber: "bg-amber-100 text-amber-800",
  indigo: "bg-indigo-100 text-indigo-800",
  emerald: "bg-emerald-100 text-emerald-800",
  stone: "bg-stone-100 text-stone-600",
  red: "bg-red-100 text-red-600",
};

export function Badge({ label, color = "stone", className = "" }: BadgeProps) {
  return (
    <View className={`rounded-full px-3 py-1 ${colorMap[color]} ${className}`}>
      <Text className="text-xs font-medium">{label}</Text>
    </View>
  );
}
