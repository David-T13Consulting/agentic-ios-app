import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#6366f1" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Agentic AI" }} />
          <Stack.Screen name="chat" options={{ title: "AI Agent Chat" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
