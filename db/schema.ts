import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  boolean,
  bigint,
  int,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["student", "admin"]).default("student").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const branches = mysqlTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  openingHours: varchar("openingHours", { length: 100 }).notNull(),
  workDays: varchar("workDays", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["open", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const menuItems = mysqlTable("menuitems", {  // ✅ Fixed: lowercase "menuitems"
  id: serial("id").primaryKey(),
  branchId: bigint("branchId", { mode: "number", unsigned: true })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "main_course",
    "sandwiches",
    "salads",
    "drinks",
    "desserts",
    "coffee",
    "breakfast",
    "snacks",
  ]).notNull(),
  priceEGP: decimal("priceEGP", { precision: 10, scale: 2 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  available: boolean("available").default(true).notNull(),
  popular: boolean("popular").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull(),
  branchId: bigint("branchId", { mode: "number", unsigned: true })
    .notNull(),
  totalEGP: decimal("totalEGP", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orderItems = mysqlTable("orderitems", {  // ✅ Fixed: lowercase "orderitems"
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true })
    .notNull(),
  menuItemId: bigint("menuItemId", { mode: "number", unsigned: true })
    .notNull(),
  quantity: int("quantity").notNull().default(1),
  priceEGP: decimal("priceEGP", { precision: 10, scale: 2 }).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Branch = typeof branches.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;