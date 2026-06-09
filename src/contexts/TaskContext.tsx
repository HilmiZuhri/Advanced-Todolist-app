// src/contexts/TaskContext.tsx
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Untuk generate ID unik
import useLocalStorage from '../hooks/useLocalStorage';
import type {
  Task,
  TaskPriority,
  TaskCategory,
  TaskFilterOptions,
  TaskSortOptions,
  TaskContextType,
} from '../interfaces/Task';

// Inisialisasi default filter dan sort
const defaultFilterOptions: TaskFilterOptions = { status: 'All', category: 'All' };
const defaultSortOption: TaskSortOptions = 'dueDate';

// Buat Context dengan nilai default null
// Karena nilai sebenarnya akan diberikan oleh Provider
const TaskContext = createContext<TaskContextType | null>(null);

// Component Provider
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Menggunakan useLocalStorage untuk persistensi tasks
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  // State untuk filter dan sort
  const [filterOptions, setFilterOptions] = useState<TaskFilterOptions>(defaultFilterOptions);
  const [sortOption, setSortOption] = useState<TaskSortOptions>(defaultSortOption);

  // --- CRUD Operations ---
  const addTask = useCallback((newTaskData: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: uuidv4(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, updatedFields: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedTasks = useMemo(() => {
    let currentTasks = [...tasks]; // Buat salinan untuk dimodifikasi

    // 1. Filtering
    if (filterOptions.status === 'Active') {
      currentTasks = currentTasks.filter(task => !task.isCompleted);
    } else if (filterOptions.status === 'Completed') {
      currentTasks = currentTasks.filter(task => task.isCompleted);
    }

    if (filterOptions.category !== 'All') {
      currentTasks = currentTasks.filter(task => task.category === filterOptions.category);
    }

    // 2. Sorting
    currentTasks.sort((a, b) => {
      if (sortOption === 'dueDate') {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime(); // Urutkan dari tanggal terdekat
      } else if (sortOption === 'priority') {
        // Urutan prioritas: High > Medium > Low
        const priorityOrder: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority]; // High duluan
      }
      return 0;
    });

    return currentTasks;
  }, [tasks, filterOptions, sortOption]);

  // Nilai yang akan disediakan oleh context
  const contextValue = useMemo(() => ({
    tasks,
    addTask,
    updateTask,
    deleteTask,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    filteredAndSortedTasks,
  }), [
    tasks,
    addTask,
    updateTask,
    deleteTask,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    filteredAndSortedTasks,
  ]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom Hook untuk memudahkan penggunaan TaskContext
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};