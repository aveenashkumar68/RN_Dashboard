import { create } from 'zustand';

const useDashboardStore = create((set) => ({
  stats: null,
  activities: [],
  searchQuery: '',

  setStats: (stats) => set({ stats }),
  setActivities: (activities) => set({ activities }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

export default useDashboardStore;
