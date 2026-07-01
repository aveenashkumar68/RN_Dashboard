import { create } from 'zustand';

const defaultMockUser = {
  id: 'usr_123456',
  firstName: 'Aveenash',
  lastName: 'Kumar',
  email: 'aveenash@example.com',
};

const defaultMockProfile = {
  id: 'prof_123456',
  clerk_user_id: 'usr_123456',
  first_name: 'Aveenash',
  last_name: 'Kumar',
  email: 'aveenash@example.com',
  phone: '+1 (555) 019-2834',
  address: '123 Tax Ave, Suite 100, San Francisco, CA',
};

const useAuthStore = create((set) => ({
  user: defaultMockUser, // default logged in with dummy user for smooth testing
  profile: defaultMockProfile,
  isAuthenticated: true,
  isLoading: false,

  login: (email, password) => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      firstName: 'Aveenash',
      lastName: 'Kumar',
      email: email || 'aveenash@example.com',
    };
    const mockProfile = {
      id: 'prof_' + Date.now(),
      first_name: 'Aveenash',
      last_name: 'Kumar',
      email: email || 'aveenash@example.com',
      phone: '+1 (555) 019-2834',
      address: '123 Tax Ave, Suite 100, San Francisco, CA',
    };
    set({ user: mockUser, profile: mockProfile, isAuthenticated: true });
  },

  register: (firstName, lastName, email) => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      firstName,
      lastName,
      email,
    };
    const mockProfile = {
      id: 'prof_' + Date.now(),
      first_name: firstName,
      last_name: lastName,
      email,
      phone: '',
      address: '',
    };
    set({ user: mockUser, profile: mockProfile, isAuthenticated: true });
  },

  updateProfileState: (updates) =>
    set((state) => ({
      profile: { ...state.profile, ...updates },
      user: {
        ...state.user,
        firstName: updates.first_name ?? state.user.firstName,
        lastName: updates.last_name ?? state.user.lastName,
      },
    })),

  logout: () => set({ user: null, profile: null, isAuthenticated: false }),
}));

export default useAuthStore;
