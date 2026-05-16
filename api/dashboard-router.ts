import { desc, eq, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, menuItems, orderItems, branches, users } from "@db/schema";

export const dashboardRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();

    const allOrders = await db.select().from(orders);
    const totalOrders = allOrders.length;

    const totalRevenue = allOrders.reduce(
      (sum, o) => sum + Number(o.totalEGP),
      0
    );

    const activeOrders = allOrders.filter(
      (o) => o.status === "pending" || o.status === "preparing"
    ).length;

    const avgOrderValue =
      totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

    // Popular items - count how many times each menu item appears in orders
    const allOrderItems = await db
      .select({
        menuItemId: orderItems.menuItemId,
        quantity: orderItems.quantity,
      })
      .from(orderItems);

    const itemCounts = new Map<number, number>();
    for (const oi of allOrderItems) {
      const current = itemCounts.get(oi.menuItemId) || 0;
      itemCounts.set(oi.menuItemId, current + oi.quantity);
    }

    const popularItemIds = Array.from(itemCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id);

    const popularItems =
      popularItemIds.length > 0
        ? await db
            .select()
            .from(menuItems)
            .where(
              sql`${menuItems.id} IN (${sql.join(
                popularItemIds.map((id) => sql`${id}`)
              )})`
            )
        : [];

    return {
      totalOrders,
      totalRevenue,
      activeOrders,
      avgOrderValue,
      popularItems,
    };
  }),

  recentOrders: adminQuery.query(async () => {
    const db = getDb();

    const recent = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(10);

    const enriched = await Promise.all(
      recent.map(async (order) => {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);

        const branch = await db
          .select()
          .from(branches)
          .where(eq(branches.id, order.branchId))
          .limit(1);

        return {
          ...order,
          userName: user[0]?.name || "Unknown",
          branchName: branch[0]?.name || "Unknown",
        };
      })
    );

    return enriched;
  }),

  revenueByBranch: adminQuery.query(async () => {
    const db = getDb();

    const allBranches = await db.select().from(branches);
    const allOrders = await db.select().from(orders);

    const result = allBranches.map((branch) => {
      const branchOrders = allOrders.filter(
        (o) => o.branchId === branch.id
      );
      const revenue = branchOrders.reduce(
        (sum, o) => sum + Number(o.totalEGP),
        0
      );
      return {
        branchName: branch.name,
        revenue,
        orderCount: branchOrders.length,
      };
    });

    return result;
  }),
});
