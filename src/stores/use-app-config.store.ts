import { create } from "zustand";

import { getAppConfig } from "@/actions/config/get-app-config";

export interface AppConfig {
  logoUrl?: string | null;
  isMaintenanceMode: boolean;

  isUserSignUpEnabled: boolean;
  maxActiveSessionsPerUser?: number | null;
  isSingleUserPerIpEnforced: boolean;
  isEmailVerificationRequired: boolean;
  isGlobalTwoFactorAuthEnabled: boolean;
  sessionTimeoutLimitMinutes?: number | null;

  siteDisplayName?: string;
  siteUrl?: string;
  siteDescription?: string;
  emailUser?: string | null;
  isEmailConfigured: boolean;
}

interface AppConfigStore {
  config: AppConfig | null;
  isLoaded: boolean;
  setConfig: (config: AppConfig) => void;
  fetchConfig: () => Promise<void>;
}

export const useAppConfigStore = create<AppConfigStore>((set) => ({
  config: null,
  isLoaded: false,

  setConfig: (config) => set({ config, isLoaded: true }),

  fetchConfig: async () => {
    try {
      const res = await getAppConfig();

      set({ config: res, isLoaded: true });
    } catch (error) {
      console.error("Error cargando AppConfig:", error);
    }
  },
}));
