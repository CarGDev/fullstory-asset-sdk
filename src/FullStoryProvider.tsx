import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import FullStoryUploader from "./fullstoryUploader";

// Define TypeScript interface for the context
interface FullStoryContextProps {
  assetMapId: string | null;
}

// Create a React Context with default values
const FullStoryContext = createContext<FullStoryContextProps>({
  assetMapId: null,
});

// Custom hook to access FullStory context
export const useFullStory = () => useContext(FullStoryContext);

// Define props for the FullStoryProvider
interface FullStoryProviderProps {
  apiKey: string;
  assetMapPath: string;
  orgId: string; // Mandatory orgId
  children: ReactNode; // ReactNode for proper children typing
}

export const FullStoryProvider: React.FC<FullStoryProviderProps> = ({
  apiKey,
  assetMapPath,
  orgId,
  children,
}) => {
  const [assetMapId, setAssetMapId] = useState<string | null>(null);

  useEffect(() => {
    const uploader = new FullStoryUploader({ apiKey, assetMapPath });

    uploader
      .uploadAssets()
      .then(() => {
        console.log("✅ FullStory Assets Uploaded Successfully");

        // Example: Generate a dynamic asset_map_id
        const generatedId = Date.now().toString(36);
        setAssetMapId(generatedId);

        // ✅ Define FullStory global variables with type assertions
        (window as any)._fs_host = "fullstory.com";
        (window as any)._fs_script = "edge.fullstory.com/s/fs.js";
        (window as any)._fs_namespace = "FS";
        (window as any)._fs_org = orgId;
        (window as any)._fs_asset_map_id = generatedId;

        const script = document.createElement("script");
        script.src = `https://${(window as any)._fs_script}`;
        script.async = true;
        script.crossOrigin = "anonymous";
        script.onerror = () =>
          console.error("❌ Error loading FullStory script");

        document.body.appendChild(script);

        return () => document.body.removeChild(script);
      })
      .catch((error) => {
        console.error("❌ FullStory Asset Upload Failed:", error);
      });
  }, [apiKey, assetMapPath, orgId]);

  return (
    <FullStoryContext.Provider value={{ assetMapId }}>
      {children}
    </FullStoryContext.Provider>
  );
};
