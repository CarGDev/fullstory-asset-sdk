# FullStory Asset SDK

A lightweight SDK for integrating **FullStory session tracking and asset uploading** into React applications with CLI automation.

## Table of Contents

- [Installation Guide](#installation-guide)
- [Usage Documentation](#usage-documentation)
- [Configuration Options](#configuration-options)
- [Implementation Examples](#implementation-examples)
- [Troubleshooting](#troubleshooting)
- [Contributing Guidelines](#contributing-guidelines)
- [Technical Details](#technical-details)

---

## Installation Guide

### Prerequisites

- Node.js `>=14.0`
- npm or yarn installed
- A **FullStory API Key**
- A valid **FullStory Organization ID** (`orgId`)

### Installation

You can install the package using `npm` or `yarn`:

```sh
npm install fullstory-asset-sdk
# or
yarn add fullstory-asset-sdk
```

This will install:

- A **React Provider Component** (`FullStoryProvider`) for easy integration.
- A **CLI tool** (`fullstory-uploader`) for manual asset uploads.
- A **cross-platform asset uploader** to manage FullStory assets.

---

## Usage Documentation

### 1. Using the FullStory Provider in a React App

To dynamically track sessions and manage FullStory, wrap your application with the `FullStoryProvider`:

```jsx
import React from "react";
import { FullStoryProvider } from "fullstory-asset-sdk";

function App() {
  return (
    <FullStoryProvider
      apiKey="fs-api-key-here"
      assetMapPath="path/to/asset_map.json"
      orgId="your-org-id"
    >
      <h1>My React App</h1>
    </FullStoryProvider>
  );
}

export default App;
```

### 2. CLI Tool for Asset Uploading

The package includes a command-line interface (CLI) for manually uploading assets.

```sh
npx fullstory-uploader -k YOUR_API_KEY -a path/to/asset-map.json
```

#### CLI Options

| Option                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `-k, --apiKey <key>`    | FullStory API Key (required)               |
| `-a, --assetMap <path>` | Path to the Asset Map JSON file (required) |

This command **uploads assets** to FullStory, ensuring they are correctly mapped.

---

## Configuration Options

When using `FullStoryProvider`, you need to pass:

- `apiKey` (**Required**) - Your FullStory API Key
- `orgId` (**Required**) - Your FullStory Organization ID
- `assetMapPath` (**Required**) - Path to your asset map file

Example:

```jsx
<FullStoryProvider apiKey="your-api-key" orgId="your-org-id" />
```

---

## Implementation Examples

### 1. JavaScript React Project

This package **fully supports JavaScript projects** even though it is written in TypeScript. You can directly use it in a `JS`-based React app.

```js
import { FullStoryProvider } from "fullstory-asset-sdk";

function App() {
  return (
    <FullStoryProvider
      apiKey="fs-api-key-here"
      assetMapPath="path/to/asset_map.json"
      orgId="your-org-id"
    >
      <h1>My React App</h1>
    </FullStoryProvider>
  );
}

export default App;
```

### 2. Using with Next.js

If using **Next.js**, import `FullStoryProvider` inside `_app.js`:

```js
import { FullStoryProvider } from "fullstory-asset-sdk";

function MyApp({ Component, pageProps }) {
  return (
    <FullStoryProvider
      apiKey="fs-api-key-here"
      assetMapPath="path/to/asset_map.json"
      orgId="your-org-id"
    >
      <Component {...pageProps} />
    </FullStoryProvider>
  );
}

export default MyApp;
```

### 3. Integrating with Webpack/Vite

For Webpack or Vite projects, **ensure the asset uploader runs before build**.

Example Webpack config:

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.FS_API_KEY": JSON.stringify(process.env.FS_API_KEY),
    }),
  ],
};
```

---

## Troubleshooting

### Common Issues

#### 1. FullStory Not Loading

- Ensure the API key and `orgId` are **correct**.
- Check the console for errors using:
  ```sh
  npx fullstory-uploader -k YOUR_API_KEY -a path/to/asset-map.json
  ```

#### 2. Asset Upload Fails

- Verify `assetMapPath` is correct.
- Check internet connectivity.

#### 3. CLI Command Not Found

If the CLI tool isn’t recognized:

```sh
npx fullstory-uploader --help
```

or try reinstalling:

```sh
npm install -g fullstory-asset-sdk
```

---

## Contributing Guidelines

### Project Structure

```
fullstory-asset-sdk/
│── src/
│   ├── FullStoryProvider.tsx      # React Provider Component
│   ├── fullstoryUploader.ts       # Asset upload logic
│   ├── index.ts                   # Package entry point
│   ├── cli.ts                      # CLI command script
│   ├── generate-asset-map-id.js    # Cross-platform asset uploader
│── tests/                          # Jest test files
│── package.json                    # Package metadata & dependencies
│── README.md                       # Documentation
```

### Development Setup

To set up the project locally:

```sh
git clone https://github.com/CarGDev/fullstory-asset-sdk.git
cd fullstory-asset-sdk
npm install
```

To run tests:

```sh
npm test
```

### Submitting Issues

Before opening an issue:

- **Check existing issues** to avoid duplicates.
- Provide **steps to reproduce** the problem.
- Include **error messages and logs**.

Create an issue here: [GitHub Issues](https://github.com/CarGDev/fullstory-asset-sdk/issues)

---

## Technical Details

### 1. How the Package Works

- **Cross-Platform Asset Uploading:**
  - The script (`generate-asset-map-id.js`) **detects OS** and downloads the correct FullStory asset uploader binary.
- **Dynamic Asset Map Handling:**

  - The provider **fetches the asset map** dynamically during app initialization.

- **Optimized Performance:**
  - The SDK only loads FullStory **when needed**.
  - Avoids reloading FullStory **on re-renders**.

### 2. Security Considerations

- API keys should **never be hardcoded**.
- Use **environment variables** to store credentials.
  ```sh
  export FS_API_KEY="your-api-key"
  ```

---

## Final Notes

This SDK makes **FullStory integration seamless** by automating:

- **Session tracking**
- **Asset management**
- **React provider initialization**

For any issues or contributions, check:  
👉 **[GitHub Repository](https://github.com/CarGDev/fullstory-asset-sdk)**

