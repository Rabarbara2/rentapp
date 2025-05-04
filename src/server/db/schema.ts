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
export const userRelations = relations(user, ({ one, many }) => ({
  /*
  user-role
  notification
  rating review
  rental agreement
  payment
  maitnance update + request
  viewing request
  property
  favourites
  */
}));

export const role = createTable("role", (d) => ({
  id: d.integer().notNull().primaryKey(),
  name: d.varchar({ length: 255 }).notNull(),
}));

export const roleRelations = relations(role, ({ one, many }) => ({
  /*
  user-role
  */
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

export const ratingRelations = relations(rating_review, ({ one, many }) => ({
  /*
  user x2
  rentalagreement
  */
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
    /*
  rating_reviwe
  user x2
  listing
  payment
  */
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

export const paymentRelations = relations(payment, ({ one, many }) => ({
  /*
  user
  rental_agreement
  */
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
  ({ one, many }) => ({
    /*
  user
  maintenance request
  */
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
    /*
  user
  maintenance update
  property
  */
  }),
);
export const viewing_request = createTable("viewing_request", (d) => ({
  id: d.integer().notNull().primaryKey(),
  listing_id: d.integer().notNull(),
  /*.references(() => listing.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })*/ tenant_id: d
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
  ({ one, many }) => ({
    /*
  user,
  listing
  */
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
  /*
  user
  photo
  room
  listing
  maintenance request
  */
}));

//--------------------------------------------------------------------

export type UsersType = typeof user.$inferInsert;
