import React, { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "搜索商品..." }: SearchBarProps) {
  const [value, setValue] = useState("");

  return (
    <View className="flex-row items-center bg-white border border-stone-200 rounded-xl px-4 mb-3">
      <Text className="text-stone-400 mr-2">🔍</Text>
      <TextInput
        className="flex-1 h-11 text-sm text-stone-800"
        placeholder={placeholder}
        placeholderTextColor="#a8a29e"
        value={value}
        onChangeText={setValue}
        onSubmitEditing={() => onSearch(value)}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => { setValue(""); onSearch(""); }}>
          <Text className="text-stone-400">✕</Text>
        </Pressable>
      )}
    </View>
  );
}
