import React from 'react';
import Modal from '../ui/Modal';
import type { Task } from '../../interfaces/Task';
import { format } from 'date-fns';
import { Calendar, Tag, Clock, CheckCircle2, Square } from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  const formattedDueDate = format(new Date(task.dueDate), 'EEEE, MMMM dd, yyyy');
  const formattedCreatedDate = format(new Date(task.createdAt), 'MMMM dd, yyyy, p');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="space-y-6 pt-2">
        {/* Header Status */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <span className="text-xs font-semibold uppercase text-[var(--color-text)]/60">
            Status
          </span>
          <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold
            ${task.isCompleted
              ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20'
            }`}
          >
            {task.isCompleted ? (
              <>
                <CheckCircle2 size={14} />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Square size={14} />
                <span>Active</span>
              </>
            )}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[var(--color-text-h)] leading-tight">
            {task.title}
          </h3>
          {task.description ? (
            <p className="text-sm text-[var(--color-text)] bg-[var(--color-border)]/20 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          ) : (
            <p className="text-sm italic text-[var(--color-text)]/40">
              No description provided.
            </p>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[var(--color-text)]/50 block">Priority</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-border)] text-[var(--color-text-h)]">
              {task.priority}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-[var(--color-text)]/50 block">Category</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
              <Tag size={12} className="mr-1.5" />
              {task.category}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-3 pt-4 border-t border-[var(--color-border)] text-sm">
          <div className="flex items-center text-[var(--color-text)]">
            <Calendar size={16} className="mr-2 text-[var(--color-accent)]" />
            <div>
              <span className="text-xs font-semibold text-[var(--color-text)]/50 block">Due Date</span>
              <span className="text-sm font-medium text-[var(--color-text-h)]">{formattedDueDate}</span>
            </div>
          </div>

          <div className="flex items-center text-[var(--color-text)]">
            <Clock size={16} className="mr-2 text-[var(--color-text)]/60" />
            <div>
              <span className="text-xs font-semibold text-[var(--color-text)]/50 block">Created At</span>
              <span className="text-sm text-[var(--color-text)]">{formattedCreatedDate}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[var(--color-border)] text-sm font-medium text-[var(--color-text-h)] hover:opacity-90 transition-opacity duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;