"use server";
"server only";

import { and, eq, ne } from "drizzle-orm";
import { db } from "./db";
import { users } from "./db/schema";
import type { UsersType } from "./db/schema";

export async function postUsers(params: UsersType) {
  const [result] = await db
    .insert(users)
    .values({
      ...params,
    })
    .returning({ id: users.id });

  return result;
}
