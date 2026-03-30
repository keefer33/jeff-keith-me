// Theme utility functions for consistent theme management across the app

import type { MantineColorScheme, MantineColorSchemeManager } from "@mantine/core";

export interface ThemeSettings {
  colorScheme: "light" | "dark" | "auto";
  themeColor: string;
}

const DEFAULT_THEME_COLOR = "cyan";
const DEFAULT_COLOR_SCHEME = "dark";

/** Legacy key Mantine used before themeSettings became the single source of truth */
const LEGACY_MANTINE_COLOR_KEY = "mantine-color-scheme-value";

function isMantineColorSchemeValue(value: unknown): value is MantineColorScheme {
  return value === "light" || value === "dark" || value === "auto";
}

// Available color options with descriptions
export const colorOptions = [
  { name: "Blue", value: "blue", description: "Professional and trustworthy" },
  { name: "Green", value: "green", description: "Success and growth" },
  { name: "Orange", value: "orange", description: "Energy and creativity" },
  { name: "Red", value: "red", description: "Attention and urgency" },
  { name: "Grape", value: "grape", description: "Luxury and creativity" },
  { name: "Pink", value: "pink", description: "Playful and modern" },
  { name: "Cyan", value: "cyan", description: "Tech-focused and clean" },
  { name: "Teal", value: "teal", description: "Calm and sophisticated" },
  { name: "Lime", value: "lime", description: "Fresh and vibrant" },
  { name: "Yellow", value: "yellow", description: "Optimistic and cheerful" },
  { name: "Indigo", value: "indigo", description: "Deep and professional" },
  { name: "Violet", value: "violet", description: "Creative and artistic" },
  { name: "Gray", value: "gray", description: "Professional and trustworthy" },
  { name: "Dark", value: "dark", description: "Professional and trustworthy" },
];

/** Local storage key for theme settings (exported for color-scheme manager + inline script) */
export const THEME_SETTINGS_KEY = "themeSettings";

/**
 * Load theme settings from localStorage (SSR-safe).
 */
export const loadThemeSettings = (): ThemeSettings => {
  if (typeof window === "undefined") {
    return {
      colorScheme: DEFAULT_COLOR_SCHEME,
      themeColor: DEFAULT_THEME_COLOR,
    };
  }

  try {
    const stored = localStorage.getItem(THEME_SETTINGS_KEY);
    if (stored) {
      const settings = JSON.parse(stored) as Partial<ThemeSettings>;
      let colorScheme = settings.colorScheme;
      if (!isMantineColorSchemeValue(colorScheme)) {
        const legacy = localStorage.getItem(LEGACY_MANTINE_COLOR_KEY);
        colorScheme = isMantineColorSchemeValue(legacy) ? legacy : DEFAULT_COLOR_SCHEME;
      }
      return {
        colorScheme: colorScheme ?? DEFAULT_COLOR_SCHEME,
        themeColor: settings.themeColor || DEFAULT_THEME_COLOR,
      };
    }

    const legacyOnly = localStorage.getItem(LEGACY_MANTINE_COLOR_KEY);
    if (isMantineColorSchemeValue(legacyOnly)) {
      return {
        colorScheme: legacyOnly,
        themeColor: DEFAULT_THEME_COLOR,
      };
    }
  } catch (error) {
    console.error("Error loading theme settings:", error);
  }

  return {
    colorScheme: DEFAULT_COLOR_SCHEME,
    themeColor: DEFAULT_THEME_COLOR,
  };
};

/**
 * Mantine color scheme manager backed by `themeSettings` JSON so reload matches
 * `saveThemeSettings` and does not fight `mantine-color-scheme-value`.
 */
export function themeSettingsColorSchemeManager(): MantineColorSchemeManager {
  let handleStorageEvent: (event: StorageEvent) => void;

  return {
    get: (defaultValue) => {
      const settings = loadThemeSettings();
      return isMantineColorSchemeValue(settings.colorScheme) ? settings.colorScheme : defaultValue;
    },
    set: (value) => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        const current = loadThemeSettings();
        const updated: ThemeSettings = { ...current, colorScheme: value };
        localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(updated));
        localStorage.setItem(LEGACY_MANTINE_COLOR_KEY, value);
      } catch (error) {
        console.warn("[theme] Unable to persist color scheme.", error);
      }
    },
    subscribe: (onUpdate) => {
      handleStorageEvent = (event: StorageEvent) => {
        if (event.storageArea === window.localStorage && event.key === THEME_SETTINGS_KEY) {
          try {
            const parsed = event.newValue
              ? (JSON.parse(event.newValue) as Partial<ThemeSettings>)
              : {};
            if (isMantineColorSchemeValue(parsed.colorScheme)) {
              onUpdate(parsed.colorScheme);
            }
          } catch {
            /* ignore */
          }
        }
      };
      window.addEventListener("storage", handleStorageEvent);
    },
    unsubscribe: () => {
      window.removeEventListener("storage", handleStorageEvent);
    },
    clear: () => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        const current = loadThemeSettings();
        localStorage.setItem(
          THEME_SETTINGS_KEY,
          JSON.stringify({ ...current, colorScheme: DEFAULT_COLOR_SCHEME })
        );
        localStorage.setItem(LEGACY_MANTINE_COLOR_KEY, DEFAULT_COLOR_SCHEME);
      } catch (error) {
        console.warn("[theme] Unable to clear color scheme.", error);
      }
    },
  };
}

/**
 * Save theme settings to localStorage
 */
export const saveThemeSettings = (settings: Partial<ThemeSettings>): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const currentSettings = loadThemeSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(updatedSettings));
    if (isMantineColorSchemeValue(updatedSettings.colorScheme)) {
      localStorage.setItem(LEGACY_MANTINE_COLOR_KEY, updatedSettings.colorScheme);
    }
  } catch (error) {
    console.error("Error saving theme settings:", error);
  }
};

/**
 * Get color option by value
 */
