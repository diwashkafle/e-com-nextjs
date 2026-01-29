'use server';

import { db } from '@/db/index';

import { 
  products, 
  variantTypes,
  variantOptions,
  colorVariants,
  productVariants,
} from '@/db/schema';
import { productSchema } from '@/lib/validators/product';
import { revalidatePath } from 'next/cache';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSKU(productId: number, optionNames: string[], colorName?: string): string {
  const parts = [
    `P${productId}`,
    ...optionNames.map(name => name.replace(/[^a-z0-9]/gi, '').substring(0, 6).toUpperCase()),
    colorName?.replace(/[^a-z0-9]/gi, '').substring(0, 3).toUpperCase(),
  ].filter(Boolean);
  
  return parts.join('-');
}

// Generate all combinations of variant options
function generateCombinations(arrays: any[][]): any[][] {
  if (arrays.length === 0) return [[]];
  if (arrays.length === 1) return arrays[0].map(item => [item]);
  
  const [first, ...rest] = arrays;
  const restCombinations = generateCombinations(rest);
  
  const result: any[][] = [];
  for (const item of first) {
    for (const combo of restCombinations) {
      result.push([item, ...combo]);
    }
  }
  return result;
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
      
      // 2. Insert variant types and their options
      const allVariantOptions: Array<{
        id: number;
        name: string;
        priceAdjustment: number;
        stock: number;
        typeName: string;
      }> = [];
      
      for (const variantType of validData.variantTypes) {
        const [insertedType] = await tx.insert(variantTypes).values({
          productId: product.id,
          typeName: variantType.typeName,
        }).returning();
        
        const insertedOptions = await tx.insert(variantOptions).values(
          variantType.options.map((option) => ({
            variantTypeId: insertedType.id,
            name: option.name,
            priceAdjustment: option.priceAdjustment.toString(),
            stock: option.stock,
          }))
        ).returning();
        
        // Store options with their type name for combination generation
        allVariantOptions.push(
          ...insertedOptions.map(opt => ({
            id: opt.id,
            name: opt.name,
            priceAdjustment: parseFloat(opt.priceAdjustment),
            stock: opt.stock,
            typeName: variantType.typeName,
          }))
        );
      }
      
      // 3. Insert color variants (if any)
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
      
      // 4. Generate all variant combinations
      const variantCombinations = [];
      
      // Group options by type
      const optionsByType: Record<string, typeof allVariantOptions> = {};
      for (const option of allVariantOptions) {
        if (!optionsByType[option.typeName]) {
          optionsByType[option.typeName] = [];
        }
        optionsByType[option.typeName].push(option);
      }
      
      // Get all option arrays for combination generation
      const optionArrays = Object.values(optionsByType);
      const combinations = generateCombinations(optionArrays);
      
      for (const combo of combinations) {
        const optionIds = combo.map(opt => opt.id);
        const optionNames = combo.map(opt => opt.name);
        const totalPriceAdjustment = combo.reduce((sum, opt) => sum + opt.priceAdjustment, 0);
        const minStock = Math.min(...combo.map(opt => opt.stock));
        
        const finalPrice = parseFloat(validData.basePrice.toString()) + totalPriceAdjustment;
        
        if (insertedColorVariants.length > 0) {
          // Create variants with colors
          for (const color of insertedColorVariants) {
            variantCombinations.push({
              productId: product.id,
              sku: generateSKU(product.id, optionNames, color.colorName),
              variantOptionIds: optionIds,
              colorVariantId: color.id,
              finalPrice: finalPrice.toString(),
              stock: Math.min(minStock, color.stock),
            });
          }
        } else {
          // Create variants without colors
          variantCombinations.push({
            productId: product.id,
            sku: generateSKU(product.id, optionNames),
            variantOptionIds: optionIds,
            colorVariantId: null,
            finalPrice: finalPrice.toString(),
            stock: minStock,
          });
        }
      }
      
      // 5. Insert all variant combinations
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