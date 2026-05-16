import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createRouter, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems, menuItems, users, branches } from "@db/schema";

export const orderRouter = createRouter({
  place: authedQuery
    .input(
      z.object({
        branchId: z.number(),
        items: z.array(
          z.object({
            menuItemId: z.number(),
            quantity: z.number().min(1),
          })
        ),
        totalEGP: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user!.id;

      // Create order
      const orderResult = await db.insert(orders).values({
        userId,
        branchId: input.branchId,
        totalEGP: String(input.totalEGP),
        status: "pending",
      });

      const orderId = Number(orderResult[0].insertId);

      // Get menu item prices
      const menuItemIds = input.items.map((i) => i.menuItemId);
      const menuItemsData = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, menuItemIds[0]));

      const priceMap = new Map(
        menuItemsData.map((m) => [m.id, Number(m.priceEGP)])
      );

      // Create order items
      for (const item of input.items) {
        const price = priceMap.get(item.menuItemId) || 0;
        await db.insert(orderItems).values({
          orderId,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceEGP: String(price),
        });
      }

      // Return the order with items
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      const items = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          menuItemId: orderItems.menuItemId,
          quantity: orderItems.quantity,
          priceEGP: orderItems.priceEGP,
          menuItemName: menuItems.name,
          menuItemIcon: menuItems.icon,
        })
        .from(orderItems)
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
        .where(eq(orderItems.orderId, orderId));

      return {
        ...order[0],
        items,
      };
    }),

  myOrders: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user!.id;

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            menuItemId: orderItems.menuItemId,
            quantity: orderItems.quantity,
            priceEGP: orderItems.priceEGP,
            menuItemName: menuItems.name,
            menuItemIcon: menuItems.icon,
          })
          .from(orderItems)
          .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
          .where(eq(orderItems.orderId, order.id));

        const branch = await db
          .select()
          .from(branches)
          .where(eq(branches.id, order.branchId))
          .limit(1);

        return {
          ...order,
          items,
          branchName: branch[0]?.name || "Unknown",
        };
      })
    );

    return ordersWithItems;
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (order.length === 0) {
        return null;
      }

      // Students can only view their own orders
      if (
        ctx.user!.role === "student" &&
        order[0].userId !== ctx.user!.id
      ) {
        return null;
      }

      const items = await db
        .select({
          id: orderItems.id,
          orderId: orderItems.orderId,
          menuItemId: orderItems.menuItemId,
          quantity: orderItems.quantity,
          priceEGP: orderItems.priceEGP,
          menuItemName: menuItems.name,
          menuItemIcon: menuItems.icon,
        })
        .from(orderItems)
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
        .where(eq(orderItems.orderId, input.id));

      const branch = await db
        .select()
        .from(branches)
        .where(eq(branches.id, order[0].branchId))
        .limit(1);

      return {
        ...order[0],
        items,
        branchName: branch[0]?.name || "Unknown",
      };
    }),

  cancel: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (order.length === 0) {
        throw new Error("Order not found");
      }

      // Only the owner can cancel
      if (order[0].userId !== ctx.user!.id) {
        throw new Error("Not authorized");
      }

      // Can only cancel pending orders
      if (order[0].status !== "pending") {
        throw new Error("Cannot cancel order that is already being prepared");
      }

      await db
        .update(orders)
        .set({ status: "cancelled" })
        .where(eq(orders.id, input.id));

      return { ...order[0], status: "cancelled" as const };
    }),

  adminList: adminQuery
    .input(
      z
        .object({
          status: z.string().optional(),
          branchId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();

      const conditions = [];
      if (input?.status) {
        conditions.push(eq(orders.status, input.status as any));
      }
      if (input?.branchId) {
        conditions.push(eq(orders.branchId, input.branchId));
      }

      let orderList;
      if (conditions.length > 0) {
        orderList = await db
          .select()
          .from(orders)
          .where(and(...conditions))
          .orderBy(desc(orders.createdAt));
      } else {
        orderList = await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt));
      }

      const enriched = await Promise.all(
        orderList.map(async (order) => {
          const items = await db
            .select({
              id: orderItems.id,
              orderId: orderItems.orderId,
              menuItemId: orderItems.menuItemId,
              quantity: orderItems.quantity,
              priceEGP: orderItems.priceEGP,
              menuItemName: menuItems.name,
              menuItemIcon: menuItems.icon,
            })
            .from(orderItems)
            .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
            .where(eq(orderItems.orderId, order.id));

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
            items,
            userName: user[0]?.name || "Unknown",
            branchName: branch[0]?.name || "Unknown",
          };
        })
      );

      return enriched;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "pending",
          "preparing",
          "ready",
          "completed",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      return order[0];
    }),
});
