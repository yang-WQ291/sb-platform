import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import api from "../../lib/api";

interface FavoriteButtonProps {
  productId: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ productId, initialFavorited = false }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const data = await api.post<{ favorited: boolean }>(`/api/market/${productId}/favorite`);
      setFavorited(data.favorited);
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable onPress={toggle} className="flex-row items-center gap-1">
      <Text className="text-xl">{favorited ? "⭐" : "☆"}</Text>
      <Text className={`text-sm ${favorited ? "text-amber-500" : "text-stone-400"}`}>
        {favorited ? "已收藏" : "收藏"}
      </Text>
    </Pressable>
  );
}
