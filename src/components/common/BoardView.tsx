import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../interfaces/Task';
import { useTasks } from '../../contexts/TaskContext';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  isCompletedColumn: boolean;
  onEditTask: (task: Task) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ title, tasks, isCompletedColumn, onEditTask }) => {
  const { updateTask } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { isCompleted: isCompletedColumn });
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-h-[500px] p-4 rounded-xl border transition-colors duration-200
        ${isDragOver 
          ? 'bg-[var(--color-accent-bg)] border-[var(--color-accent)] border-dashed' 
          : 'bg-[var(--color-bg)] border-[var(--color-border)]'
        }`}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-border)]">
        <h3 className="text-lg font-bold text-[var(--color-text-h)] flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-text)]">
            {tasks.length}
          </span>
        </h3>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {tasks.map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', task.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <TaskCard task={task} onEdit={onEditTask} />
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--color-border)] rounded-lg p-6">
            <p className="text-sm text-[var(--color-text)]/50 text-center">
              Drag tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface BoardViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ tasks, onEditTask }) => {
  const toDoTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <BoardColumn
        title="To Do"
        tasks={toDoTasks}
        isCompletedColumn={false}
        onEditTask={onEditTask}
      />
      <BoardColumn
        title="Completed"
        tasks={completedTasks}
        isCompletedColumn={true}
        onEditTask={onEditTask}
      />
    </motion.div>
  );
};

export default BoardView;