import { create } from 'zustand';

const useWishlistStore = create((set, get) => ({
    items: [],
    addItem: (product) => {
        const items = get().items;
        if (!items.find(i => i.id === product.id)) {
            set({ items: [...items, product] });
        }
    },
    removeItem: (productId) => {
        set({ items: get().items.filter(i => i.id !== productId) });
    },
    toggleItem: (product) => {
        const items = get().items;
        if (items.find(i => i.id === product.id)) {
            set({ items: items.filter(i => i.id !== product.id) });
        } else {
            set({ items: [...items, product] });
        }
    },
    clearWishlist: () => set({ items: [] }),
}));

export default useWishlistStore;
