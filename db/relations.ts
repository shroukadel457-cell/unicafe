import { relations } from "drizzle-orm";
import { users, branches, menuItems, orders, orderItems } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const branchesRelations = relations(branches, ({ many }) => ({
  menuItems: many(menuItems),
  orders: many(orders),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  branch: one(branches, {
    fields: [menuItems.branchId],
    references: [branches.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  branch: one(branches, {
    fields: [orders.branchId],
    references: [branches.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));
