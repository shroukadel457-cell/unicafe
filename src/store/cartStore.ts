import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  icon: string;
  branchId: number;
  branchName: string;
}

interface CartState {
  items: CartItem[];
  branchId: number | null;
  branchName: string | null;

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  setBranch: (branchId: number, branchName: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      branchId: null,
      branchName: null,

      addItem: (item) => {
        const state = get();

        // If cart has items from a different branch, clear it
        if (state.branchId !== null && state.branchId !== item.branchId) {
          set({
            items: [{ ...item, quantity: 1 }],
            branchId: item.branchId,
            branchName: item.branchName,
          });
          return;
        }

        const existing = state.items.find(
          (i) => i.menuItemId === item.menuItemId
        );

        if (existing) {
          set({
            items: state.items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            branchId: item.branchId,
            branchName: item.branchName,
          });
        } else {
          set({
            items: [...state.items, { ...item, quantity: 1 }],
            branchId: item.branchId,
            branchName: item.branchName,
          });
        }
      },

      removeItem: (menuItemId) => {
        const state = get();
        const newItems = state.items.filter(
          (i) => i.menuItemId !== menuItemId
        );
        set({
          items: newItems,
          branchId: newItems.length > 0 ? state.branchId : null,
          branchName: newItems.length > 0 ? state.branchName : null,
        });
      },

      updateQuantity: (menuItemId, quantity) => {
        const state = get();
        if (quantity <= 0) {
          state.removeItem(menuItemId);
          return;
        }
        set({
          items: state.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [], branchId: null, branchName: null });
      },

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      setBranch: (branchId, branchName) => {
        const state = get();
        if (state.branchId !== branchId) {
          set({ items: [], branchId, branchName });
        }
      },
    }),
    {
      name: "unicafe-cart",
    }
  )
);
