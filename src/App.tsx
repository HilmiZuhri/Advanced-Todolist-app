// src/App.tsx (Update bagian imports dan komponen TaskListView)
import { useState } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react'; // Tambah ikon LayoutGrid dan List
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import TaskList from './components/common/TaskList';
import TaskFormModal from './components/common/TaskFormModal';
import FilterAndSortControls from './components/common/FilterAndSortControls';
import BoardView from './components/common/BoardView'; // Import BoardView yang baru
import type { Task } from './interfaces/Task';
import { ToastProvider } from './contexts/ToastContext';

const TaskListView: React.FC = () => {
  const { filteredAndSortedTasks, viewMode, setViewMode } = useTasks();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold text-[var(--color-text-h)]">Your Tasks</h2>
        
        {/* Toggle View Mode */}
        <div className="flex items-center bg-[var(--color-border)] p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
              ${viewMode === 'list'
                ? 'bg-[var(--color-bg)] text-[var(--color-text-h)] shadow-sm'
                : 'text-[var(--color-text)] hover:text-[var(--color-text-h)]'
              }`}
          >
            <List size={16} />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
              ${viewMode === 'board'
                ? 'bg-[var(--color-bg)] text-[var(--color-text-h)] shadow-sm'
                : 'text-[var(--color-text)] hover:text-[var(--color-text-h)]'
              }`}
          >
            <LayoutGrid size={16} />
            <span>Board View</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
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

      {/* Render tampilan berdasarkan viewMode */}
      {viewMode === 'list' ? (
        <TaskList tasks={filteredAndSortedTasks} onEditTask={handleOpenEditModal} />
      ) : (
        <BoardView tasks={filteredAndSortedTasks} onEditTask={handleOpenEditModal} />
      )}

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
      <ToastProvider> {/* Pembungkus terluar untuk sistem notifikasi */}
        <TaskProvider>
          <AppLayout>
            <TaskListView />
          </AppLayout>
        </TaskProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;