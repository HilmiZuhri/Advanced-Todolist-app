// src/contexts/ThemeContext.tsx - TIDAK ADA PERUBAHAN SIGNIFIKAN
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    // Hapus kedua kelas untuk memastikan hanya satu yang aktif
    root.classList.remove('light', 'dark');
    // Tambahkan kelas sesuai tema saat ini
    // Ini akan memicu @media (prefers-color-scheme: dark) dalam CSS jika tema adalah 'dark'
    // Atau hanya menggunakan variabel default jika tema adalah 'light'
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider> // <-- PERHATIKAN: Ini harusnya ThemeContext.Provider
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};