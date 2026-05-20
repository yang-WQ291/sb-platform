import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { ProductCard } from "../../components/market/ProductCard";
import { CategoryFilter } from "../../components/market/CategoryFilter";
import { SearchBar } from "../../components/market/SearchBar";
import { EmptyState } from "../../components/ui/EmptyState";
import api from "../../lib/api";

export default function MarketTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "全部") params.set("category", category);
      if (search) params.set("search", search);
      const data = await api.get<any>(`/api/market?${params.toString()}`);
      setProducts(data.products || []);
    } catch (err) {
      console.error("Market fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, [category, search]);

  return (
    <View className="flex-1 bg-warm-cream">
      <View className="px-4 pt-4">
        <SearchBar onSearch={setSearch} />
        <CategoryFilter selected={category} onSelect={setCategory} />
      </View>
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProducts} />}
      >
        {loading && products.length === 0 ? (
          <ActivityIndicator size="large" color="#10b981" className="mt-20" />
        ) : products.length > 0 ? (
          products.map((p: any) => <ProductCard key={p.id} product={p} />)
        ) : (
          <EmptyState icon="🛒" title="暂无商品" description="快去发布第一个商品吧" />
        )}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
