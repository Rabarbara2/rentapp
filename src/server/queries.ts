"use server";
"server only";

import { and, eq, ne } from "drizzle-orm";
import { db } from "./db";
import { property, user } from "./db/schema";
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

export async function getUserbyId(id: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.id, id),
  });

  return foundUser;
}
export async function getUserbyMail(mail: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.email, mail),
  });

  return foundUser;
}
export async function getUserbyPhoneNumber(phone: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.phone_number, phone),
  });
  return foundUser;
}
//?? join
export async function getAllUserProperties(Id: string) {
  const foundProperties = await db.query.property.findMany({
    where: eq(property.owner_id, Id),
  });
  return foundProperties;
}
