import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { sendToAgent } from "@/services/agent";
import { getUserMessage } from "@/types/errors";
import { generateId } from "@/utils/id";
import { validateMessageInput } from "@/utils/validation";
import type { ChatMessage } from "@/types/chat";

export function useAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text: string) => {
      const validated = validateMessageInput(text);
      if (!validated.ok) {
        Alert.alert("Invalid Input", validated.error);
        return;
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: validated.text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const history = [...messages, userMessage].map((m) => {
          if (m.role === "assistant") {
            return {
              role: "assistant" as const,
              content: [{ type: "text" as const, text: m.content }],
            };
          }
          return { role: "user" as const, content: m.content };
        });

        const reply = await sendToAgent(history);

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: unknown) {
        Alert.alert("Agent Error", getUserMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, sendMessage, isLoading, clearChat };
}
