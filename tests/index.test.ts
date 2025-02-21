
import { jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

// Create mock functions with explicit types
const mockUploadAssets = jest.fn<() => Promise<{ success: boolean }>>().mockResolvedValue({ success: true });
const mockFullStoryUploader = jest.fn().mockImplementation(() => ({
  uploadAssets: mockUploadAssets,
}));

// Mock modules before importing the index
jest.mock('../src/fullstoryUploader', () => ({
  __esModule: true,
  default: mockFullStoryUploader,
}));

// Import the module under test
import { uploadAssets } from '../src/index';

describe('Index Module', () => {
  const testAssetMapPath = path.resolve(__dirname, 'test-asset-map.json');
  const testApiKey = 'test-api-key';

  beforeAll(() => {
    const testAssetMap = {
      assets: [
        { id: 'asset1', path: './asset1.js' },
        { id: 'asset2', path: './asset2.css' },
      ],
    };

    fs.writeFileSync(testAssetMapPath, JSON.stringify(testAssetMap, null, 2));
  });

  afterAll(() => {
    if (fs.existsSync(testAssetMapPath)) {
      fs.unlinkSync(testAssetMapPath);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize FullStoryUploader with correct params and call uploadAssets', async () => {
    const result = await uploadAssets(testApiKey, testAssetMapPath);

    expect(mockFullStoryUploader).toHaveBeenCalledWith({
      apiKey: testApiKey,
      assetMapPath: testAssetMapPath,
    });

    expect(mockUploadAssets).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('should propagate errors from FullStoryUploader.uploadAssets', async () => {
    const testError = new Error('Upload failed');
    mockUploadAssets.mockRejectedValueOnce(testError);

    await expect(uploadAssets(testApiKey, testAssetMapPath)).rejects.toThrow(testError);

    expect(mockFullStoryUploader).toHaveBeenCalledWith({
      apiKey: testApiKey,
      assetMapPath: testAssetMapPath,
    });
  });
});

