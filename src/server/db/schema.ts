import { not, relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `rentapp_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

// ---------------------------------------------------------------------------------------

export const user = createTable("user", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey(),
  email: d.varchar({ length: 255 }).notNull().unique(),
  phone_number: d.varchar({ length: 255 }),
  first_name: d.varchar({ length: 255 }),
  last_name: d.varchar({ length: 255 }),
  registration_date: d.date().notNull().defaultNow(),
  is_active: d.boolean().notNull().default(true),
  //profile_picture: d.varchar({}),
  bank_account: d.varchar({}),
  //--
}));

export const userRelations = relations(user, ({ many }) => ({
  properties: many(property),
  favorites: many(favorite),
  notifications: many(notification),
  payments: many(payment),
  maintenanceRequests: many(maintenance_request),
  maintenanceUpdates: many(maintenance_update),
  viewingRequests: many(viewing_request),
  rentalAgreementsAsTenant: many(rental_agreement, { relationName: "tenant" }),
  rentalAgreementsAsOwner: many(rental_agreement, { relationName: "owner" }),
  ratingsGiven: many(rating_review, { relationName: "reviewer" }),
  ratingsReceived: many(rating_review, { relationName: "reviewee" }),
  userRoles: many(userRole),
}));

export const listing = createTable("listing", (d) => ({
  id: d.integer().notNull().primaryKey(),

  property_id: d
    .integer()
    .notNull()
    .references(() => property.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  price_per_month: d.numeric().notNull(), //float
  security_deposit: d.numeric().notNull(), //float

  available_from: d.date().notNull(),
  available_until: d.date(),

  created_at: d.timestamp().defaultNow().notNull(),
  updated_at: d.timestamp().$onUpdate(() => new Date()),

  listing_status: d
    .integer() //enum chyba
    .notNull(),
}));

export const role = createTable("role", (d) => ({
  id: d.integer().notNull().primaryKey(),
  name: d.varchar({ length: 255 }).notNull(),
}));

export const userRole = createTable(
  "user_role",
  (d) => ({
    user_id: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role_id: d
      .integer()
      .notNull()
      .references(() => role.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.user_id, t.role_id] })],
);

export const roleRelations = relations(role, ({ many }) => ({
  userRoles: many(userRole),
}));

export const notification = createTable("notification", (d) => ({
  id: d.integer().notNull().primaryKey(),
  user_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: d.varchar({ length: 255 }).notNull(),
  content: d.text().notNull(),
  notification_type: d.varchar({ length: 255 }), //???enum??
  is_read: d.boolean(), // zmiana
  created_at: d.timestamp().defaultNow().notNull(),
}));

export const notificationRelations = relations(
  notification,
  ({ one, many }) => ({
    /*
  user
  */
  }),
);

export const rating_review = createTable("rating_review", (d) => ({
  //do mieszkania czy wlasciciela
  id: d.integer().notNull().primaryKey(),
  agreement_id: d
    .integer()
    .notNull()
    .references(() => rental_agreement.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  reviewer_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  reviewee_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  rating: d.integer().notNull(),
  review: d.text(),
  created_at: d.timestamp().defaultNow(),
}));

export const ratingRelations = relations(rating_review, ({ one }) => ({
  agreement: one(rental_agreement, {
    fields: [rating_review.agreement_id],
    references: [rental_agreement.id],
  }),
  reviewer: one(user, {
    fields: [rating_review.reviewer_id],
    references: [user.id],
    relationName: "reviewer",
  }),
  reviewee: one(user, {
    fields: [rating_review.reviewee_id],
    references: [user.id],
    relationName: "reviewee",
  }),
}));

export const rental_agreement = createTable("rental_agreement", (d) => ({
  id: d.integer().notNull().primaryKey(),
  listing_id: d.integer(),
  tenant_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  owner_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  start_date: d.date().notNull(),
  end_date: d.date().notNull(),
  monthly_rent: d.numeric().notNull(), // nie ma floatów
  security_deposit: d.numeric().notNull(),
  terms_conditions: d.text(),
  signed_by_owner_at: d.timestamp(),
  signed_by_tenant_at: d.timestamp(),
  document_path: d.varchar({ length: 255 }),
}));

export const rental_agreementRelations = relations(
  rental_agreement,
  ({ one, many }) => ({
    listing: one(listing, {
      fields: [rental_agreement.listing_id],
      references: [listing.id],
    }),
    tenant: one(user, {
      fields: [rental_agreement.tenant_id],
      references: [user.id],
      relationName: "tenant",
    }),
    owner: one(user, {
      fields: [rental_agreement.owner_id],
      references: [user.id],
      relationName: "owner",
    }),
    payments: many(payment),
    reviews: many(rating_review),
  }),
);

export const payment = createTable("payment", (d) => ({
  id: d.integer().notNull().primaryKey(),
  agreement_id: d
    .integer()
    .notNull()
    .references(() => rental_agreement.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  tenant_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  amount: d.doublePrecision().notNull(),
  due_date: d.date(),
  payment_date: d.date(),
  payment_status: d.varchar({ length: 255 }), //?? enumm???
  transaction_id: d.varchar({ length: 255 }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  tenant: one(user, { fields: [payment.tenant_id], references: [user.id] }),
  agreement: one(rental_agreement, {
    fields: [payment.agreement_id],
    references: [rental_agreement.id],
  }),
}));

export const maintenance_update = createTable("maintenance_update", (d) => ({
  id: d.integer().notNull().primaryKey(),
  request_id: d
    .integer()
    .notNull()
    .references(() => maintenance_request.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  user_id: d //kto dokladnie?
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  comment: d.text(),
  new_status: d.integer(), // ?? enum ??
  created_at: d.timestamp().defaultNow().notNull(),
}));
export const maintenance_updateRelations = relations(
  maintenance_update,
  ({ one }) => ({
    maintenance_request: one(maintenance_request, {
      fields: [maintenance_update.request_id],
      references: [maintenance_request.id],
    }),
    user: one(user, {
      fields: [maintenance_update.user_id],
      references: [user.id],
    }),
  }),
);

export const maintenance_request = createTable("maintenance_request", (d) => ({
  id: d.integer().notNull().primaryKey(),
  property_id: d
    .integer()
    .notNull()
    .references(() => property.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  tenant_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  title: d.varchar({ length: 255 }).notNull(),
  description: d.text().notNull(),
  status: d.integer(), // ?? enum ??
  created_at: d.timestamp().defaultNow().notNull(),
  updated_at: d.timestamp(), //last updated at?
}));

export const maintenance_requestRelations = relations(
  maintenance_request,
  ({ one, many }) => ({
    user: one(user, {
      fields: [maintenance_request.tenant_id],
      references: [user.id],
    }),
    property: one(property, {
      fields: [maintenance_request.property_id],
      references: [property.id],
    }),
    maintenance_update: many(maintenance_update),
  }),
);

export const viewing_request = createTable("viewing_request", (d) => ({
  id: d.integer().notNull().primaryKey(),
  listing_id: d
    .integer()
    .notNull()
    .references(() => listing.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  tenant_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  proposed_time: d.timestamp().notNull(),
  status: d.integer(), //?? enum??
  message: d.text(),
  created_at: d.timestamp().notNull().defaultNow(),
}));

export const viewing_requestRelations = relations(
  viewing_request,
  ({ one }) => ({
    user: one(user, {
      fields: [viewing_request.tenant_id],
      references: [user.id],
    }),
    listing: one(listing, {
      fields: [viewing_request.listing_id],
      references: [listing.id],
    }),
  }),
);

export const property = createTable("property", (d) => ({
  id: d.integer().notNull().primaryKey(),
  owner_id: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  name: d.varchar({ length: 255 }).notNull(),
  description: d.text(),
  address: d.varchar({ length: 255 }).notNull(),
  city: d.varchar({ length: 255 }).notNull(),
  postal_code: d.varchar({ length: 255 }).notNull(),
  area_size: d.numeric(),
  is_furnished: d.boolean(),
  pets_allowed: d.boolean(),
  smoking_allowed: d.boolean(),
  is_active: d.boolean().notNull(),
  created_at: d.timestamp().defaultNow(),
  updated_at: d.timestamp(), ///???
}));

export const propertyRelations = relations(property, ({ one, many }) => ({
  owner: one(user, { fields: [property.owner_id], references: [user.id] }),
  rooms: many(room),
  photos: many(propertyPhoto),
  listings: many(listing),
  maintenanceRequests: many(maintenance_request),
}));

export const favorite = createTable(
  "favorite",
  (d) => ({
    user_id: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listing_id: d
      .integer()
      .notNull()
      .references(() => listing.id, { onDelete: "cascade" }),
    created_at: d.timestamp().defaultNow().notNull(),
  }),
  (t) => [primaryKey({ columns: [t.user_id, t.listing_id] })],
);

export const room = createTable("room", (d) => ({
  id: d.integer().notNull().primaryKey(),
  property_id: d
    .integer()
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  room_type: d.varchar({ length: 255 }), // albo enum
  size_sqm: d.numeric(),
  description: d.text(),
}));

export const propertyPhoto = createTable("property_photo", (d) => ({
  id: d.integer().notNull().primaryKey(),
  property_id: d
    .integer()
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  file_path: d.varchar({ length: 255 }).notNull(),
}));

//--------------------------------------------------------------------

export const users_old = createTable("user_old", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(user, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(user, { fields: [accounts.userId], references: [user.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => user.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(user, { fields: [sessions.userId], references: [user.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, { fields: [userRole.user_id], references: [user.id] }),
  role: one(role, { fields: [userRole.role_id], references: [role.id] }),
}));

export const listingRelations = relations(listing, ({ one, many }) => ({
  property: one(property, {
    fields: [listing.property_id],
    references: [property.id],
  }),
  favorites: many(favorite),
  rentalAgreements: many(rental_agreement),
  viewingRequests: many(viewing_request),
}));

export const favoriteRelations = relations(favorite, ({ one }) => ({
  user: one(user, { fields: [favorite.user_id], references: [user.id] }),
  listing: one(listing, {
    fields: [favorite.listing_id],
    references: [listing.id],
  }),
}));

export const propertyPhotoRelations = relations(propertyPhoto, ({ one }) => ({
  property: one(property, {
    fields: [propertyPhoto.property_id],
    references: [property.id],
  }),
}));

export const roomRelations = relations(room, ({ one }) => ({
  property: one(property, {
    fields: [room.property_id],
    references: [property.id],
  }),
}));

export type UsersType = typeof user.$inferInsert;
