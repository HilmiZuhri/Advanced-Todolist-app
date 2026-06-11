import React, { createContext, useState, useContext, useMemo, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import { useToast } from './ToastContext'; 
import type { Task, TaskPriority, TaskFilterOptions, TaskSortOptions, TaskContextType, ViewMode } from '../interfaces/Task';

const defaultFilterOptions: TaskFilterOptions = { status: 'All', category: 'All' };
const defaultSortOption: TaskSortOptions = 'dueDate';

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filterOptions, setFilterOptions] = useState<TaskFilterOptions>(defaultFilterOptions);
  const [sortOption, setSortOption] = useState<TaskSortOptions>(defaultSortOption);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('view-mode', 'list');

  const { showToast } = useToast();
  const tasksRef = useRef<Task[]>(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // --- CRUD Operations ---
  
  const addTask = useCallback((newTaskData: Omit<Task, 'id' | 'isCompleted' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: uuidv4(),
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    showToast(`Task "${newTask.title}" added successfully!`, 'success');
  }, [setTasks, showToast]);

  const updateTask = useCallback((id: string, updatedFields: Partial<Task>) => {
    const taskToUpdate = tasksRef.current.find(t => t.id === id);
    if (!taskToUpdate) return;
    if (updatedFields.isCompleted !== undefined && updatedFields.isCompleted !== taskToUpdate.isCompleted) {
      const statusMessage = updatedFields.isCompleted ? 'marked as completed!' : 'marked as active!';
      showToast(`Task "${taskToUpdate.title}" ${statusMessage}`, 'info');
    } else {
      const changedKeys = Object.keys(updatedFields) as Array<keyof Partial<Task>>;
      const hasChanges = changedKeys.some(key => {
        return updatedFields[key] !== undefined && updatedFields[key] !== taskToUpdate[key];
      });

      if (hasChanges) {
        showToast(`Task "${taskToUpdate.title}" details updated!`, 'success');
      }
    }
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? { ...task, ...updatedFields } : task))
    );
  }, [setTasks, showToast]);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasksRef.current.find(t => t.id === id);
    
    if (taskToDelete) {
      showToast(`Task "${taskToDelete.title}" deleted!`, 'error');
    }

    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks, showToast]);

  // --- Logic Filtering & Sorting ---
  const filteredAndSortedTasks = useMemo(() => {
    let currentTasks = [...tasks];

    if (filterOptions.status === 'Active') {
      currentTasks = currentTasks.filter(task => !task.isCompleted);
    } else if (filterOptions.status === 'Completed') {
      currentTasks = currentTasks.filter(task => task.isCompleted);
    }

    if (filterOptions.category !== 'All') {
      currentTasks = currentTasks.filter(task => task.category === filterOptions.category);
    }

    currentTasks.sort((a, b) => {
      if (sortOption === 'dueDate') {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime();
      } else if (sortOption === 'priority') {
        const priorityOrder: Record<TaskPriority, number> = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    return currentTasks;
  }, [tasks, filterOptions, sortOption]);

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
    viewMode,
    setViewMode,
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
    viewMode,
    setViewMode,
  ]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};