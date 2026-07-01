import { create } from 'zustand';

const useTaskStore = create((set) => ({
  tasks: [],
  sortBy: 'pending_first',

  setTasks: (tasks) => set({ tasks }),
  setSortBy: (sortBy) => set({ sortBy }),

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
}));

export default useTaskStore;
