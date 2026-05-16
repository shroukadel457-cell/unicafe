import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

export async function upsertUser(data: Partial<InsertUser> & { email: string }) {
  const existing = await findUserByEmail(data.email);

  if (existing) {
    await getDb()
      .update(schema.users)
      .set(data)
      .where(eq(schema.users.id, existing.id));
    return existing.id;
  }

  const result = await getDb()
    .insert(schema.users)
    .values(data as InsertUser);
  return Number(result[0].insertId);
}
