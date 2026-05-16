import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useToastStore } from "@/store/toastStore";
import AppLayout from "@/components/AppLayout";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
  ChefHat,
  Beef,
  Coffee,
  Cake,
  Salad,
  GlassWater,
  Cookie,
  Drumstick,
  Pizza,
  IceCreamCone,
  Cherry,
  Milk,
  Fish,
  Sandwich,
  Egg,
  CupSoda,
  Donut,
  Building2,
  School,
  Users,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef, Coffee, Cake, Salad, GlassWater, Cookie, Drumstick, Pizza,
  ChefHat, IceCreamCone, Cherry, Milk, Fish, Sandwich, Egg,
  CupSoda, Donut, Building2, School, Users, UtensilsCrossed,
};

const iconOptions = Object.keys(iconMap);

const categoryOptions = [
  "main_course", "sandwiches", "salads", "drinks", "desserts",
  "coffee", "breakfast", "snacks",
];

const categoryLabels: Record<string, string> = {
  main_course: "Main Course",
  sandwiches: "Sandwiches",
  salads: "Salads",
  drinks: "Drinks",
  desserts: "Desserts",
  coffee: "Coffee",
  breakfast: "Breakfast",
  snacks: "Snacks",
};

interface MenuFormData {
  id?: number;
  branchId: number;
  name: string;
  description: string;
  category: string;
  priceEGP: string;
  icon: string;
  available: boolean;
  popular: boolean;
}

const emptyForm: MenuFormData = {
  branchId: 1,
  name: "",
  description: "",
  category: "main_course",
  priceEGP: "",
  icon: "Beef",
  available: true,
  popular: false,
};

export default function AdminMenu() {
  const { addToast } = useToastStore();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<MenuFormData>({ ...emptyForm });
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: branches } = trpc.branch.list.useQuery();
  const { data: menuItems, isLoading, refetch } = trpc.menu.list.useQuery({
    search: search || undefined,
  });

  const createItem = trpc.menu.create.useMutation({
    onSuccess: () => {
      addToast({ title: "Item created", variant: "success" });
      closeModal();
      refetch();
    },
    onError: (err) =>
      addToast({ title: "Error", description: err.message, variant: "error" }),
  });

  const updateItem = trpc.menu.update.useMutation({
    onSuccess: () => {
      addToast({ title: "Item updated", variant: "success" });
      closeModal();
      refetch();
    },
    onError: (err) =>
      addToast({ title: "Error", description: err.message, variant: "error" }),
  });

  const deleteItem = trpc.menu.delete.useMutation({
    onSuccess: () => {
      addToast({ title: "Item deleted", variant: "success" });
      refetch();
    },
    onError: (err) =>
      addToast({ title: "Error", description: err.message, variant: "error" }),
  });

  const toggleAvailable = trpc.menu.toggleAvailable.useMutation({
    onSuccess: () => {
      addToast({ title: "Availability updated", variant: "success" });
      refetch();
    },
    onError: (err) =>
      addToast({ title: "Error", description: err.message, variant: "error" }),
  });

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (item: NonNullable<typeof menuItems>[0]) => {
    setForm({
      id: item.id,
      branchId: item.branchId,
      name: item.name,
      description: item.description || "",
      category: item.category,
      priceEGP: String(item.priceEGP),
      icon: item.icon,
      available: item.available,
      popular: item.popular,
    });
    setEditingId(item.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateItem.mutate({
        id: editingId,
        ...form,
        priceEGP: Number(form.priceEGP),
      });
    } else {
      createItem.mutate({
        ...form,
        priceEGP: Number(form.priceEGP),
      });
    }
  };

  const isSubmitting = createItem.isPending || updateItem.isPending;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
          Menu Management
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4DA8DA] hover:bg-[#3D98CA] text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-[#4DA8DA]/20 self-start"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu items..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-white text-[#1A2B3C] placeholder-[#8BA3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
        />
      </div>

      {/* Menu Items Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#4DA8DA] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : menuItems && menuItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D0E4F0] bg-[#F0F7FB]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Item
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0E4F0]">
                {menuItems.map((item) => {
                  const Icon = iconMap[item.icon] || UtensilsCrossed;
                  const branch = branches?.find(
                    (b) => b.id === item.branchId
                  );

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F0F7FB]/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#F0F7FB] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-[#4DA8DA]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1A2B3C]">
                              {item.name}
                            </p>
                            {item.popular && (
                              <span className="text-[10px] font-medium text-[#F0A030] bg-[#F0A030]/10 px-1.5 py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-[#5A7A94] px-2 py-1 bg-[#F0F7FB] rounded-lg">
                          {categoryLabels[item.category] || item.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-[#5A7A94]">
                          {branch?.name || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-fredoka font-semibold text-[#1A2B3C]">
                          {Number(item.priceEGP).toFixed(0)} EGP
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() =>
                            toggleAvailable.mutate({ id: item.id })
                          }
                          className="flex items-center gap-1.5"
                        >
                          {item.available ? (
                            <ToggleRight className="w-5 h-5 text-[#4CAF7D]" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-[#E86060]" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              item.available
                                ? "text-[#4CAF7D]"
                                : "text-[#E86060]"
                            }`}
                          >
                            {item.available ? "Available" : "Unavailable"}
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-1.5 rounded-lg text-[#4DA8DA] hover:bg-[#4DA8DA]/10 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Delete "${item.name}"? This cannot be undone.`
                                )
                              ) {
                                deleteItem.mutate({ id: item.id });
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#E86060] hover:bg-[#E86060]/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <UtensilsCrossed className="w-10 h-10 text-[#D0E4F0] mx-auto mb-3" />
            <p className="text-sm text-[#8BA3B8]">No menu items found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#D0E4F0]">
              <h2 className="font-fredoka text-lg font-semibold text-[#1A2B3C]">
                {editingId ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#8BA3B8] hover:text-[#1A2B3C] hover:bg-[#F0F7FB] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                    Price (EGP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.priceEGP}
                    onChange={(e) =>
                      setForm({ ...form, priceEGP: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                    Branch
                  </label>
                  <select
                    value={form.branchId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        branchId: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
                  >
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                    Icon
                  </label>
                  <select
                    value={form.icon}
                    onChange={(e) =>
                      setForm({ ...form, icon: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm({ ...form, available: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#D0E4F0] text-[#4DA8DA] focus:ring-[#4DA8DA]"
                  />
                  <span className="text-sm text-[#1A2B3C]">Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) =>
                      setForm({ ...form, popular: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#D0E4F0] text-[#4DA8DA] focus:ring-[#4DA8DA]"
                  />
                  <span className="text-sm text-[#1A2B3C]">Popular</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-[#D0E4F0] text-sm text-[#5A7A94] hover:bg-[#F0F7FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#4DA8DA] hover:bg-[#3D98CA] text-white text-sm font-medium transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                    ? "Update Item"
                    : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
