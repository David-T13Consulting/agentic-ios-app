import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getApiKey, saveApiKey } from "@/services/storage";
import { validateApiKey } from "@/utils/validation";

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getApiKey().then((key) => {
      if (key) setApiKey(key);
    });
  }, []);

  const handleSave = async () => {
    const result = validateApiKey(apiKey);
    if (!result.ok) {
      Alert.alert("Invalid API Key", result.error);
      return;
    }
    await saveApiKey(result.text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-8">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-4">
          <Ionicons name="key-outline" size={24} color="#6366f1" />
          <Text className="text-lg font-semibold text-gray-900 ml-3">
            Anthropic API Key
          </Text>
        </View>
        <Text className="text-sm text-gray-500 mb-4">
          Enter your Claude API key to enable the AI agent. Your key is stored securely
          on-device using Expo SecureStore.
        </Text>
        <TextInput
          className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-900 mb-4"
          placeholder="sk-ant-..."
          placeholderTextColor="#9ca3af"
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          className={`rounded-xl py-3 items-center ${
            saved ? "bg-green-500" : "bg-primary"
          } active:opacity-80`}
          onPress={handleSave}
        >
          <Text className="text-white font-semibold text-base">
            {saved ? "Saved!" : "Save API Key"}
          </Text>
        </Pressable>
      </View>

      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="information-circle-outline" size={24} color="#6366f1" />
          <Text className="text-lg font-semibold text-gray-900 ml-3">About</Text>
        </View>
        <Text className="text-sm text-gray-500">
          This app uses Claude by Anthropic as its AI backbone. Messages are sent directly
          to the Anthropic API — no intermediary server.
        </Text>
      </View>
    </View>
  );
}
