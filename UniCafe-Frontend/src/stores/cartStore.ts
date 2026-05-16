import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  icon: string;
  iconColor: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  branchId: number | null;
  branchName: string | null;
  addItem: (item: Omit<CartItem, "quantity">, branchId: number, branchName: string) => boolean;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  switchBranch: (branchId: number, branchName: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      branchId: null,
      branchName: null,

      addItem: (item, branchId, branchName) => {
        const state = get();
        if (state.branchId !== null && state.branchId !== branchId) {
          return false; // Different branch - need to switch first
        }

        set((s) => {
          const existing = s.items.find((i) => i.menuItemId === item.menuItemId);
          if (existing) {
            return {
              ...s,
              branchId,
              branchName,
              items: s.items.map((i) =>
                i.menuItemId === item.menuItemId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            ...s,
            branchId,
            branchName,
            items: [...s.items, { ...item, quantity: 1 }],
          };
        });
        return true;
      },

      removeItem: (menuItemId) => {
        set((s) => ({
          ...s,
          items: s.items.filter((i) => i.menuItemId !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], branchId: null, branchName: null });
      },

      getTotal: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      switchBranch: (branchId, branchName) => {
        const state = get();
        if (state.branchId === branchId) return true;
        if (state.items.length > 0 && state.branchId !== branchId) {
          return false; // Cart has items from different branch
        }
        set({ branchId, branchName });
        return true;
      },
    }),
    { name: "unicafe-cart" }
  )
);
