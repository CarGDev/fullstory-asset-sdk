const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const fullStoryUrls = {
  win32:
    "https://downloads.fullstory.com/asset-uploader/fullstory-asset-uploader-windows.exe",
  darwin:
    "https://downloads.fullstory.com/asset-uploader/fullstory-asset-uploader-mac",
  linux:
    "https://downloads.fullstory.com/asset-uploader/fullstory-asset-uploader-linux",
};

const currentOS = os.platform();
const fullStoryUrl = fullStoryUrls[currentOS];

if (!fullStoryUrl) {
  console.error(`❌ Unsupported OS: ${currentOS}`);
  process.exit(1);
}

const binDir = path.join(__dirname, "../bin");
const outputFile = path.join(binDir, "fullstory-asset-uploader");

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

try {
  console.log(`⬇️ Downloading FullStory Asset Uploader for ${currentOS}...`);
  execSync(`curl -o ${outputFile} ${fullStoryUrl}`, { stdio: "inherit" });

  if (currentOS !== "win32") {
    fs.chmodSync(outputFile, "755");
  }

  console.log("✅ FullStory Asset Uploader installed successfully!");
} catch (error) {
  console.error("❌ Failed to download FullStory Asset Uploader", error);
  process.exit(1);
}
