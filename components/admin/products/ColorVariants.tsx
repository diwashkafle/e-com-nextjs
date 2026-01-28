'use client';

import { ColorVariant } from '@/lib/validators/product';
import ImageUploader from './Imageuploader';

interface ColorVariantsProps {
  colorVariants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  error?: string;
}

export default function ColorVariants({
  colorVariants,
  onChange,
  error,
}: ColorVariantsProps) {
  
  const addColorVariant = () => {
    onChange([
      ...colorVariants,
      { colorName: '', colorCode: '', images: [], stock: 0 },
    ]);
  };

  const updateColorVariant = (
    index: number,
    field: keyof ColorVariant,
    value: string | string[] | number
  ) => {
    const updated = [...colorVariants];
    if (field === 'images') {
      updated[index][field] = value as string[];
    } else if (field === 'stock') {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    onChange(updated);
  };

  const removeColorVariant = (index: number) => {
    onChange(colorVariants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {colorVariants.map((variant, index) => (
        <div
          key={index}
          className="p-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Color Variant {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeColorVariant(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              Remove
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Name *
                </label>
                <input
                  type="text"
                  value={variant.colorName}
                  onChange={(e) =>
                    updateColorVariant(index, 'colorName', e.target.value)
                  }
                  placeholder="e.g., Midnight Black, Ocean Blue"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={variant.colorCode || '#000000'}
                    onChange={(e) =>
                      updateColorVariant(index, 'colorCode', e.target.value)
                    }
                    className="w-16 h-11 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={variant.colorCode || ''}
                    onChange={(e) =>
                      updateColorVariant(index, 'colorCode', e.target.value)
                    }
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  updateColorVariant(index, 'stock', e.target.value)
                }
                min="0"
                placeholder="0"
                className="w-full md:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Images *
              </label>
              <ImageUploader
                images={variant.images}
                onChange={(urls) => updateColorVariant(index, 'images', urls)}
                maxImages={5}
                label="Upload color variant images"
                folder={`products/colors`}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addColorVariant}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-semibold"
      >
        + Add Color Variant
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}