import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f59e0b",
        tabBarInactiveTintColor: "#a8a29e",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#f1f5f9",
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "首页",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarLabel: "悬赏",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>🎯</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          tabBarLabel: "八卦",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>💬</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          tabBarLabel: "二手",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>🛒</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}
