"use server";
"server only";

import { and, eq, ne } from "drizzle-orm";
import { db } from "./db";
import {
  property,
  propertyPhoto,
  role,
  room,
  user,
  userRole,
} from "./db/schema";
import type {
  PropertyTypeInsert,
  PropertyTypeSelect,
  RoleUserType,
  RoomType,
  UsersType,
} from "./db/schema";

export async function postUsers(params: UsersType) {
  const [result] = await db
    .insert(user)
    .values({
      ...params,
    })
    .returning({ id: user.id });

  return result;
}

export async function postProperty(params: PropertyTypeInsert) {
  const { ...rest } = params;
  const [result] = await db
    .insert(property)
    .values({
      ...rest,
      is_active: true,
    })
    .returning({ id: property.id });
  return result;
}
export async function editProperty(params: PropertyTypeSelect) {
  const { id, ...updateData } = params; // oddzielamy id

  const [result] = await db
    .update(property)
    .set(updateData) // tylko dane bez id
    .where(eq(property.id, id)) // używamy id w WHERE
    .returning();

  return result;
}

export async function addPropertyPhotos(
  propertyId: number,
  photoUrls: string[],
) {
  await db
    .delete(propertyPhoto)
    .where(eq(propertyPhoto.property_id, propertyId));
  if (photoUrls.length === 0) return;

  const photosToInsert = photoUrls.map((url) => ({
    property_id: propertyId,
    file_path: url,
  }));

  await db.insert(propertyPhoto).values(photosToInsert);
}

export async function addRooms(propertyId: number, rooms: RoomType[]) {
  await db.delete(room).where(eq(room.property_id, propertyId));

  if (rooms.length === 0) return;

  await db.insert(room).values(rooms);
}

export async function addRoleToUser(params: RoleUserType) {
  const [result] = await db.insert(userRole).values({
    ...params,
  });
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

export async function getUserbyPhoneNumberEdit(phone: string, id: string) {
  const foundUser = await db.query.user.findFirst({
    where: (fields, { and, eq, ne }) =>
      and(eq(fields.phone_number, phone), id ? ne(fields.id, id) : undefined),
  });
  return foundUser;
}

export async function editUser(params: {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  bank_account: string;
}) {
  const [result] = await db
    .update(user)
    .set(params)
    .where(eq(user.id, params.id))
    .returning();

  return result;
}

export async function getPropertiesByUserId(userId: string) {
  const properties = await db.query.property.findMany({
    where: and(eq(property.owner_id, userId), eq(property.is_active, true)),
    with: {
      rooms: true,
      photos: true,
      listings: true,
      maintenanceRequests: true,
    },
    orderBy: (p) => p.created_at, // sortowanie od najstarszych do najnowszych
  });

  return properties;
}

export async function getUserRoles(userId: string) {
  const role = await db.query.userRole.findMany({
    where: and(eq(userRole.user_id, userId)),
    with: { role: true },
  });
  return role;
}
export async function getPropertybyId(id: number) {
  const foundProperty = await db.query.property.findFirst({
    where: eq(property.id, id),
    with: {
      listings: true,
      photos: true,
      rooms: true,
    },
  });
  return foundProperty;
}
export async function getPropertybyIdFull(id: number) {
  const foundProperty = await db.query.property.findFirst({
    where: eq(property.id, id),
    with: {
      listings: true,
      photos: true,
      rooms: true,
      maintenanceRequests: true,
    },
  });
  return foundProperty;
}
