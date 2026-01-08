import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  adminUsername: string;
  adminPassword: string;
  authenticate: (username: string, password: string) => boolean;
  logout: () => void;
  setCredentials: (username: string, password: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminUsername: 'hussein',
      adminPassword: '281286',
      
      authenticate: (username: string, password: string) => {
        const isValid = username === get().adminUsername && password === get().adminPassword;
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },
      
      logout: () => {
        set({ isAuthenticated: false });
      },
      
      setCredentials: (username: string, password: string) => {
        set({ adminUsername: username, adminPassword: password });
      },
    }),
    {
      name: 'western-bite-admin',
    }
  )
);
