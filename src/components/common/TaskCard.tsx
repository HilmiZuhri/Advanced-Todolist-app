import React, { useState } from 'react';
import type { Task, TaskPriority, TaskCategory } from '../../interfaces/Task';
import { useTasks } from '../../contexts/TaskContext';
import { format, isPast, isToday } from 'date-fns';
import {
  Edit2, Trash2, CheckSquare, Square, Tag, Calendar,
  AlertTriangle, BellRing, ArrowUp, ArrowRight, ArrowDown
} from 'lucide-react';
import ConfirmModal from '../ui/ConfirmModal'; 
import TaskDetailModal from './TaskDetailModal'; 

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTasks();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    updateTask(task.id, { isCompleted: !task.isCompleted });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onEdit(task);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id);
  };

  const getPriorityDisplay = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return { color: 'bg-red-500 text-white', icon: ArrowUp };
      case 'Medium': return { color: 'bg-yellow-500 text-gray-900', icon: ArrowRight };
      case 'Low': return { color: 'bg-green-500 text-white', icon: ArrowDown };
      default: return { color: 'bg-gray-400 text-white', icon: AlertTriangle };
    }
  };

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case 'Work': return 'bg-blue-500';
      case 'Personal': return 'bg-purple-500';
      case 'Shopping': return 'bg-amber-500';
      case 'Health': return 'bg-pink-500';
      case 'Study': return 'bg-indigo-500';
      case 'Other': return 'bg-gray-500';
    }
  };

  const formattedDueDate = format(new Date(task.dueDate), 'MMM dd, yyyy');
  const checkDate = new Date(task.dueDate);
  const isOverdue = !task.isCompleted && isPast(checkDate) && !isToday(checkDate);
  const isDueToday = !task.isCompleted && isToday(checkDate);

  const priorityDisplay = getPriorityDisplay(task.priority);

  return (
    <>
      <div
        onClick={() => setIsDetailOpen(true)}
        className={`relative p-5 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-all duration-200
          ${task.isCompleted
            ? 'bg-[var(--color-bg)] opacity-70 border-[var(--color-border)]'
            : 'bg-[var(--color-bg)] border-[var(--color-border)]'
          }
          ${isOverdue ? 'border-red-500 ring-2 ring-red-500/50' : ''}
          ${isDueToday ? 'border-amber-500 ring-2 ring-amber-500/50' : ''}
        `}
      >
        {(isOverdue || isDueToday) && (
          <div className={`absolute top-0 right-0 p-1 rounded-bl-lg rounded-tr-lg
            ${isOverdue ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}
            flex items-center space-x-1 text-[10px] font-bold`}
          >
            {isOverdue ? <AlertTriangle size={12} /> : <BellRing size={12} />}
            <span>{isOverdue ? 'Overdue' : 'Due Today'}</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
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
              className={`text-lg font-semibold text-[var(--color-text-h)] leading-tight flex-1 truncate
                ${task.isCompleted ? 'line-through text-[var(--color-text)]/60' : ''}
              `}
            >
              {task.title}
            </h3>
          </div>

          <div
            className={`flex-shrink-0 ml-4 px-2.5 py-1 text-xs font-semibold rounded-full capitalize flex items-center space-x-1
              ${priorityDisplay.color}`}
          >
            <priorityDisplay.icon size={12} />
            <span>{task.priority}</span>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-[var(--color-text)] mb-3 line-clamp-2 pr-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-2 text-sm text-[var(--color-text)]/80 mb-4">
          <span className={`flex items-center px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${getCategoryColor(task.category)}`}>
            <Tag size={10} className="mr-1" /> {task.category}
          </span>
          <span
            className={`flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium
              ${isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                isDueToday ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                'bg-[var(--color-border)] text-[var(--color-text-h)]'
              }`}
          >
            <Calendar size={10} className="mr-1" /> {formattedDueDate}
          </span>
        </div>

        <div className="flex justify-end space-x-1">
          <button
            onClick={handleEditClick}
            className="p-1.5 rounded-md text-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] transition-colors duration-200"
            aria-label="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Modal Detail */}
      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={task}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.title}"? This action cannot be undone.`}
      />
    </>
  );
};

export default TaskCard;