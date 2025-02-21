import { jest } from "@jest/globals";
import * as fs from "fs";
import * as path from "path";

// Create mock functions
const mockUploadAssets = jest.fn();
const mockFullStoryUploader = jest.fn().mockImplementation(() => ({
  uploadAssets: mockUploadAssets,
}));

// Mock modules before importing the CLI
jest.mock("../src/fullstoryUploader", () => ({
  __esModule: true,
  default: mockFullStoryUploader,
}));

// Mock dotenv
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("FullStory Asset Uploader CLI", () => {
  const testAssetMapPath = path.resolve(__dirname, "test-asset-map.json");
  const testApiKey = "test-api-key";

  // Create a test asset map file before tests
  beforeAll(() => {
    const testAssetMap = {
      assets: [
        { id: "asset1", path: "./asset1.js" },
        { id: "asset2", path: "./asset2.css" },
      ],
    };

    fs.writeFileSync(testAssetMapPath, JSON.stringify(testAssetMap, null, 2));
  });

  // Clean up after tests
  afterAll(() => {
    if (fs.existsSync(testAssetMapPath)) {
      fs.unlinkSync(testAssetMapPath);
    }
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset modules to ensure clean Commander instance for each test
    jest.resetModules();
  });

  it("should exit with an error when missing required arguments", () => {
    // Mock console.error and process.exit
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit(${code}) was called`);
    });

    try {
      // Run CLI with no arguments
      require("../src/cli");
    } catch (e) {
      const error = e as Error;
      expect(error.message).toContain("process.exit(1)");
    }

    // ✅ Ensure an error message was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("error: required option"),
    );

    // ✅ Ensure process.exit was called
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Restore original implementations
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it("should initialize FullStoryUploader and call uploadAssets with correct options", () => {
    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = [
      "node",
      "cli.js",
      "--apiKey",
      testApiKey,
      "--assetMap",
      testAssetMapPath,
    ];

    try {
      // Import CLI module which will execute the program
      require("../src/cli");

      // Verify FullStoryUploader was constructed with correct params
      expect(mockFullStoryUploader).toHaveBeenCalledWith({
        apiKey: testApiKey,
        assetMapPath: testAssetMapPath,
      });

      // Verify uploadAssets was called
      expect(mockUploadAssets).toHaveBeenCalled();
    } finally {
      // Restore original process.argv
      process.argv = originalArgv;
    }
  });

  it("should initialize FullStoryUploader with short flag options", () => {
    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ["node", "cli.js", "-k", testApiKey, "-a", testAssetMapPath];

    try {
      // Import CLI module which will execute the program
      require("../src/cli");

      // Verify FullStoryUploader was constructed with correct params
      expect(mockFullStoryUploader).toHaveBeenCalledWith({
        apiKey: testApiKey,
        assetMapPath: testAssetMapPath,
      });

      // Verify uploadAssets was called
      expect(mockUploadAssets).toHaveBeenCalled();
    } finally {
      // Restore original process.argv
      process.argv = originalArgv;
    }
  });

  it("should display version information with --version flag", () => {
    // ✅ Mock process.exit to prevent Jest from failing
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit(0) was called");
    });

    // ✅ Capture stdout output
    const originalWrite = process.stdout.write;
    let output = "";
    process.stdout.write = (chunk: any) => {
      output += chunk;
      return true;
    };

    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ["node", "cli.js", "--version"];

    try {
      require("../src/cli");
    } catch (e) {
      // Ignore expected process.exit error
      const error = e as Error;
      expect(error.message).toContain("process.exit");
    }

    // ✅ Ensure the version is in the output
    expect(output).toContain("0.0.1");

    // Restore mocks and original argv
    process.stdout.write = originalWrite;
    process.argv = originalArgv;
    exitSpy.mockRestore();
  });

  it("should display help information with --help flag", () => {
    // Mock console.log and process.exit
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const exitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit(${code}) was called`);
    });

    // Mock process.argv
    const originalArgv = process.argv;
    process.argv = ["node", "cli.js", "--help"];

    try {
      // Import CLI module
      require("../src/cli");
    } catch (e) {
      // Expected error from process.exit()
      const error = e as Error;
      expect(error.message).toContain("process.exit");
    }

    // Restore mocks and original argv
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
    process.argv = originalArgv;
  });
});
