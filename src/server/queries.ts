"use server";
"server only";

import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "./db";
import {
  favorite,
  listing,
  notification,
  property,
  propertyPhoto,
  role,
  room,
  user,
  userRole,
} from "./db/schema";
import type {
  ListingTypeInsert,
  ListingTypeSelect,
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

export async function postListing(params: ListingTypeInsert) {
  const { ...rest } = params;
  const [result] = await db
    .insert(listing)
    .values({
      ...rest,
    })
    .returning({ id: listing.id });
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

export async function editListing(params: ListingTypeSelect) {
  const { id, ...updateData } = params; // oddzielamy id

  const [result] = await db
    .update(listing)
    .set(updateData) // tylko dane bez id
    .where(eq(listing.id, id)) // używamy id w WHERE
    .returning();

  return result;
}
export async function deleteListing(params: { id: number }) {
  const [result] = await db
    .update(listing)
    .set({ listing_status: 0 })
    .where(eq(listing.id, params.id))
    .returning();

  return result;
}

export async function isListingFavorite(listingId: number, userId: string) {
  const found = await db.query.favorite.findFirst({
    where: and(
      eq(favorite.listing_id, listingId),
      eq(favorite.user_id, userId),
    ),
  });

  return !!found;
}

/**
 * Przełącza ulubione: dodaje jeśli nie istnieje, usuwa jeśli już istnieje
 */
export async function toggleFavorite(listingId: number, userId: string) {
  const existing = await db.query.favorite.findFirst({
    where: and(
      eq(favorite.listing_id, listingId),
      eq(favorite.user_id, userId),
    ),
  });

  if (existing) {
    await db
      .delete(favorite)
      .where(
        and(eq(favorite.listing_id, listingId), eq(favorite.user_id, userId)),
      );
    return "removed";
  } else {
    await db.insert(favorite).values({
      listing_id: listingId,
      user_id: userId,
    });
    return "added";
  }
}

/**
 * (Opcjonalnie) Zwraca wszystkie ulubione listingi danego usera
 */
export async function getFavoritesByUser(userId: string) {
  return db.query.favorite.findMany({
    where: eq(favorite.user_id, userId),
  });
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

export async function deleteRooms(roomId: number) {
  await db.delete(room).where(eq(room.id, roomId));
}

export async function deleteProperty(params: { id: number }) {
  const [result] = await db
    .update(property)
    .set({ is_active: false })
    .where(eq(property.id, params.id))
    .returning();

  return result;
}

export async function addRoleToUser(params: RoleUserType) {
  const [result] = await db.insert(userRole).values({
    ...params,
  });
}
export async function getPropertyActiveListing(propId: number) {
  const foundListing = await db.query.listing.findFirst({
    where: and(eq(listing.property_id, propId), eq(listing.listing_status, 1)),
  });

  return foundListing;
}

export async function getThreeListingsFull() {
  const foundListings = await db.query.listing.findMany({
    where: eq(listing.listing_status, 1),
    orderBy: (listing, { desc }) => [desc(listing.created_at)],
    limit: 3,
    with: {
      property: {
        with: {
          photos: true,
        },
      },
    },
  });

  return foundListings;
}

export async function getListingByIdFull(id: number) {
  const foundListing = await db.query.listing.findFirst({
    where: and(eq(listing.listing_status, 1), eq(listing.id, id)),
    with: {
      property: {
        with: {
          photos: true,
          owner: true,
          rooms: true,
        },
      },
    },
  });

  return foundListing;
}

export async function getUserbyId(id: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.id, id),
    with: {
      userRoles: true,
    },
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
export async function getFavoritesByUserId(userId: string) {
  const favs = await db.query.favorite.findMany({
    where: and(eq(favorite.user_id, userId)),
    with: {
      listing: {
        with: {
          property: {
            with: {
              photos: true,
              owner: true,
              rooms: true,
            },
          },
        },
      },
    },
    orderBy: (p) => p.created_at, // sortowanie od najstarszych do najnowszych
  });

  return favs;
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
export async function getFilteredListings({
  minPrice,
  maxPrice,
  rooms,
  sort,
  page,
  limit,
}: {
  minPrice: number;
  maxPrice: number;
  rooms: number;
  sort:
    | "price-asc"
    | "price-desc"
    | "date-asc"
    | "date-desc"
    | "area-asc"
    | "area-desc";

  page: number;
  limit: number;
}) {
  const all = await db.query.listing.findMany({
    where: (listing, { and }) => and(),
    orderBy:
      sort === "price-asc"
        ? asc(listing.price_per_month)
        : sort === "price-desc"
          ? desc(listing.price_per_month)
          : sort === "date-asc"
            ? asc(listing.created_at)
            : sort === "date-desc"
              ? desc(listing.created_at)
              : undefined, // brak sortowania w DB dla area
    with: {
      property: {
        with: {
          photos: true,
          rooms: true,
          owner: true,
        },
      },
    },
  });

  // Ręczne filtrowanie
  const filtered = all.filter((listing) => {
    const price = Number(listing.price_per_month);
    const isActive = listing.listing_status === 1;
    const meetsPrice = price >= minPrice && price <= maxPrice;
    const meetsRooms =
      rooms > 0 ? listing.property.rooms.length >= rooms : true;

    return isActive && meetsPrice && meetsRooms;
  });

  // Ręczne sortowanie po powierzchni, jeśli wybrano area sort
  if (sort === "area-asc" || sort === "area-desc") {
    filtered.sort((a, b) => {
      const areaA = Number(a.property.area_size) || 0;
      const areaB = Number(b.property.area_size) || 0;
      return sort === "area-asc" ? areaA - areaB : areaB - areaA;
    });
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return paginated;
}
export const createContractProposalNotification = async ({
  senderId,
  recipientId,
  listingId,
  propertyName,
}: {
  senderId: string;
  recipientId: string;
  listingId: number;
  propertyName: string;
}) => {
  await db.insert(notification).values({
    sender_id: senderId,
    recipient_id: recipientId,
    listing_id: listingId,
    title: "Propozycja umowy",
    content: `Użytkownik zaproponował zawarcie umowy dla oferty ${propertyName}.`,
    notification_type: "contract_request",
    is_read: false,
  });
};

export const hasContractProposal = async (
  listingId: number,
  renterId: string,
  ownerId: string,
) => {
  return await db.query.notification.findFirst({
    where: and(
      eq(notification.sender_id, renterId),
      eq(notification.recipient_id, ownerId),
      eq(notification.listing_id, listingId),
    ),
  });
};
export async function getUnreadNotificationsByUserId(userId: string) {
  return await db.query.notification.findMany({
    where: (n) => and(eq(n.recipient_id, userId), eq(n.is_read, false)),
    orderBy: (n) => desc(n.created_at),
  });
}
