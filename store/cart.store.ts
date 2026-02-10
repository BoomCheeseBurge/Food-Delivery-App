import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";

/**
 * [ HELPER FUNCTION ]
 * Compare if two customizations are equal based on ID
 * 
 * Ex:
 * 
 * Ensures that `Burger + Fries + Coke` is not treated the same as 
 * `Burger + Extra Cheese + Fries`, even though they both refer to the same menu item, `Burger`
 */
function areCustomizationsEqual(
    a: CartCustomization[] = [],
    b: CartCustomization[] = []
): boolean {
    // Return immediately if length unequal
    if (a.length !== b.length) return false;

    // Sort both arrays for ease of comparison
    const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
    const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

    // Check if every item has the same ID
    return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

/**
 * Create global state for cart store
 */
export const useCartStore = create<CartStore>((set, get) => ({
    
    // Cart initially empty
    items: [],
    // Cart items selected IDs
    selectedIds: [],

    // Add a new menu item to the cart
    addItem: (item) => {
        const customizations = item.customizations ?? [];

        // // Check whether an item with the same ID & customizations already exists
        const existing = get().items.find(
            (i) =>
                i.id === item.id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
        );

        // If so, then increase the quantity
        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            set({
                items: [...get().items, { ...item, quantity: 1, customizations }],
                selectedIds: [...get().selectedIds, item.id],
            });
        }
    },

    // Remove a menu item from the cart
    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
            selectedIds: get().selectedIds.filter(selectedId => selectedId !== id),
        });
    },

    // Increase the quantity of a menu item in the cart
    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    // Decrease the quantity of a menu item in the cart
    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                // Ensure that a menu item quantity doesn't go below 0, and if it does, remove the item from the cart
                .filter((i) => i.quantity > 0),
        });
    },

    // Clear all menu items in the cart
    clearCart: () => set({ items: [] }),

    // Total number of menu items in the cart
    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    // Total price for all menu items in the cart
    getTotalPrice: () =>
        get().items.reduce((total, item) => {

            const base = item.price;
            
            const customPrice =
                item.customizations?.reduce(
                    (s: number, c: CartCustomization) => s + c.price,
                    0
                ) ?? 0;

            return total + item.quantity * (base + customPrice);
        }, 0),

    // Toggle Cart Item Selection
    toggleSelect: (id) => {

        const { selectedIds } = get();

        set({
            selectedIds: selectedIds.includes(id)
                ? selectedIds.filter((i) => i !== id)
                : [...selectedIds, id],
        });
    },

    // Select / unselect all items in the cart
    toggleAll: () => {
        const { items, selectedIds } = get();
        
        // If everything is already selected, clear the array (Unselect All)
        if (selectedIds.length === items.length) {
            set({ selectedIds: [] });
        } else {
            // Otherwise, fill it with every item's ID (Select All)
            set({ selectedIds: items.map((item) => item.id) });
        }
    },

    // Only sum cart items that are in selectedIds
    getSelectedTotalPrice: () => {
        
        const { items, selectedIds } = get();

        return items
            .filter(item => selectedIds.includes(item.id))
            .reduce((total, item) => {
                const base = item.price;
                const customPrice = item.customizations?.reduce((s, c) => s + c.price, 0) ?? 0;
                return total + item.quantity * (base + customPrice);
            }, 0);
    },
}));