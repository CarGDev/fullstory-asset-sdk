import FullStoryUploader from "./fullstoryUploader";

export function uploadAssets(apiKey: string, assetMapPath: string) {
  const uploader = new FullStoryUploader({ apiKey, assetMapPath });
  return uploader.uploadAssets();
}
