import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

const categories = ["全部", "数码", "书籍", "生活", "其他"];

interface CategoryFilterProps {
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
      <View className="flex-row gap-2">
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            className={`rounded-full px-4 py-2 ${
              selected === cat ? "bg-emerald-500" : "bg-white border border-stone-200"
            }`}
          >
            <Text className={`text-sm font-medium ${selected === cat ? "text-white" : "text-stone-600"}`}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
