export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Study' | 'Other'; // Contoh kategori
export type ViewMode = 'list' | 'board';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; 
  isCompleted: boolean;
  createdAt: string;
}

export interface TaskFilterOptions {
  status: 'All' | 'Active' | 'Completed';
  category: TaskCategory | 'All';
}

export type TaskSortOptions = 'priority' | 'dueDate';

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  filterOptions: TaskFilterOptions;
  setFilterOptions: (options: TaskFilterOptions) => void;
  sortOption: TaskSortOptions;
  setSortOption: (option: TaskSortOptions) => void;
  filteredAndSortedTasks: Task[]; 
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

