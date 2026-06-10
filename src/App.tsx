// src/App.tsx (hanya bagian TaskListView yang dimodifikasi)

// ... (imports lainnya tetap sama)
import { useState } from 'react';
import { TaskProvider, useTasks } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import type { Task } from './interfaces/Task'; // Import Task interface
import TaskFormModal from './components/common/TaskFormModal'; // Import TaskFormModal

const TaskListView: React.FC = () => {
  const { filteredAndSortedTasks, addTask, deleteTask, updateTask } = useTasks(); // Tambahkan deleteTask dan updateTask

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined); // State untuk tugas yang akan diedit

  const handleOpenAddModal = () => {
    setTaskToEdit(undefined); // Pastikan mode tambah
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task); // Set tugas yang akan diedit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(undefined); // Reset taskToEdit setelah modal ditutup
  };

  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { isCompleted: !task.isCompleted });
  };

  // Contoh untuk menambahkan tugas agar ada data di sidebar (opsional, bisa dihapus nanti)
  // const handleAddTaskExample = () => {
  //   addTask({
  //     title: "Design Homepage UI",
  //     description: "Create initial wireframes and mockups for the homepage.",
  //     priority: "High",
  //     category: "Work",
  //     dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  //   });
  //   addTask({
  //     title: "Buy groceries for dinner",
  //     priority: "Medium",
  //     category: "Shopping",
  //     dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  //   });
  //   addTask({
  //     title: "Read 'The Alchemist' Chapters 1-3",
  //     priority: "Low",
  //     category: "Personal",
  //     dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
  //   });
  // };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-[var(--color-text-h)]">Your Tasks</h2>

      <div className="flex justify-between items-center mb-4">
        <p className="text-[var(--color-text)]">
          Total filtered tasks: {filteredAndSortedTasks.length}
        </p>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-md hover:opacity-90 transition-opacity duration-200 flex items-center space-x-2"
        >
          {/* <Plus size={20} /> */} {/* Nanti bisa pakai ikon Plus */}
          <span>Add New Task</span>
        </button>
      </div>

      {filteredAndSortedTasks.length === 0 ? (
        <p className="text-[var(--color-text)]/70">No tasks found. Try adding some!</p>
      ) : (
        <ul className="space-y-2">
          {filteredAndSortedTasks.map(task => (
            <li
              key={task.id}
              className="p-4 bg-[var(--color-bg)] rounded-md shadow-sm border border-[var(--color-border)] flex items-center justify-between"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggleComplete(task)}
                  className="mr-3 w-5 h-5 accent-[var(--color-accent)] cursor-pointer"
                />
                <div>
                  <h3
                    className={`text-xl font-semibold text-[var(--color-text-h)] ${
                      task.isCompleted ? 'line-through text-[var(--color-text)]/60' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text)]/80">
                    Category: <span className="font-medium text-[var(--color-accent)]">{task.category}</span> | Priority: {task.priority} | Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenEditModal(task)}
                  className="p-2 rounded-md text-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] transition-colors duration-200"
                  aria-label="Edit task"
                >
                  {/* <Edit2 size={18} /> */} {/* Nanti pakai ikon Edit */}
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                  aria-label="Delete task"
                >
                  {/* <Trash2 size={18} /> */} {/* Nanti pakai ikon Delete */}
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
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
      <TaskProvider>
        <AppLayout>
          <TaskListView />
        </AppLayout>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;