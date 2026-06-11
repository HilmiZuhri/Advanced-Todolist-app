import React from 'react';
import { ListTodo, Briefcase, User, ShoppingCart, Heart, BookOpen, Tag, X } from 'lucide-react';
import { useTasks } from '../../contexts/TaskContext';
import type { TaskCategory } from '../../interfaces/Task';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-2 rounded-md text-left transition-colors duration-200
        ${isActive
          ? 'bg-[var(--color-accent)] text-white'
          : 'text-[var(--color-text)] hover:bg-[var(--color-border)]'
        }`}
    >
      <Icon size={18} className="mr-3" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // const { filterOptions, setFilterOptions, tasks } = useTasks();
  const { filterOptions, setFilterOptions } = useTasks();

  const categoryIcons: Record<TaskCategory, React.ElementType> = {
    'Work': Briefcase,
    'Personal': User,
    'Shopping': ShoppingCart,
    'Health': Heart,
    'Study': BookOpen,
    'Other': Tag,
  };

  const handleCategoryClick = (category: TaskCategory | 'All') => {
    setFilterOptions({ ...filterOptions, category });
    if (window.innerWidth < 1024) { 
      onClose();
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 p-4 bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:translate-x-0 lg:w-64 lg:flex-shrink-0 lg:top-16 lg:h-[calc(100vh-4rem)] // Sticky di desktop, sesuaikan tinggi
      `}
    >
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-lg font-semibold text-[var(--color-text-h)]">Categories</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors duration-200"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-h)] mb-2 hidden lg:block">Categories</h2>
        <nav className="space-y-1">
          <SidebarItem
            icon={ListTodo}
            label="All Tasks"
            isActive={filterOptions.category === 'All'}
            onClick={() => handleCategoryClick('All')}
          />
          {Object.entries(categoryIcons).map(([catKey, IconComponent]) => {
            const category = catKey as TaskCategory;
            return (
              <SidebarItem
                key={category}
                icon={IconComponent}
                label={category}
                isActive={filterOptions.category === category}
                onClick={() => handleCategoryClick(category)}
              />
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;