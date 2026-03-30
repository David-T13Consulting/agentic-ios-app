import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-6">
      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-primary rounded-3xl items-center justify-center mb-6 shadow-lg">
          <Ionicons name="sparkles" size={48} color="#fff" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Agentic AI
        </Text>
        <Text className="text-base text-gray-500 text-center">
          Your intelligent AI assistant powered by Claude
        </Text>
      </View>

      <View className="w-full gap-4">
        <Link href="/chat" asChild>
          <Pressable className="bg-primary rounded-2xl p-5 flex-row items-center shadow-sm active:opacity-80">
            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
            <View className="ml-4 flex-1">
              <Text className="text-white font-semibold text-lg">
                Start Chat
              </Text>
              <Text className="text-indigo-200 text-sm">
                Talk to your AI agent
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c7d2fe" />
          </Pressable>
        </Link>

        <Link href="/settings" asChild>
          <Pressable className="bg-white rounded-2xl p-5 flex-row items-center shadow-sm border border-gray-100 active:opacity-80">
            <Ionicons name="settings-outline" size={24} color="#6366f1" />
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 font-semibold text-lg">
                Settings
              </Text>
              <Text className="text-gray-500 text-sm">
                Configure your API key & preferences
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
