import { z } from 'zod';

// Specification schema
export const specificationSchema = z.object({
  key: z.string().min(1, 'Specification key is required'),
  value: z.string().min(1, 'Specification value is required'),
});

// Storage option schema
export const storageOptionSchema = z.object({
  value: z.string().min(1, 'Storage value is required (e.g., 64GB)'),
  priceAdjustment: z.number().min(0, 'Price adjustment must be positive').default(0),
  stock: z.number().int().min(0, 'Stock must be a positive number').default(0),
});

// RAM option schema
export const ramOptionSchema = z.object({
  value: z.string().min(1, 'RAM value is required (e.g., 4GB)'),
  priceAdjustment: z.number().min(0, 'Price adjustment must be positive').default(0),
  stock: z.number().int().min(0, 'Stock must be a positive number').default(0),
});

// Color variant schema
export const colorVariantSchema = z.object({
  colorName: z.string().min(1, 'Color name is required'),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color code').optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required for color variant'),
  stock: z.number().int().min(0, 'Stock must be a positive number').default(0),
});

// Main product schema
export const productSchema = z.object({
  // Basic Information
  name: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(500, 'Product name must not exceed 500 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  
  categoryId: z.number().int().positive('Please select a category'),
  
  subcategoryId: z.number().int().positive('Please select a subcategory').optional(),
  
  brandId: z.number().int().positive('Please select a brand').optional(),
  
  // Pricing
  basePrice: z.number()
    .positive('Base price must be greater than 0')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  
  crossingPrice: z.number()
    .positive('Crossing price must be greater than 0')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional()
    .nullable(),
  
  // Variants
  storageOptions: z.array(storageOptionSchema)
    .min(1, 'At least one storage option is required'),
  
  ramOptions: z.array(ramOptionSchema)
    .min(1, 'At least one RAM option is required'),
  
  colorVariants: z.array(colorVariantSchema)
    .optional()
    .default([]),
  
  // Specifications
  specifications: z.array(specificationSchema)
    .optional()
    .default([]),
  
  // Product Images
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one product image is required'),
  
  // Publishing
  status: z.enum(['draft', 'published', 'scheduled'],
  ),
  
  scheduledAt: z.string().datetime().optional().nullable(),
}).refine(
  (data) => {
    // If crossing price exists, it should be greater than base price
    if (data.crossingPrice && data.crossingPrice <= data.basePrice) {
      return false;
    }
    return true;
  },
  {
    message: 'Crossing price must be greater than base price',
    path: ['crossingPrice'],
  }
).refine(
  (data) => {
    // If status is scheduled, scheduledAt must be provided
    if (data.status === 'scheduled' && !data.scheduledAt) {
      return false;
    }
    return true;
  },
  {
    message: 'Scheduled date is required when status is set to scheduled',
    path: ['scheduledAt'],
  }
);

// Type inference
export type ProductFormData = z.infer<typeof productSchema>;
export type StorageOption = z.infer<typeof storageOptionSchema>;
export type RamOption = z.infer<typeof ramOptionSchema>;
export type ColorVariant = z.infer<typeof colorVariantSchema>;
export type Specification = z.infer<typeof specificationSchema>;