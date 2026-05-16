import { z } from "zod";
import { eq, and, like, or } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { menuItems } from "@db/schema";

export const menuRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          branchId: z.number().optional(),
          category: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();

      const conditions = [];
      if (input?.branchId) {
        conditions.push(eq(menuItems.branchId, input.branchId));
      }
      if (input?.category) {
        conditions.push(eq(menuItems.category, input.category as any));
      }
      if (input?.search) {
        conditions.push(
          or(
            like(menuItems.name, `%${input.search}%`),
            like(menuItems.description, `%${input.search}%`)
          )
        );
      }

      if (conditions.length > 0) {
        return db
          .select()
          .from(menuItems)
          .where(and(...conditions));
      }

      return db.select().from(menuItems);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, input.id))
        .limit(1);

      return items[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        branchId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string(),
        priceEGP: z.number().positive(),
        icon: z.string(),
        available: z.boolean().default(true),
        popular: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(menuItems).values({
        branchId: input.branchId,
        name: input.name,
        description: input.description || "",
        category: input.category as any,
        priceEGP: input.priceEGP,
        icon: input.icon,
        available: input.available,
        popular: input.popular,
      });

      const id = Number(result[0].insertId);
      const items = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, id))
        .limit(1);

      return items[0];
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        priceEGP: z.number().positive().optional(),
        icon: z.string().optional(),
        available: z.boolean().optional(),
        popular: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updates } = input;

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined)
        updateData.description = updates.description;
      if (updates.category !== undefined)
        updateData.category = updates.category;
      if (updates.priceEGP !== undefined)
        updateData.priceEGP = updates.priceEGP;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.available !== undefined)
        updateData.available = updates.available;
      if (updates.popular !== undefined) updateData.popular = updates.popular;

      await db.update(menuItems).set(updateData).where(eq(menuItems.id, id));

      const items = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, id))
        .limit(1);

      return items[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(menuItems).where(eq(menuItems.id, input.id));
      return { success: true };
    }),

  toggleAvailable: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.id, input.id))
        .limit(1);

      if (items.length === 0) {
        throw new Error("Item not found");
      }

      const newAvailable = !items[0].available;
      await db
        .update(menuItems)
        .set({ available: newAvailable })
        .where(eq(menuItems.id, input.id));

      return { ...items[0], available: newAvailable };
    }),
});