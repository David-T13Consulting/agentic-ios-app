import { validateMessageInput, validateApiKey } from "../validation";

describe("validateMessageInput", () => {
  it("returns success for valid input", () => {
    const result = validateMessageInput("Hello world");
    expect(result).toEqual({ ok: true, text: "Hello world" });
  });

  it("trims whitespace", () => {
    const result = validateMessageInput("  hello  ");
    expect(result).toEqual({ ok: true, text: "hello" });
  });

  it("rejects empty strings", () => {
    const result = validateMessageInput("");
    expect(result).toEqual({ ok: false, error: "Message cannot be empty." });
  });

  it("rejects whitespace-only strings", () => {
    const result = validateMessageInput("   ");
    expect(result).toEqual({ ok: false, error: "Message cannot be empty." });
  });

  it("rejects messages exceeding max length", () => {
    const long = "a".repeat(4001);
    const result = validateMessageInput(long);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("too long");
      expect(result.error).toContain("4001");
    }
  });

  it("accepts messages at exactly max length", () => {
    const exact = "a".repeat(4000);
    const result = validateMessageInput(exact);
    expect(result.ok).toBe(true);
  });

  it("strips control characters", () => {
    const input = "hello\u0000world\u0008!";
    const result = validateMessageInput(input);
    expect(result).toEqual({ ok: true, text: "helloworld!" });
  });

  it("preserves newlines and tabs", () => {
    const input = "hello\tworld\nfoo";
    const result = validateMessageInput(input);
    expect(result).toEqual({ ok: true, text: "hello\tworld\nfoo" });
  });

  it("strips DEL character (0x7F)", () => {
    const input = "hello\u007Fworld";
    const result = validateMessageInput(input);
    expect(result).toEqual({ ok: true, text: "helloworld" });
  });

  it("preserves unicode characters", () => {
    const input = "Hello 🌍 café";
    const result = validateMessageInput(input);
    expect(result).toEqual({ ok: true, text: "Hello 🌍 café" });
  });
});

describe("validateApiKey", () => {
  it("accepts valid API key format", () => {
    const result = validateApiKey("sk-ant-abcdefghijklmnopqr");
    expect(result).toEqual({ ok: true, text: "sk-ant-abcdefghijklmnopqr" });
  });

  it("trims whitespace from key", () => {
    const result = validateApiKey("  sk-ant-abcdefghijklmnopqr  ");
    expect(result).toEqual({ ok: true, text: "sk-ant-abcdefghijklmnopqr" });
  });

  it("rejects empty key", () => {
    const result = validateApiKey("");
    expect(result).toEqual({ ok: false, error: "Please enter an API key." });
  });

  it("rejects key without correct prefix", () => {
    const result = validateApiKey("invalid-key-format-abcdef");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("sk-ant-");
    }
  });

  it("rejects key that is too short", () => {
    const result = validateApiKey("sk-ant-abc");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("too short");
    }
  });
});
