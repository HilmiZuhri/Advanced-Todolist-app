import { useState } from 'react';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import type { Task } from './interfaces/Task'; // Import Task interface
import TaskFormModal from './components/common/TaskFormModal'; // Import TaskFormModal
import { Plus } from 'lucide-react'; // Import ikon Plus
import TaskList from './components/common/TaskList'; // Import TaskList untuk menampilkan daftar tugas
import FilterAndSortControls from './components/common/FilterAndSortControls'; // Import FilterAndSortControls

const TaskListView: React.FC = () => {
  const { filteredAndSortedTasks } = useTasks(); // Tidak perlu lagi addTask, deleteTask, updateTask di sini
  // ... (state isModalOpen, taskToEdit, handleOpenAddModal, handleOpenEditModal, handleCloseModal tetap sama)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const handleOpenAddModal = () => {
    setTaskToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(undefined);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[var(--color-text-h)]">Your Tasks</h2>

      <div className="flex flex-col gap-4"> {/* Menggunakan flex-col untuk menumpuk kontrol dan tombol */}
        {/* Filter dan Sort Controls */}
        <FilterAndSortControls />

        <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
          <p className="text-[var(--color-text)]">
            Total tasks displayed: {filteredAndSortedTasks.length}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-md hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2 shadow-md"
          >
            <Plus size={20} />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      <TaskList tasks={filteredAndSortedTasks} onEditTask={handleOpenEditModal} />

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};


function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppLayout>
          <TaskListView />
        </AppLayout>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;