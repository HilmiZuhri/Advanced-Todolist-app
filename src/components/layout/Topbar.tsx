import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react'; 
import { useTheme } from '../../contexts/ThemeContext';

interface TopbarProps {
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 mr-2 rounded-full text-[var(--color-text-h)] hover:bg-[var(--color-border)] transition-colors duration-200 lg:hidden" // `lg:hidden` menyembunyikan di layar large ke atas
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[var(--color-text-h)]">
          TaskFlow
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
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