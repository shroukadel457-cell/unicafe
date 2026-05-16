import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { verifyToken } from "./lib/jwt";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  try {
    const token = opts.req.headers.get("x-auth-token");
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const db = getDb();
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, decoded.userId))
          .limit(1);
        if (user.length > 0) {
          ctx.user = user[0];
        }
      }
    }
  } catch {
    // Auth is optional
  }

  return ctx;
}
