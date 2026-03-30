import { Component, type ErrorInfo, type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error("Unhandled error caught by ErrorBoundary", "ErrorBoundary", {
      error: error.message,
      stack: error.stack ?? "no stack",
      componentStack: errorInfo.componentStack ?? "no component stack",
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 bg-gray-50 items-center justify-center px-8">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="warning-outline" size={32} color="#ef4444" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            Something went wrong
          </Text>
          <Text className="text-base text-gray-500 text-center mb-8">
            The app ran into an unexpected error. This has been reported
            automatically.
          </Text>
          <Pressable
            className="bg-primary rounded-2xl px-8 py-4 active:opacity-80"
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text className="text-white font-semibold text-base">
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
