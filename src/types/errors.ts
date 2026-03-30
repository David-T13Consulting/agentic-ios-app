export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly userMessage: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(
      message,
      "NETWORK_ERROR",
      "Unable to connect. Please check your internet connection and try again.",
      cause
    );
    this.name = "NetworkError";
  }
}

export class AuthError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(
      message,
      "AUTH_ERROR",
      "Authentication failed. Please check your API key in Settings.",
      cause
    );
    this.name = "AuthError";
  }
}

export class ValidationError extends AppError {
  constructor(userMessage: string, message?: string) {
    super(message ?? userMessage, "VALIDATION_ERROR", userMessage);
    this.name = "ValidationError";
  }
}

export class AgentError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(
      message,
      "AGENT_ERROR",
      "The AI agent encountered an issue. Please try again.",
      cause
    );
    this.name = "AgentError";
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfterMs: number;

  constructor(retryAfterMs: number = 60_000, cause?: unknown) {
    super(
      `Rate limited. Retry after ${retryAfterMs}ms`,
      "RATE_LIMIT_ERROR",
      "Too many requests. Please wait a moment and try again.",
      cause
    );
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) return error.userMessage;
  if (error instanceof Error) return "Something went wrong. Please try again.";
  return "An unexpected error occurred.";
}
