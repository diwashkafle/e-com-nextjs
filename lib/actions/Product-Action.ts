'use server';

import { db } from '@/db/index';

import { 
  products, 
  storageOptions, 
  ramOptions, 
  colorVariants,
  productVariants,
  categories,
  subcategories,
  brands
} from '@/db/schema';
import { productSchema } from '@/lib/validators/product';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSKU(productId: number, storage?: string, ram?: string, color?: string): string {
  const parts = [
    `P${productId}`,
    storage?.replace(/[^a-z0-9]/gi, ''),
    ram?.replace(/[^a-z0-9]/gi, ''),
    color?.replace(/[^a-z0-9]/gi, '').substring(0, 3).toUpperCase(),
  ].filter(Boolean);
  
  return parts.join('-');
}

export async function createProduct(formData: FormData) {
  try {
    // Parse form data to JSON
    const data = JSON.parse(formData.get('data') as string);
    
    // Validate
    const validationResult = productSchema.safeParse(data);
    
    if (!validationResult.success) {
      return { 
        success: false, 
        error: 'Validation failed', 
        details: validationResult.error.flatten() 
      };
    }
    
    const validData = validationResult.data;
    
    // Transaction
    const result = await db.transaction(async (tx) => {
      // 1. Insert product
      const [product] = await tx.insert(products).values({
        name: validData.name,
        slug: generateSlug(validData.name),
        description: validData.description,
        categoryId: validData.categoryId,
        subcategoryId: validData.subcategoryId || null,
        brandId: validData.brandId || null,
        basePrice: validData.basePrice.toString(),
        crossingPrice: validData.crossingPrice?.toString() || null,
        images: validData.images,
        specifications: validData.specifications || [],
        status: validData.status,
        scheduledAt: validData.scheduledAt ? new Date(validData.scheduledAt) : null,
        publishedAt: validData.status === 'published' ? new Date() : null,
      }).returning();
      
      // 2. Insert storage options
      const insertedStorageOptions = await tx.insert(storageOptions).values(
        validData.storageOptions.map((storage) => ({
          productId: product.id,
          value: storage.value,
          priceAdjustment: storage.priceAdjustment.toString(),
          stock: storage.stock,
        }))
      ).returning();
      
      // 3. Insert RAM options
      const insertedRamOptions = await tx.insert(ramOptions).values(
        validData.ramOptions.map((ram) => ({
          productId: product.id,
          value: ram.value,
          priceAdjustment: ram.priceAdjustment.toString(),
          stock: ram.stock,
        }))
      ).returning();
      
      // 4. Insert color variants (if any)
      let insertedColorVariants: any[] = [];
      if (validData.colorVariants && validData.colorVariants.length > 0) {
        insertedColorVariants = await tx.insert(colorVariants).values(
          validData.colorVariants.map((color) => ({
            productId: product.id,
            colorName: color.colorName,
            colorCode: color.colorCode || null,
            images: color.images,
            stock: color.stock,
          }))
        ).returning();
      }
      
      // 5. Generate all variant combinations
      const variantCombinations = [];
      
      for (const storage of insertedStorageOptions) {
        for (const ram of insertedRamOptions) {
          if (insertedColorVariants.length > 0) {
            for (const color of insertedColorVariants) {
              const finalPrice = 
                parseFloat(validData.basePrice.toString()) +
                parseFloat(storage.priceAdjustment) +
                parseFloat(ram.priceAdjustment);
              
              variantCombinations.push({
                productId: product.id,
                sku: generateSKU(product.id, storage.value, ram.value, color.colorName),
                storageOptionId: storage.id,
                ramOptionId: ram.id,
                colorVariantId: color.id,
                finalPrice: finalPrice.toString(),
                stock: Math.min(storage.stock, ram.stock, color.stock),
              });
            }
          } else {
            const finalPrice = 
              parseFloat(validData.basePrice.toString()) +
              parseFloat(storage.priceAdjustment) +
              parseFloat(ram.priceAdjustment);
            
            variantCombinations.push({
              productId: product.id,
              sku: generateSKU(product.id, storage.value, ram.value),
              storageOptionId: storage.id,
              ramOptionId: ram.id,
              colorVariantId: null,
              finalPrice: finalPrice.toString(),
              stock: Math.min(storage.stock, ram.stock),
            });
          }
        }
      }
      
      // 6. Insert all variant combinations
      if (variantCombinations.length > 0) {
        await tx.insert(productVariants).values(variantCombinations);
      }
      
      return { productId: product.id };
    });
    
    revalidatePath('/admin/products');
    
    return {
      success: true,
      message: 'Product created successfully',
      productId: result.productId,
    };
    
  } catch (error) {
    console.error('Product creation error:', error);
    return { 
      success: false,
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
