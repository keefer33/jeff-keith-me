import { create } from "zustand";
import createUniversalSelectors from "./universalSelectors";

interface AppStoreState {
  // Loading states
  loading: boolean;
  appLoading: boolean;
  pageLoading: boolean;
  themeColor: string;
  isMobile: boolean;
  setLoading: (loading: boolean) => void;
  setThemeColor: (color: string) => void;
  setAppLoading: (appLoading: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

const useAppStoreBase = create<AppStoreState>((set, get) => ({
  // Initial state
  loading: false,
  appLoading: true,
  pageLoading: false,
  themeColor: "cyan",
  isMobile: false,

  setThemeColor: (themeColor) => set({ themeColor }),
  setLoading: (loading) => set({ loading }),
  setAppLoading: (appLoading) => set({ appLoading }),
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export default createUniversalSelectors(useAppStoreBase);
