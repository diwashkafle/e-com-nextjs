'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productSchema, ProductFormData } from '@/lib/validators/product';
import { createProduct } from '@/lib/actions/Product-Action';
import { getCategories, getSubcategories, getBrands} from '@/lib/queries/product-queries';
import InfoTooltip from './InfoTooltip';
import ImageUploader from './Imageuploader';
import GroupedSpecificationBuilder from './GroupSpecificationBuilder';
import FlexibleVariants from './FlexibleVariants';
import ColorVariants from './ColorVariants';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface Brand {
  id: number;
  name: string;
}

export default function AddProductForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form data state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    categoryId: 0,
    subcategoryId: null,
    brandId: null,
    basePrice: 0,
    crossingPrice: null,
    variantTypes: [
      { 
        typeName: 'Storage', 
        options: [{ name: '', priceAdjustment: 0, stock: 0 }] 
      }
    ],
    colorVariants: [],
    specifications: [],
    images: [],
    status: 'draft',
    scheduledAt: null,
  });

  // Dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.categoryId) {
        try {
          const data = await getSubcategories(formData.categoryId);
          setSubcategories(data);
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
        }
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [formData.categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validate form data
    const result = productSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      firstErrorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('data', JSON.stringify(result.data));
      
      const response = await createProduct(formDataToSubmit);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create product');
      }

      alert('Product created successfully!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Submission error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900" />
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600">
            Fill in the details below to add a new gadget to your store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                  Product Name *
                  <InfoTooltip content="Enter the display name of your product as it will appear to customers" />
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., iPhone 15 Pro Max, Galaxy Watch 6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  data-error={!!errors.name}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                  Description *
                  <InfoTooltip content="Provide a detailed description of the product including key features and benefits" />
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product in detail..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-y"
                  data-error={!!errors.description}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Category, Subcategory, Brand */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    Category *
                    <InfoTooltip content="Select the main category for this product" />
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoryId: Number(e.target.value),
                        subcategoryId: null,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    data-error={!!errors.categoryId}
                  >
                    <option value="0">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    Subcategory
                    <InfoTooltip content="Optional: Select a subcategory for better organization" />
                  </label>
                  <select
                    value={formData.subcategoryId || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategoryId: Number(e.target.value) || null })
                    }
                    disabled={!formData.categoryId}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="0">Select subcategory</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                    Brand
                    <InfoTooltip content="Optional: Select the product brand" />
                  </label>
                  <select
                    value={formData.brandId || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: Number(e.target.value) || null })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  >
                    <option value="0">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Pricing */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pricing</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                  Base Price *
                  <InfoTooltip content="The starting price for your product (variants can add to this)" />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.basePrice || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: Number(e.target.value) })
                    }
                    placeholder="999.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    data-error={!!errors.basePrice}
                  />
                </div>
                {errors.basePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                  Crossing Price (Optional)
                  <InfoTooltip content="Original/MRP price to show discount (must be higher than base price)" />
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.crossingPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        crossingPrice: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="1299.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    data-error={!!errors.crossingPrice}
                  />
                </div>
                {errors.crossingPrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.crossingPrice}</p>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: Flexible Variants */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Product Variants *
                  <InfoTooltip content="Add variant types like Storage, RAM, Size, Material, etc. All combinations will be generated automatically." />
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Define what makes your product different (affects price)
                </p>
              </div>
            </div>

            <FlexibleVariants
              variantTypes={formData.variantTypes}
              onChange={(types) => setFormData({ ...formData, variantTypes: types })}
              error={errors.variantTypes}
            />
          </section>

          {/* Section 4: Color Variants */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Color Variants (Optional)
                  <InfoTooltip content="Add color options for your product. Each color can have its own images and stock." />
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Colors multiply all variant combinations (doesn't affect price)
                </p>
              </div>
            </div>

            <ColorVariants
              colorVariants={formData.colorVariants}
              onChange={(variants) =>
                setFormData({ ...formData, colorVariants: variants })
              }
              error={errors.colorVariants}
            />
          </section>

          {/* Section 5: Specifications */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Technical Specifications
                <InfoTooltip content="Add technical details and features grouped by category (Display, Camera, etc.)" />
              </h2>
            </div>

            <GroupedSpecificationBuilder
              specifications={formData.specifications}
              onChange={(specs) =>
                setFormData({ ...formData, specifications: specs })
              }
              error={errors.specifications}
            />
          </section>

          {/* Section 6: Product Images */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Product Images *
                  <InfoTooltip content="Upload general product images. Color-specific images are added in the color variants section." />
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  First image will be the featured image
                </p>
              </div>
            </div>

            <div data-error={!!errors.images}>
              <ImageUploader
                images={formData.images}
                onChange={(urls) => setFormData({ ...formData, images: urls })}
                maxImages={10}
                label="Upload Product Images"
                folder="products/main"
              />
              {errors.images && (
                <p className="mt-2 text-sm text-red-600">{errors.images}</p>
              )}
            </div>
          </section>

          {/* Section 7: Publishing Options */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold">
                7
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Publishing Options</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Status *
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as any })
                      }
                      className="mt-1 mr-3 w-4 h-4 text-gray-900"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Save as Draft</div>
                      <div className="text-sm text-gray-600">
                        Save without publishing. You can edit and publish later.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as any })
                      }
                      className="mt-1 mr-3 w-4 h-4 text-gray-900"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">Publish Now</div>
                      <div className="text-sm text-gray-600">
                        Make the product live immediately and visible to customers.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-gray-900 has-[:checked]:bg-gray-50">
                    <input
                      type="radio"
                      name="status"
                      value="scheduled"
                      checked={formData.status === 'scheduled'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as any })
                      }
                      className="mt-1 mr-3 w-4 h-4 text-gray-900"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Schedule for Later</div>
                      <div className="text-sm text-gray-600 mb-3">
                        Set a specific date and time to publish this product.
                      </div>
                      {formData.status === 'scheduled' && (
                        <input
                          type="datetime-local"
                          value={formData.scheduledAt || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, scheduledAt: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          data-error={!!errors.scheduledAt}
                        />
                      )}
                    </div>
                  </label>
                </div>
                {errors.status && (
                  <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                )}
                {errors.scheduledAt && (
                  <p className="mt-2 text-sm text-red-600">{errors.scheduledAt}</p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end sticky bottom-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}