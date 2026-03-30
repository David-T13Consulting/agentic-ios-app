const MAX_MESSAGE_LENGTH = 4000;

interface ValidationSuccess {
  ok: true;
  text: string;
}

interface ValidationFailure {
  ok: false;
  error: string;
}

type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validate and sanitize user chat input.
 * Returns the cleaned text on success or an error message on failure.
 */
export function validateMessageInput(raw: string): ValidationResult {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Message cannot be empty." };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      error: `Message is too long (${trimmed.length} characters). Maximum is ${MAX_MESSAGE_LENGTH}.`,
    };
  }

  // Strip control characters (except newline \x0A and tab \x09) that could cause rendering issues
  const sanitized = trimmed
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      // Allow printable ASCII (0x20+), newline (0x0A), tab (0x09), and carriage return (0x0D)
      if (code === 0x09 || code === 0x0a || code === 0x0d) return true;
      if (code <= 0x1f || code === 0x7f) return false;
      return true;
    })
    .join("");

  return { ok: true, text: sanitized };
}

const API_KEY_PATTERN = /^sk-ant-/;

/**
 * Validate that an API key has the expected format.
 */
export function validateApiKey(key: string): ValidationResult {
  const trimmed = key.trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Please enter an API key." };
  }

  if (!API_KEY_PATTERN.test(trimmed)) {
    return {
      ok: false,
      error: "API key should start with 'sk-ant-'. Check that you copied the full key.",
    };
  }

  if (trimmed.length < 20) {
    return {
      ok: false,
      error: "API key looks too short. Check that you copied the full key.",
    };
  }

  return { ok: true, text: trimmed };
}
