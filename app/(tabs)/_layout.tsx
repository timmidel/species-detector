import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, false),
        tabBarStyle: {
          height: 55,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discoveries",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="magnifying-glass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Identify",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="camera-retro" color={color} />
          ),
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
