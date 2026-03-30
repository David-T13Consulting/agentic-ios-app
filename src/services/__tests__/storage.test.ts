import { saveApiKey, getApiKey, deleteApiKey } from "../storage";
import * as SecureStore from "expo-secure-store";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveApiKey", () => {
    it("stores the key using SecureStore", async () => {
      await saveApiKey("sk-ant-test-key");
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "anthropic_api_key",
        "sk-ant-test-key"
      );
    });
  });

  describe("getApiKey", () => {
    it("returns the stored key", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("sk-ant-test-key");
      const result = await getApiKey();
      expect(result).toBe("sk-ant-test-key");
      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("anthropic_api_key");
    });

    it("returns null when no key is stored", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);
      const result = await getApiKey();
      expect(result).toBeNull();
    });
  });

  describe("deleteApiKey", () => {
    it("removes the key from SecureStore", async () => {
      await deleteApiKey();
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith("anthropic_api_key");
    });
  });
});
