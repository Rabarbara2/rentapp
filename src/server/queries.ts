"use server";
"server only";

import { and, eq, ne } from "drizzle-orm";
import { db } from "./db";
import { user } from "./db/schema";
import type { UsersType } from "./db/schema";

export async function postUsers(params: UsersType) {
  const [result] = await db
    .insert(user)
    .values({
      ...params,
    })
    .returning({ id: user.id });

  return result;
}
