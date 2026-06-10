// src/components/layout/Sidebar.tsx
import React from 'react';
import { ListTodo, Briefcase, User, ShoppingCart, Heart, BookOpen, Tag } from 'lucide-react';
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
          // Aktif: Gunakan warna accent dari variabel CSS
          ? 'bg-[var(--color-accent)] text-white'
          // Non-aktif: Gunakan warna teks dan hover dari variabel CSS
          : 'text-[var(--color-text)] hover:bg-[var(--color-border)]'
        }`}
    >
      <Icon size={18} className="mr-3" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const Sidebar: React.FC = () => {
  const { filterOptions, setFilterOptions, tasks } = useTasks();

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
  };

  return (
    // Gunakan variabel CSS untuk warna latar belakang dan border
    <aside className="w-64 p-4 bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col h-full">
      <div className="mb-6">
        {/* Gunakan variabel CSS untuk warna teks */}
        <h2 className="text-lg font-semibold text-[var(--color-text-h)] mb-2">Categories</h2>
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