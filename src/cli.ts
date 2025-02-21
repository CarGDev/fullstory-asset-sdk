#!/usr/bin/env node
import { program } from "commander";
import * as dotenv from "dotenv";
import FullStoryUploader from "./fullstoryUploader";

dotenv.config();

program
  .version("0.0.1")
  .description("FullStory Asset Uploader CLI")
  .requiredOption("-k, --apiKey <key>", "FullStory API Key")
  .requiredOption("-a, --assetMap <path>", "Path to Asset Map JSON file")
  .action((options) => {
    const uploader = new FullStoryUploader({
      apiKey: options.apiKey,
      assetMapPath: options.assetMap,
    });

    uploader.uploadAssets();
  });

program.configureOutput({
  writeErr: (str) => {
    console.error(str.trim());
    process.exit(1);
  },
});

program.parse(process.argv);
