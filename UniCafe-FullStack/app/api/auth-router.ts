import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { signToken } from "./lib/jwt";
import { TRPCError } from "@trpc/server";

export const authRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const result = await db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: "student",
      });

      const userId = Number(result[0].insertId);
      const token = signToken({
        userId,
        email: input.email,
        role: "student",
      });

      return {
        token,
        user: {
          id: userId,
          name: input.name,
          email: input.email,
          role: "student" as const,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (user.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await bcrypt.compare(input.password, user[0].password);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = signToken({
        userId: user[0].id,
        email: user[0].email,
        role: user[0].role,
      });

      return {
        token,
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          role: user[0].role,
        },
      };
    }),

  adminLogin: publicQuery
    .input(
      z.object({
        email: z.string().email("Invalid email"),
        adminPassword: z.string().min(1, "Admin password is required"),
      })
    )
    .mutation(async ({ input }) => {
      const adminSecret =
        process.env.ADMIN_SECRET_PASSWORD || "UniCafeAdmin2026!";

      if (input.adminPassword !== adminSecret) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid admin credentials",
        });
      }

      const db = getDb();

      // Check if admin user exists with this email
      let user = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (user.length === 0) {
        // Create admin user
        const hashedPassword = await bcrypt.hash(adminSecret, 10);
        const result = await db.insert(users).values({
          name: "Admin",
          email: input.email,
          password: hashedPassword,
          role: "admin",
        });
        const userId = Number(result[0].insertId);
        const token = signToken({
          userId,
          email: input.email,
          role: "admin",
        });

        return {
          token,
          user: {
            id: userId,
            name: "Admin",
            email: input.email,
            role: "admin" as const,
          },
        };
      }

      // Update existing user to admin
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, user[0].id));

      const token = signToken({
        userId: user[0].id,
        email: user[0].email,
        role: "admin",
      });

      return {
        token,
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          role: "admin" as const,
        },
      };
    }),

  me: authedQuery.query(({ ctx }) => {
    return {
      id: ctx.user!.id,
      name: ctx.user!.name,
      email: ctx.user!.email,
      role: ctx.user!.role,
    };
  }),
});
