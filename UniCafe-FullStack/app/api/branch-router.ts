import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { branches, menuItems } from "@db/schema";

export const branchRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(branches);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const branch = await db
        .select()
        .from(branches)
        .where(eq(branches.id, input.id))
        .limit(1);

      if (branch.length === 0) {
        return null;
      }

      const menuCount = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.branchId, input.id));

      return {
        ...branch[0],
        menuCount: menuCount.length,
      };
    }),
});
