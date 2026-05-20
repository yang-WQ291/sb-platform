import React from "react";
import { View, Pressable } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  leftBorder?: "amber" | "indigo" | "emerald" | null;
}

const borderMap = {
  amber: "border-l-4 border-l-amber-500 border-amber-200",
  indigo: "border-l-4 border-l-indigo-500 border-indigo-200",
  emerald: "border-l-4 border-l-emerald-500 border-emerald-200",
};

export function Card({ children, className = "", onPress, leftBorder }: CardProps) {
  const borderClass = leftBorder ? borderMap[leftBorder] : "border-gray-100";
  const Comp = onPress ? Pressable : View;
  return (
    <Comp
      className={`bg-white rounded-2xl border p-4 shadow-sm ${borderClass} ${className}`}
      onPress={onPress}
    >
      {children}
    </Comp>
  );
}
