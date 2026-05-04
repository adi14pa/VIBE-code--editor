"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/lib/path-to-json";

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

// Module-level singleton — survives React StrictMode double-invoke
let webcontainerSingleton: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

async function getOrBootWebContainer(): Promise<WebContainer> {
  if (webcontainerSingleton) return webcontainerSingleton;

  // If a boot is already in progress, wait for it instead of booting again
  if (bootPromise) return bootPromise;

  bootPromise = WebContainer.boot().then((instance) => {
    webcontainerSingleton = instance;
    bootPromise = null;
    return instance;
  });

  return bootPromise;
}

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function initializeWebContainer() {
      try {
        const webcontainerInstance = await getOrBootWebContainer();

        if (!mountedRef.current) return;

        setInstance(webcontainerInstance);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize WebContainer:", err);
        if (mountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to initialize WebContainer",
          );
          setIsLoading(false);
        }
      }
    }

    initializeWebContainer();

    return () => {
      mountedRef.current = false;
      // Don't teardown here — singleton should persist across re-renders
      // Only teardown via the explicit destroy() call
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string): Promise<void> => {
      if (!instance) {
        throw new Error("WebContainer instance is not available");
      }

      try {
        const pathParts = path.split("/");
        const folderPath = pathParts.slice(0, -1).join("/");

        if (folderPath) {
          await instance.fs.mkdir(folderPath, { recursive: true });
        }

        await instance.fs.writeFile(path, content);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to write file";
        console.error(`Failed to write file at ${path}:`, err);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance],
  );

  const destroy = useCallback(() => {
    if (instance) {
      instance.teardown();
      webcontainerSingleton = null; // Reset singleton so it can be rebooted if needed
      bootPromise = null;
      setInstance(null);
      setServerUrl(null);
    }
  }, [instance]);

  return { serverUrl, isLoading, error, instance, writeFileSync, destroy };
};
