// src/interfaces/Task.ts

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Study' | 'Other'; // Contoh kategori
export type ViewMode = 'list' | 'board';

export interface Task {
  id: string;
  title: string;
  description?: string; // Opsional
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // Menggunakan string ISO date untuk kemudahan penyimpanan dan manipulasi
  isCompleted: boolean;
  createdAt: string; // Untuk menyimpan kapan tugas dibuat
}

export interface TaskFilterOptions {
  status: 'All' | 'Active' | 'Completed';
  category: TaskCategory | 'All';
}

export type TaskSortOptions = 'priority' | 'dueDate';

// Jika kita akan memiliki konteks, kita juga bisa mendefinisikan tipenya di sini atau di file konteksnya sendiri.
export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  filterOptions: TaskFilterOptions;
  setFilterOptions: (options: TaskFilterOptions) => void;
  sortOption: TaskSortOptions;
  setSortOption: (option: TaskSortOptions) => void;
  filteredAndSortedTasks: Task[]; // Array tugas yang sudah difilter dan diurutkan
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

