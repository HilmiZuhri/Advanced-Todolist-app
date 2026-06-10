// src/components/common/TaskCard.tsx
import React from 'react';
import type { Task, TaskPriority, TaskCategory } from '../../interfaces/Task';
import { useTasks } from '../../contexts/TaskContext';
import { format, isPast, isToday } from 'date-fns'; // Untuk format tanggal dan cek waktu
import { Edit2, Trash2, CheckSquare, Square, Tag, Calendar, AlertTriangle, Info, BellRing } from 'lucide-react'; // Ikon

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTasks();

  const handleToggleComplete = () => {
    updateTask(task.id, { isCompleted: !task.isCompleted });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  // Helper untuk menentukan warna prioritas
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-gray-900';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  // Helper untuk menentukan warna kategori
  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case 'Work': return 'bg-blue-500';
      case 'Personal': return 'bg-purple-500';
      case 'Shopping': return 'bg-amber-500';
      case 'Health': return 'bg-pink-500';
      case 'Study': return 'bg-indigo-500';
      case 'Other': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const formattedDueDate = format(new Date(task.dueDate), 'MMM dd, yyyy');
  const isOverdue = !task.isCompleted && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = !task.isCompleted && isToday(new Date(task.dueDate));

  return (
    <div
      className={`relative p-5 rounded-lg shadow-sm border
        ${task.isCompleted
          ? 'bg-[var(--color-bg)] opacity-70 border-[var(--color-border)]'
          : 'bg-[var(--color-bg)] border-[var(--color-border)]'
        }
        ${isOverdue ? 'border-red-500 ring-1 ring-red-500' : ''}
        ${isDueToday ? 'border-amber-500 ring-1 ring-amber-500' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Checkbox dan Judul */}
        <div className="flex items-center flex-1 min-w-0">
          <button
            onClick={handleToggleComplete}
            className={`p-1 mr-3 rounded-full transition-colors duration-200
              ${task.isCompleted
                ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'text-[var(--color-text)] hover:bg-[var(--color-border)]'
              }`}
            aria-label={task.isCompleted ? "Mark as active" : "Mark as complete"}
          >
            {task.isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
          </button>
          <h3
            className={`text-lg font-semibold text-[var(--color-text-h)] leading-tight flex-1
              ${task.isCompleted ? 'line-through text-[var(--color-text)]/60' : ''}
            `}
            title={task.title}
          >
            {task.title}
          </h3>
        </div>

        {/* Prioritas */}
        <div
          className={`flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold rounded-full capitalize
            ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-[var(--color-text)] mb-3 pr-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center flex-wrap gap-2 text-sm text-[var(--color-text)]/80 mb-4">
        {/* Kategori */}
        <span
          className={`flex items-center px-2 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(task.category)}`}
        >
          <Tag size={12} className="mr-1" /> {task.category}
        </span>
        {/* Due Date */}
        <span
          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
              isDueToday ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
              'bg-[var(--color-border)] text-[var(--color-text-h)]'
            }`}
        >
          <Calendar size={12} className="mr-1" /> {formattedDueDate}
          {isOverdue && <BellRing size={12} className="ml-1 text-red-700 dark:text-red-300 animate-pulse" />}
        </span>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-md text-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] transition-colors duration-200"
          aria-label="Edit task"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;