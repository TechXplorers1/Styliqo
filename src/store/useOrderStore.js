import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOrderStore = create(
    persist(
        (set, get) => ({
            orders: [],
            addOrder: (order) => {
                set({ orders: [order, ...get().orders] });
            },
            // Mock functionality to "track" status
            updateOrderStatus: (orderId, status) => {
                const orders = get().orders.map(order =>
                    order.id === orderId ? { ...order, status } : order
                );
                set({ orders });
            }
        }),
        {
            name: 'order-storage', // unique name
            getStorage: () => localStorage, // (optional, default is localStorage)
        }
    )
);

export default useOrderStore;
