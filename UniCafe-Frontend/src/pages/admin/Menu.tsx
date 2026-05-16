import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useToastStore } from "@/stores/toastStore";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Coffee,
} from "lucide-react";

const categories = ["Main Course", "Sandwiches", "Salads", "Breakfast", "Drinks", "Coffee", "Desserts", "Snacks"];

export default function AdminMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { addToast } = useToastStore();
  const utils = trpc.useUtils();

  const { data: branches } = trpc.branch.list.useQuery();
  const { data: menuItems, isLoading } = trpc.menu.list.useQuery(
    branchFilter ? { branchId: Number(branchFilter) } : undefined
  );

  const createItem = trpc.menu.create.useMutation({
    onSuccess: () => {
      addToast("Menu item created", "success");
      utils.menu.list.invalidate();
      closeModal();
    },
    onError: (err) => addToast(err.message, "error"),
  });

  const updateItem = trpc.menu.update.useMutation({
    onSuccess: () => {
      addToast("Menu item updated", "success");
      utils.menu.list.invalidate();
      closeModal();
    },
    onError: (err) => addToast(err.message, "error"),
  });

  const deleteItem = trpc.menu.delete.useMutation({
    onSuccess: () => {
      addToast("Menu item deleted", "success");
      utils.menu.list.invalidate();
    },
    onError: (err) => addToast(err.message, "error"),
  });

  const toggleAvailability = trpc.menu.toggleAvailability.useMutation({
    onSuccess: () => {
      addToast("Availability toggled", "success");
      utils.menu.list.invalidate();
    },
    onError: (err) => addToast(err.message, "error"),
  });

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredItems = menuItems?.filter((item) => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
  });

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Menu Management
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">Add, edit, and manage menu items</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-10 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
          >
            <option value="">All Branches</option>
            {branches?.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t border-[#E2E8F0]">
                      <td colSpan={6} className="px-4 py-4"><div className="h-4 bg-[#E2E8F0] rounded animate-pulse" /></td>
                    </tr>
                  ))
                ) : filteredItems?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-[#94A3B8]">
                      No menu items found
                    </td>
                  </tr>
                ) : (
                  filteredItems?.map((item) => (
                    <tr key={item.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.iconColor + "15" }}
                          >
                            <Coffee className="w-4 h-4" style={{ color: item.iconColor }} />
                          </div>
                          <div>
                            <p className="font-medium text-[#0F172A]">{item.name}</p>
                            <p className="text-[11px] text-[#94A3B8] line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#475569]">{item.category}</td>
                      <td className="px-4 py-3 text-[#475569]">{item.branch?.name}</td>
                      <td className="px-4 py-3 font-semibold text-[#3B82F6]">{item.priceEGP} EGP</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvailability.mutate({ id: item.id })}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {item.available ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              <ToggleRight className="w-3.5 h-3.5" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              <ToggleLeft className="w-3.5 h-3.5" />
                              Unavailable
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowModal(true);
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-[#EBF2FF] flex items-center justify-center transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-[#3B82F6]" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this item?")) {
                                deleteItem.mutate({ id: item.id });
                              }
                            }}
                            className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <MenuItemModal
          branches={branches || []}
          editingItem={editingItem}
          onClose={closeModal}
          onSubmit={(data) => {
            if (editingItem) {
              updateItem.mutate({ id: editingItem.id, ...data });
            } else {
              createItem.mutate(data);
            }
          }}
          isLoading={createItem.isPending || updateItem.isPending}
        />
      )}
    </SidebarLayout>
  );
}

function MenuItemModal({
  branches,
  editingItem,
  onClose,
  onSubmit,
  isLoading,
}: {
  branches: any[];
  editingItem: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState({
    name: editingItem?.name || "",
    description: editingItem?.description || "",
    category: editingItem?.category || "Main Course",
    priceEGP: editingItem?.priceEGP ? Number(editingItem.priceEGP) : "",
    branchId: editingItem?.branchId || (branches[0]?.id ?? 1),
    icon: editingItem?.icon || "Coffee",
    iconColor: editingItem?.iconColor || "#3B82F6",
    available: editingItem?.available ?? true,
    popular: editingItem?.popular ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      priceEGP: Number(form.priceEGP),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
            {editingItem ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F0F4F8] flex items-center justify-center">
            <X className="w-5 h-5 text-[#475569]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-1.5">Price (EGP)</label>
              <input
                type="number"
                value={form.priceEGP}
                onChange={(e) => setForm({ ...form, priceEGP: e.target.value })}
                min="0"
                step="0.01"
                className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-1.5">Branch</label>
            <select
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: Number(e.target.value) })}
              className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              <span className="text-sm text-[#475569]">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.popular}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                className="w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              <span className="text-sm text-[#475569]">Popular</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E2E8F0] text-[#475569] rounded-xl text-sm font-medium hover:bg-[#F0F4F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {isLoading ? "Saving..." : editingItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
