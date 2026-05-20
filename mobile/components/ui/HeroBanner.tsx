import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface HeroBannerProps {
  stats: { label: string; value: string | number }[];
}

export function HeroBanner({ stats }: HeroBannerProps) {
  return (
    <LinearGradient
      colors={["#f59e0b", "#ea580c", "#dc2626"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-2xl p-5 mb-4"
    >
      <Text className="text-white text-xl font-bold mb-1">SB 社区</Text>
      <Text className="text-white/80 text-sm mb-4">
        悬赏互助 · 八卦吃瓜 · 二手闲置
      </Text>
      <View className="flex-row justify-around">
        {stats.map((s) => (
          <View key={s.label} className="items-center">
            <Text className="text-white text-lg font-bold">{s.value}</Text>
            <Text className="text-white/70 text-xs">{s.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}
