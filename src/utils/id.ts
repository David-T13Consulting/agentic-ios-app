/**
 * Generate a unique message ID.
 *
 * Uses crypto.randomUUID() where available (iOS 15.4+, Android API 30+),
 * falls back to a simple random hex string for older environments.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: 16 random hex characters — collision-resistant for client-side IDs
  const bytes = new Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  return bytes.join("");
}
