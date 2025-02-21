import fs from "fs-extra";
import * as path from "path";
import axios from "axios";

interface UploadOptions {
  apiKey: string;
  assetMapPath: string;
}

class FullStoryUploader {
  private apiKey: string;
  private assetMapPath: string;

  constructor(options: UploadOptions) {
    this.apiKey = options.apiKey;
    this.assetMapPath = options.assetMapPath;
  }

  public async uploadAssets() {
    try {
      if (!fs.existsSync(this.assetMapPath)) {
        console.error(`❌ Asset map file not found: ${this.assetMapPath}`);
        return;
      }

      const assetMap = fs.readFileSync(this.assetMapPath, "utf-8");
      const response = await axios.post(
        "https://api.fullstory.com/assets/upload",
        JSON.parse(assetMap),
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        console.log("✅ Assets uploaded successfully!");
      } else {
        console.error(`❌ Failed to upload assets. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error uploading assets", error);
    }
  }
}

export default FullStoryUploader;
