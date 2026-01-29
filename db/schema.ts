import { pgTable, text, integer, decimal, timestamp, boolean, jsonb, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Categories Table
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subcategories Table
export const subcategories = pgTable('subcategories', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Brands Table
export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Products Table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  description: text('description').notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  subcategoryId: integer('subcategory_id').references(() => subcategories.id),
  brandId: integer('brand_id').references(() => brands.id),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  crossingPrice: decimal('crossing_price', { precision: 10, scale: 2 }),
  
  // Product Images (general product images)
  images: jsonb('images').$type<string[]>().default([]),
  
  // Grouped Specifications
  // Structure: [{ groupName: "Display", details: [{ key: "Screen Size", value: "6.1 inches" }] }]
  specifications: jsonb('specifications').$type<{
    groupName: string;
    details: { key: string; value: string }[];
  }[]>().default([]),
  
  // Publishing options
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published, scheduled
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Variant Types Table (e.g., "Storage", "RAM", "Size", "Material")
export const variantTypes = pgTable('variant_types', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  typeName: varchar('type_name', { length: 100 }).notNull(), // e.g., "Storage", "RAM", "Size"
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Variant Options Table (e.g., "128GB", "256GB" for Storage type)
export const variantOptions = pgTable('variant_options', {
  id: serial('id').primaryKey(),
  variantTypeId: integer('variant_type_id').references(() => variantTypes.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(), // e.g., "128GB", "Large", "Aluminum"
  priceAdjustment: decimal('price_adjustment', { precision: 10, scale: 2 }).default('0').notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Color Variants Table
export const colorVariants = pgTable('color_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  colorName: varchar('color_name', { length: 100 }).notNull(),
  colorCode: varchar('color_code', { length: 7 }), // hex color code (optional)
  images: jsonb('images').$type<string[]>().default([]),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Product Variants (All combinations)
// This table stores the actual SKU combinations
export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  
  // JSON array of variant option IDs that make up this variant
  // e.g., [storageOptionId, ramOptionId] or [sizeOptionId, materialOptionId]
  variantOptionIds: jsonb('variant_option_ids').$type<number[]>().notNull(),
  
  colorVariantId: integer('color_variant_id').references(() => colorVariants.id),
  
  // Final calculated price for this variant
  finalPrice: decimal('final_price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  products: many(products),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variantTypes: many(variantTypes),
  colorVariants: many(colorVariants),
  variants: many(productVariants),
}));

export const variantTypesRelations = relations(variantTypes, ({ one, many }) => ({
  product: one(products, {
    fields: [variantTypes.productId],
    references: [products.id],
  }),
  options: many(variantOptions),
}));

export const variantOptionsRelations = relations(variantOptions, ({ one }) => ({
  variantType: one(variantTypes, {
    fields: [variantOptions.variantTypeId],
    references: [variantTypes.id],
  }),
}));

export const colorVariantsRelations = relations(colorVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [colorVariants.productId],
    references: [products.id],
  }),
  variants: many(productVariants),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  colorVariant: one(colorVariants, {
    fields: [productVariants.colorVariantId],
    references: [colorVariants.id],
  }),
}));