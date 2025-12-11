import { create } from 'zustand';
import { observeAuthState, logoutUser } from '../lib/firebase';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    logout: async () => {
        await logoutUser();
        set({ user: null });
    },
    initialize: () => {
        return observeAuthState((user) => {
            set({ user, loading: false });
        });
    }
}));

export default useAuthStore;
