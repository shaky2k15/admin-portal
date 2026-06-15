import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  /** Appearance */
  theme: 'light' | 'dark' | 'system';
  sidebarPosition: 'left' | 'right';

  /** Notifications */
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;

  /** Actions */
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarPosition: (position: 'left' | 'right') => void;
  setEmailNotifications: (enabled: boolean) => void;
  setPushNotifications: (enabled: boolean) => void;
  setWeeklyDigest: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  theme: 'dark' as const,
  sidebarPosition: 'left' as const,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: false,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),
      setSidebarPosition: (sidebarPosition) => set({ sidebarPosition }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setWeeklyDigest: (weeklyDigest) => set({ weeklyDigest }),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'admin-portal-settings',
    }
  )
);
