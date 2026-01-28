import { db } from "@/db";
import { subcategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCategories() {
    try {
      const categoriesData = await db.query.categories.findMany({
        orderBy: (categories, { asc }) => [asc(categories.name)],
      });
      return categoriesData;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }
  
  export async function getSubcategories(categoryId: number) {
    try {
      const subcategoriesData = await db.query.subcategories.findMany({
        where: eq(subcategories.categoryId, categoryId),
        orderBy: (subcategories, { asc }) => [asc(subcategories.name)],
      });
      return subcategoriesData;
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      return [];
    }
  }
  
  export async function getBrands() {
    try {
      const brandsData = await db.query.brands.findMany({
        orderBy: (brands, { asc }) => [asc(brands.name)],
      });
      return brandsData;
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      return [];
    }
  }