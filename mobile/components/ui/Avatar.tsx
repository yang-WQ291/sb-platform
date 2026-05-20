import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AvatarProps {
  username: string;
  size?: number;
  className?: string;
}

export function Avatar({ username, size = 36, className = "" }: AvatarProps) {
  return (
    <LinearGradient
      colors={["#6366f1", "#8b5cf6"]}
      className={`rounded-full items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
        {username.charAt(0).toUpperCase()}
      </Text>
    </LinearGradient>
  );
}
