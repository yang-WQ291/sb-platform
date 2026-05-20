import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Card } from "../ui/Card";
import { ProductStatusBadge } from "./ProductStatusBadge";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    category: string;
    status: string;
    seller: { username: string };
    sellerRating?: number;
  };
}

const categoryIcons: Record<string, string> = {
  "数码": "💻", "书籍": "📚", "生活": "🏠", "其他": "📦",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/market/${product.id}`} asChild>
      <Pressable>
        <Card leftBorder="emerald" className="mb-3 flex-row">
          <View className="w-20 h-20 rounded-xl bg-emerald-50 items-center justify-center mr-3">
            <Text className="text-3xl">{categoryIcons[product.category] || "📦"}</Text>
          </View>
          <View className="flex-1 justify-center">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-semibold text-stone-800 flex-1" numberOfLines={1}>
                {product.title}
              </Text>
              <ProductStatusBadge status={product.status} />
            </View>
            <Text className="text-lg font-bold text-amber-500 mb-1">
              {product.price} SB
            </Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-stone-400">
                @{product.seller.username}
              </Text>
              {product.sellerRating != null && (
                <Text className="text-xs text-amber-500 ml-2">
                  ⭐ {product.sellerRating}
                </Text>
              )}
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
