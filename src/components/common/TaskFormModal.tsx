// src/components/common/TaskFormModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import type { Task, TaskPriority, TaskCategory } from '../../interfaces/Task';
import { useTasks } from '../../contexts/TaskContext';
import { format } from 'date-fns'; // Untuk memformat tanggal

// Install date-fns: npm install date-fns

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task; // Opsional: jika ada, ini adalah mode edit
}

// Default state untuk form tugas baru
const defaultTaskState: Omit<Task, 'id' | 'isCompleted' | 'createdAt'> = {
  title: '',
  description: '',
  priority: 'Medium',
  category: 'Personal',
  dueDate: format(new Date(), 'yyyy-MM-dd'), // Default ke hari ini
};

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask } = useTasks();
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'isCompleted' | 'createdAt'>>(defaultTaskState);
  const titleInputRef = useRef<HTMLInputElement>(null); // Ref untuk fokus otomatis

  // Mengisi form jika ada taskToEdit
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority,
        category: taskToEdit.category,
        dueDate: taskToEdit.dueDate,
      });
    } else {
      setFormData(defaultTaskState); // Reset form untuk tugas baru
    }

    // Fokus ke input judul saat modal terbuka
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen, taskToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskToEdit) {
      // Mode Edit
      updateTask(taskToEdit.id, formData);
    } else {
      // Mode Add
      addTask(formData);
    }
    onClose(); // Tutup modal setelah submit
  };

  const title = taskToEdit ? 'Edit Task' : 'Add New Task';

  const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];
  const categoryOptions: TaskCategory[] = ['Work', 'Personal', 'Shopping', 'Health', 'Study', 'Other'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--color-text-h)] mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)]"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text-h)] mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)]"
          ></textarea>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-[var(--color-text-h)] mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)]"
          >
            {priorityOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text-h)] mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)]"
          >
            {categoryOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-[var(--color-text-h)] mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text-h)]"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-text-h)] hover:bg-[var(--color-border)] transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity duration-200"
          >
            {taskToEdit ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;