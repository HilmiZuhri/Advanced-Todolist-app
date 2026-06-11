// src/components/common/TaskCard.tsx
import React from 'react';
import type { Task, TaskPriority, TaskCategory } from '../../interfaces/Task';
import { useTasks } from '../../contexts/TaskContext';
import { format, isPast, isToday } from 'date-fns';
import {
  Edit2, Trash2, CheckSquare, Square, Tag, Calendar,
  AlertTriangle, Info, BellRing,
  ArrowUp, ArrowRight, ArrowDown // Ikon Prioritas
} from 'lucide-react'; // Tambahkan ikon prioritas

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

  // Helper untuk menentukan warna & ikon prioritas
  const getPriorityDisplay = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return { color: 'bg-red-500 text-white', icon: ArrowUp };
      case 'Medium': return { color: 'bg-yellow-500 text-gray-900', icon: ArrowRight };
      case 'Low': return { color: 'bg-green-500 text-white', icon: ArrowDown };
      default: return { color: 'bg-gray-400 text-white', icon: Info };
    }
  };

  // Helper untuk menentukan warna kategori (tetap sama)
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
  const checkDate = new Date(task.dueDate);
  // Pastikan isPast tidak menganggap hari ini sebagai "past" kecuali jika sudah benar-benar lewat (misal, tengah malam)
  const isOverdue = !task.isCompleted && isPast(checkDate) && !isToday(checkDate);
  const isDueToday = !task.isCompleted && isToday(checkDate);

  const priorityDisplay = getPriorityDisplay(task.priority);

  return (
    <div
    className={`relative p-5 rounded-lg shadow-sm border transition-shadow duration-200 hover:shadow-md`}>
    <div
      className={`relative p-5 rounded-lg shadow-sm border
        ${task.isCompleted
          ? 'bg-[var(--color-bg)] opacity-70 border-[var(--color-border)]'
          : 'bg-[var(--color-bg)] border-[var(--color-border)]'
        }
        ${isOverdue ? 'border-red-500 ring-2 ring-red-500' : ''} {/* Lebih tebal */}
        ${isDueToday ? 'border-amber-500 ring-2 ring-amber-500' : ''} {/* Lebih tebal */}
      `}
    >
      {/* Indikator overdue/due today di pojok kanan atas */}
      {(isOverdue || isDueToday) && (
        <div className={`absolute top-0 right-0 p-1 rounded-bl-lg rounded-tr-lg
          ${isOverdue ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}
          flex items-center space-x-1 text-xs font-bold`}
        >
          {isOverdue && <AlertTriangle size={14} />}
          {isDueToday && <BellRing size={14} />}
          <span>{isOverdue ? 'Overdue' : 'Due Today'}</span>
        </div>
      )}

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

        {/* Prioritas dengan Ikon */}
        <div
          className={`flex-shrink-0 ml-4 px-3 py-1 text-xs font-semibold rounded-full capitalize flex items-center space-x-1
            ${priorityDisplay.color}`}
        >
          <priorityDisplay.icon size={14} /> {/* Render ikon prioritas */}
          <span>{task.priority}</span>
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
    </div>
  );
};

export default TaskCard;