'use server'

import { db } from "@/db";
import { categories, subcategories, brands } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getCategories() {
  try {
    const categoriesData = await db.select().from(categories).orderBy(asc(categories.name));
    return categoriesData;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getSubcategories(categoryId: number) {
  try {
    const subcategoriesData = await db.select().from(subcategories)
      .where(eq(subcategories.categoryId, categoryId))
      .orderBy(asc(subcategories.name));
    return subcategoriesData;
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    return [];
  }
}

export async function getBrands() {
  try {
    const brandsData = await db.select().from(brands).orderBy(asc(brands.name));
    return brandsData;
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return [];
  }
}