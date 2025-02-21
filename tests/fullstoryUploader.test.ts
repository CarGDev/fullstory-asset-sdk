import FullStoryUploader from "../src/fullstoryUploader";
import fs from "fs-extra";
import axios from "axios";

// Mock fs-extra to simulate file existence and content reading
jest.mock("fs-extra", () => ({
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(() => JSON.stringify({ assets: {}, version: "2" })),
}));

// Mock axios to simulate API responses
jest.mock("axios");

describe("FullStoryUploader", () => {
  const mockApiKey = "test-api-key";
  const mockAssetMapPath = "test/assets.json";

  it("should upload assets successfully", async () => {
    // Mock successful API response
    (axios.post as jest.Mock).mockResolvedValue({ status: 200 });

    const uploader = new FullStoryUploader({
      apiKey: mockApiKey,
      assetMapPath: mockAssetMapPath,
    });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await uploader.uploadAssets();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("✅ Assets uploaded successfully!"),
    );
    consoleSpy.mockRestore();
  });

  it("should handle file not found error", async () => {
    // Simulate a missing file
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const uploader = new FullStoryUploader({
      apiKey: mockApiKey,
      assetMapPath: "nonexistent.json",
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await uploader.uploadAssets();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("❌ Asset map file not found"),
    );
    consoleSpy.mockRestore();
  });

  it("should handle API errors", async () => {
    // Ensure the file exists so the API call runs
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Simulate an API error
    const apiError = new Error("API error");
    (axios.post as jest.Mock).mockRejectedValue(apiError);

    const uploader = new FullStoryUploader({
      apiKey: mockApiKey,
      assetMapPath: mockAssetMapPath,
    });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    await uploader.uploadAssets();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("❌ Error uploading assets"),
      apiError, // This ensures we match the error object in the log
    );

    consoleSpy.mockRestore();
  });
});
