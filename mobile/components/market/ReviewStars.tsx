import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";

export function ReviewStarsDisplay({ rating, count }: { rating: number; count?: number }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View className="flex-row items-center gap-0.5">
      {stars.map((s) => (
        <Text key={s} className={s <= Math.round(rating) ? "text-amber-400" : "text-stone-300"}>
          ★
        </Text>
      ))}
      {count != null && <Text className="text-xs text-stone-400 ml-1">{count}条</Text>}
    </View>
  );
}

export function ReviewStarsInput({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const stars = [1, 2, 3, 4, 5];
  const [hovered, setHovered] = useState(0);

  return (
    <View className="flex-row gap-1">
      {stars.map((s) => (
        <Pressable
          key={s}
          onPress={() => onChange(s)}
          onPressIn={() => setHovered(s)}
          onPressOut={() => setHovered(0)}
        >
          <Text className={`text-3xl ${s <= (hovered || rating) ? "text-amber-400" : "text-stone-300"}`}>
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
