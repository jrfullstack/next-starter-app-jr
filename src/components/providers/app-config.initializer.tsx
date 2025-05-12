// AppInitializer.tsx (cliente)
"use client";
import { useEffect } from "react";

import type { AppConfig } from "@/stores";
import { useAppConfigStore } from "@/stores";

export const AppInitializer = ({ config }: { config: AppConfig }) => {
  const isLoaded = useAppConfigStore((state) => state.isLoaded);
  const setConfig = useAppConfigStore((state) => state.setConfig);

  useEffect(() => {
    if (!isLoaded) {
      setConfig(config);
    }
  }, [isLoaded, setConfig, config]);

  return null;
};
