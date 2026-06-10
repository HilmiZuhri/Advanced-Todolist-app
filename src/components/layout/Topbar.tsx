// src/components/layout/Topbar.tsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Topbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // Gunakan variabel CSS untuk warna latar belakang dan border
    <header className="flex items-center justify-between p-4 bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm">
      <div className="flex items-center">
        {/* Gunakan variabel CSS untuk warna teks */}
        <h1 className="text-2xl font-bold text-[var(--color-text-h)] mr-4">
          TaskFlow
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          // Gunakan variabel CSS untuk warna latar belakang dan teks tombol
          className="p-2 rounded-full bg-[var(--color-border)] text-[var(--color-text-h)] hover:bg-[var(--color-border)]/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Topbar;