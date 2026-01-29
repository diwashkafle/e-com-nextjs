import { z } from 'zod';

// Specification detail schema (key-value pair)
export const specificationDetailSchema = z.object({
  key: z.string().min(1, 'Specification key is required'),
  value: z.string().min(1, 'Specification value is required'),
});

// Specification group schema (e.g., "Display", "Camera")
export const specificationGroupSchema = z.object({
  groupName: z.string().min(1, 'Group name is required (e.g., Display, Camera)'),
  details: z.array(specificationDetailSchema).min(1, 'At least one specification detail is required'),
});

// Flexible variant option schema (can be storage, RAM, size, material, etc.)
export const variantOptionSchema = z.object({
  name: z.string().min(1, 'Variant name is required (e.g., 128GB, 8GB RAM, Large)'),
  priceAdjustment: z.number().default(0), // Can be positive or negative
  stock: z.number().int().min(0, 'Stock must be a positive number').default(0),
});

// Variant type schema (e.g., "Storage", "RAM", "Size", "Material")
export const variantTypeSchema = z.object({
  typeName: z.string().min(1, 'Variant type is required (e.g., Storage, RAM, Size)'),
  options: z.array(variantOptionSchema).min(1, 'At least one option is required'),
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
  
  subcategoryId: z.number().int().positive().optional().nullable(),
  
  brandId: z.number().int().positive().optional().nullable(),
  
  // Pricing
  basePrice: z.number()
    .positive('Base price must be greater than 0')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  
  crossingPrice: z.number()
    .positive('Crossing price must be greater than 0')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional()
    .nullable(),
  
  // Flexible Variants (e.g., Storage, RAM, Size, Material, etc.)
  variantTypes: z.array(variantTypeSchema)
    .min(1, 'At least one variant type is required (e.g., Storage, Size, or Model)'),
  
  // Color Variants (optional, affects images only)
  colorVariants: z.array(colorVariantSchema)
    .optional()
    .default([]),
  
  // Grouped Specifications (e.g., Display group with Screen Size, Resolution, etc.)
  specifications: z.array(specificationGroupSchema)
    .optional()
    .default([]),
  
  // Product Images (general product images)
  images: z.array(z.string().url('Invalid image URL'))
    .min(1, 'At least one product image is required'),
  
  // Publishing
  status: z.enum(['draft', 'published', 'scheduled']),
  
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
export type VariantType = z.infer<typeof variantTypeSchema>;
export type VariantOption = z.infer<typeof variantOptionSchema>;
export type ColorVariant = z.infer<typeof colorVariantSchema>;
export type SpecificationGroup = z.infer<typeof specificationGroupSchema>;
export type SpecificationDetail = z.infer<typeof specificationDetailSchema>;