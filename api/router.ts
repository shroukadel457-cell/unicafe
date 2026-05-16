import { authRouter } from "./auth-router";
import { branchRouter } from "./branch-router";
import { menuRouter } from "./menu-router";
import { orderRouter } from "./order-router";
import { dashboardRouter } from "./dashboard-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  branch: branchRouter,
  menu: menuRouter,
  order: orderRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
