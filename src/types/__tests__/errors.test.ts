import {
  AppError,
  NetworkError,
  AuthError,
  ValidationError,
  AgentError,
  RateLimitError,
  getUserMessage,
} from "../errors";

describe("Custom Error Types", () => {
  describe("AppError", () => {
    it("stores code, userMessage, and cause", () => {
      const cause = new Error("original");
      const error = new AppError("internal msg", "TEST_ERROR", "User-facing message", cause);

      expect(error.message).toBe("internal msg");
      expect(error.code).toBe("TEST_ERROR");
      expect(error.userMessage).toBe("User-facing message");
      expect(error.cause).toBe(cause);
      expect(error.name).toBe("AppError");
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("NetworkError", () => {
    it("has correct code and user-friendly message", () => {
      const error = new NetworkError("fetch failed");

      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.userMessage).toContain("internet connection");
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("AuthError", () => {
    it("has correct code and user-friendly message", () => {
      const error = new AuthError("401 unauthorized");

      expect(error.code).toBe("AUTH_ERROR");
      expect(error.userMessage).toContain("API key");
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("ValidationError", () => {
    it("uses userMessage as both messages when no internal message given", () => {
      const error = new ValidationError("Message too long");

      expect(error.message).toBe("Message too long");
      expect(error.userMessage).toBe("Message too long");
      expect(error.code).toBe("VALIDATION_ERROR");
    });

    it("allows separate internal and user messages", () => {
      const error = new ValidationError("Too long", "Input exceeded 4000 chars");

      expect(error.message).toBe("Input exceeded 4000 chars");
      expect(error.userMessage).toBe("Too long");
    });
  });

  describe("AgentError", () => {
    it("has correct code and user-friendly message", () => {
      const error = new AgentError("loop exceeded max depth");

      expect(error.code).toBe("AGENT_ERROR");
      expect(error.userMessage).toContain("try again");
    });
  });

  describe("RateLimitError", () => {
    it("stores retryAfterMs", () => {
      const error = new RateLimitError(30_000);

      expect(error.code).toBe("RATE_LIMIT_ERROR");
      expect(error.retryAfterMs).toBe(30_000);
      expect(error.userMessage).toContain("wait");
    });

    it("defaults to 60 seconds", () => {
      const error = new RateLimitError();

      expect(error.retryAfterMs).toBe(60_000);
    });
  });

  describe("getUserMessage", () => {
    it("returns userMessage for AppError instances", () => {
      const error = new NetworkError("fetch failed");
      expect(getUserMessage(error)).toContain("internet connection");
    });

    it("returns generic message for unknown Error instances", () => {
      const error = new Error("some random error");
      expect(getUserMessage(error)).toBe("Something went wrong. Please try again.");
    });

    it("returns generic message for non-Error values", () => {
      expect(getUserMessage("string error")).toBe("An unexpected error occurred.");
      expect(getUserMessage(null)).toBe("An unexpected error occurred.");
      expect(getUserMessage(42)).toBe("An unexpected error occurred.");
    });
  });
});
