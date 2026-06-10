// src/components/common/TaskList.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import dari Framer Motion
import type { Task } from '../../interfaces/Task';
import TaskCard from './TaskCard'; // Import TaskCard kita

// Install framer-motion: npm install framer-motion

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask }) => {
  // Variasi animasi untuk setiap item tugas
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 } as const,
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 }} as const,
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 }} as const, // Animasi saat dihapus/keluar
  };

  if (tasks.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[var(--color-text)]/70 text-center py-8"
      >
        No tasks found. Try adding some!
      </motion.p>
    );
  }

  return (
    // AnimatePresence penting untuk animasi keluar (exit animations)
    <AnimatePresence>
      <motion.div
        layout // Mengaktifkan Layout Animations untuk pergerakan halus saat ada perubahan layout
        className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Responsive grid
      >
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout // Penting untuk animasi pergerakan item dalam grid
          >
            <TaskCard task={task} onEdit={onEditTask} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskList;