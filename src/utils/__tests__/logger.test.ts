import { logger } from "../logger";

describe("logger", () => {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;

  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.warn = originalWarn;
    console.error = originalError;
    console.log = originalLog;
  });

  it("logs debug messages in dev mode", () => {
    logger.debug("test debug", "TestContext");
    expect(console.log).toHaveBeenCalled();
  });

  it("logs info messages in dev mode", () => {
    logger.info("test info", "TestContext");
    expect(console.log).toHaveBeenCalled();
  });

  it("logs warnings", () => {
    logger.warn("test warning", "TestContext");
    expect(console.warn).toHaveBeenCalled();
  });

  it("logs errors", () => {
    logger.error("test error", "TestContext", { error: "details" });
    expect(console.error).toHaveBeenCalled();
  });
});
