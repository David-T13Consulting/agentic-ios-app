import { generateId } from "../id";

describe("generateId", () => {
  it("returns a non-empty string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("returns unique IDs on successive calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("uses crypto.randomUUID when available", () => {
    const mockUUID = "550e8400-e29b-41d4-a716-446655440000";
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", {
      value: { randomUUID: jest.fn(() => mockUUID) },
      configurable: true,
    });

    expect(generateId()).toBe(mockUUID);

    Object.defineProperty(globalThis, "crypto", {
      value: original,
      configurable: true,
    });
  });

  it("falls back to hex string when crypto.randomUUID is unavailable", () => {
    const original = globalThis.crypto;
    Object.defineProperty(globalThis, "crypto", {
      value: {},
      configurable: true,
    });

    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{32}$/);

    Object.defineProperty(globalThis, "crypto", {
      value: original,
      configurable: true,
    });
  });
});
