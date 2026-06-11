// src/components/common/FilterAndSortControls.tsx
import React from 'react';
import { useTasks } from '../../contexts/TaskContext';
import type { TaskCategory, TaskFilterOptions, TaskSortOptions } from '../../interfaces/Task';
import { ListFilter, ArrowDownNarrowWide } from 'lucide-react'; // Ikon

const FilterAndSortControls: React.FC = () => {
  const {
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    tasks // Diperlukan untuk mendapatkan kategori unik
  } = useTasks();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({ ...filterOptions, status: e.target.value as TaskFilterOptions['status'] });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({ ...filterOptions, category: e.target.value as TaskCategory | 'All' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as TaskSortOptions);
  };

  // Dapatkan daftar kategori unik dari semua tugas yang ada
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));

  // Opsi yang tersedia untuk dropdown
  const statusOptions: { value: TaskFilterOptions['status']; label: string }[] = [
    { value: 'All', label: 'All' },
    { value: 'Active', label: 'Active' },
    { value: 'Completed', label: 'Completed' },
  ];

  const categoryFilterOptions: { value: TaskCategory | 'All'; label: string }[] = [
    { value: 'All', label: 'All Categories' },
    ...Array.from(new Set(tasks.map(task => task.category))).map(cat => ({ value: cat, label: cat })),
  ];

  const sortOptions: { value: TaskSortOptions; label: string }[] = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center space-x-2">
        <ListFilter size={18} className="text-[var(--color-text)]" />
        <span className="text-sm font-medium text-[var(--color-text-h)]">Filter by:</span>
      </div>

      {/* Filter Status */}
      <div className="flex-1 min-w-[120px]">
        <label htmlFor="filterStatus" className="sr-only">Filter by Status</label>
        <select
          id="filterStatus"
          value={filterOptions.status}
          onChange={handleStatusChange}
          className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)] text-sm"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Kategori */}
      <div className="flex-1 min-w-[120px]">
        <label htmlFor="filterCategory" className="sr-only">Filter by Category</label>
        <select
          id="filterCategory"
          value={filterOptions.category}
          onChange={handleCategoryChange}
          className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)] text-sm"
        >
          {categoryFilterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2 ml-auto"> {/* ml-auto untuk dorong ke kanan */}
        <ArrowDownNarrowWide size={18} className="text-[var(--color-text)]" />
        <span className="text-sm font-medium text-[var(--color-text-h)]">Sort by:</span>
      </div>

      {/* Sort Option */}
      <div className="flex-1 min-w-[120px] max-w-[150px]"> {/* Batasi lebar */}
        <label htmlFor="sortOption" className="sr-only">Sort Option</label>
        <select
          id="sortOption"
          value={sortOption}
          onChange={handleSortChange}
          className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)] text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterAndSortControls;