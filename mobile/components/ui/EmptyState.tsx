import React from "react";
import { View, Text } from "react-native";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = "📭", title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16">
      <Text className="text-4xl mb-4">{icon}</Text>
      <Text className="text-base font-semibold text-stone-700">{title}</Text>
      {description && (
        <Text className="text-sm text-stone-400 mt-1">{description}</Text>
      )}
    </View>
  );
}
