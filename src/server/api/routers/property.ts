import { z } from "zod";
import { eq, sql } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { property } from "~/server/db/schema";

export const propertyRouter = createTRPCRouter({
  // Get all properties for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const properties = await ctx.db.query.property.findMany({
      where: eq(property.owner_id, ctx.session.user.id),
      orderBy: (property, { desc }) => [desc(property.created_at)],
    });
    return properties;
  }),

  // Get a specific property by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const propertyData = await ctx.db.query.property.findFirst({
        where: eq(property.id, input.id),
      });
      return propertyData;
    }),

  // Create a new property
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        address: z.string().min(1),
        city: z.string().min(1),
        postal_code: z.string().min(1),
        area_size: z.number().optional(),
        is_furnished: z.boolean().optional(),
        pets_allowed: z.boolean().optional(),
        smoking_allowed: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Use SQL to generate a query
      const result = await ctx.db.execute(
        sql`INSERT INTO rentapp_property 
            (owner_id, name, description, address, city, postal_code, area_size, 
             is_furnished, pets_allowed, smoking_allowed, is_active, created_at) 
            VALUES 
            (${ctx.session.user.id}, ${input.name}, ${input.description || null}, 
             ${input.address}, ${input.city}, ${input.postal_code}, 
             ${input.area_size ? input.area_size.toString() : null}, 
             ${input.is_furnished ?? false}, ${input.pets_allowed ?? false}, 
             ${input.smoking_allowed ?? false}, ${true}, NOW()) 
            RETURNING *`
      );
      
      // Return the first result from the array
      return result[0];
    }),

  // Update an existing property
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        address: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        postal_code: z.string().min(1).optional(),
        area_size: z.number().optional(),
        is_furnished: z.boolean().optional(),
        pets_allowed: z.boolean().optional(),
        smoking_allowed: z.boolean().optional(),
        is_active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Convert area_size to string if it exists
      const typedUpdateData = {
        ...updateData,
        area_size: updateData.area_size !== undefined 
          ? updateData.area_size.toString() 
          : undefined,
        updated_at: new Date(),
      };
      
      const updated = await ctx.db
        .update(property)
        .set(typedUpdateData)
        .where(eq(property.id, id))
        .returning();
      
      return updated[0];
    }),

  // Delete a property
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(property)
        .where(eq(property.id, input.id));
      
      return { success: true };
    }),
}); 