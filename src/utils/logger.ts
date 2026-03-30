import Constants from "expo-constants";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

const IS_DEV = __DEV__ ?? Constants.expoConfig?.extra?.env !== "production";

function formatEntry(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const ctx = entry.context ? ` [${entry.context}]` : "";
  return `${prefix}${ctx} ${entry.message}`;
}

function log(
  level: LogLevel,
  message: string,
  context?: string,
  data?: Record<string, unknown>
): void {
  // In production, only warn and error are emitted
  if (!IS_DEV && (level === "debug" || level === "info")) return;

  const entry: LogEntry = {
    level,
    message,
    context,
    data,
    timestamp: new Date().toISOString(),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case "debug":
    case "info":
      // Dev-only structured output
      if (IS_DEV) {
        console.log(formatted, data ? data : "");
      }
      break;
    case "warn":
      console.warn(formatted, data ? data : "");
      break;
    case "error":
      console.error(formatted, data ? data : "");
      // In production, this is where you'd send to a crash reporting service
      // e.g., Sentry.captureException(data?.error ?? message);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: string, data?: Record<string, unknown>) =>
    log("debug", message, context, data),
  info: (message: string, context?: string, data?: Record<string, unknown>) =>
    log("info", message, context, data),
  warn: (message: string, context?: string, data?: Record<string, unknown>) =>
    log("warn", message, context, data),
  error: (message: string, context?: string, data?: Record<string, unknown>) =>
    log("error", message, context, data),
};
