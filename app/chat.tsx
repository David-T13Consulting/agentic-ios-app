import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAgent } from "@/hooks/useAgent";
import type { ChatMessage } from "@/types/chat";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const { messages, sendMessage, isLoading } = useAgent();

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage(text);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View
        className={`mx-4 mb-3 ${isUser ? "items-end" : "items-start"}`}
      >
        <View
          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
            isUser ? "bg-primary" : "bg-white border border-gray-100"
          }`}
        >
          <Text
            className={`text-base ${isUser ? "text-white" : "text-gray-800"}`}
          >
            {item.content}
          </Text>
        </View>
        <Text className="text-xs text-gray-400 mt-1 mx-2">
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="chatbubble-ellipses-outline" size={64} color="#d1d5db" />
          <Text className="text-gray-400 text-center mt-4 text-base">
            Send a message to start chatting with your AI agent
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 16 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {isLoading && (
        <View className="flex-row items-center px-6 pb-2">
          <ActivityIndicator size="small" color="#6366f1" />
          <Text className="text-gray-400 ml-2 text-sm">Agent is thinking...</Text>
        </View>
      )}

      <View className="flex-row items-end px-4 py-3 bg-white border-t border-gray-100">
        <TextInput
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-base text-gray-900 max-h-32"
          placeholder="Ask your AI agent..."
          placeholderTextColor="#9ca3af"
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          className={`ml-3 w-12 h-12 rounded-full items-center justify-center ${
            input.trim() && !isLoading ? "bg-primary" : "bg-gray-200"
          }`}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={20}
            color={input.trim() && !isLoading ? "#fff" : "#9ca3af"}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
