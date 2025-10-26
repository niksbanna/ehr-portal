/**
 * State Management Store
 *
 * This file exports centralized state management stores.
 * Currently using React Context and TanStack Query for state management.
 *
 * Future consideration: Can be extended with Zustand, Redux, or other state management solutions.
 */

// Re-export existing contexts
export { ThemeContext, useTheme } from '../contexts/ThemeContext';
export { I18nContext, useI18n as useTranslation } from '../contexts/I18nContext';
export { AuthProvider, useAuth } from '../hooks/useAuth';

// Store types
export interface AppStore {
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
}

/**
 * Example of how to add additional stores:
 *
 * import create from 'zustand';
 *
 * export const useAppStore = create<AppStore>((set) => ({
 *   theme: 'light',
 *   language: 'en',
 *   user: null,
 *   setTheme: (theme) => set({ theme }),
 *   setLanguage: (language) => set({ language }),
 *   setUser: (user) => set({ user }),
 * }));
 */
