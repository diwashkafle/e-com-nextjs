'use client';

import { VariantType } from '@/lib/validators/product';
import InfoTooltip from './InfoTooltip';

interface FlexibleVariantsProps {
  variantTypes: VariantType[];
  onChange: (types: VariantType[]) => void;
  error?: string;
}

export default function FlexibleVariants({
  variantTypes,
  onChange,
  error,
}: FlexibleVariantsProps) {
  
  const addVariantType = () => {
    onChange([
      ...variantTypes,
      { typeName: '', options: [{ name: '', priceAdjustment: 0, stock: 0 }] },
    ]);
  };

  const updateVariantType = (index: number, field: 'typeName', value: string) => {
    const updated = [...variantTypes];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeVariantType = (index: number) => {
    onChange(variantTypes.filter((_, i) => i !== index));
  };

  const addOption = (typeIndex: number) => {
    const updated = [...variantTypes];
    updated[typeIndex].options.push({ name: '', priceAdjustment: 0, stock: 0 });
    onChange(updated);
  };

  const updateOption = (
    typeIndex: number,
    optionIndex: number,
    field: keyof VariantType['options'][0],
    value: string | number
  ) => {
    const updated = [...variantTypes];
    if (field === 'name') {
      updated[typeIndex].options[optionIndex][field] = value as string;
    } else {
      updated[typeIndex].options[optionIndex][field] = Number(value);
    }
    onChange(updated);
  };

  const removeOption = (typeIndex: number, optionIndex: number) => {
    const updated = [...variantTypes];
    updated[typeIndex].options = updated[typeIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {variantTypes.map((variantType, typeIndex) => (
        <div
          key={typeIndex}
          className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                Variant Type {typeIndex + 1} *
                <InfoTooltip content="e.g., Storage (128GB, 256GB), RAM (8GB, 12GB), Size (Small, Large), Material (Plastic, Metal)" />
              </label>
              <input
                type="text"
                value={variantType.typeName}
                onChange={(e) =>
                  updateVariantType(typeIndex, 'typeName', e.target.value)
                }
                placeholder="e.g., Storage, RAM, Size, Material, Model"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium"
              />
            </div>
            
            {variantTypes.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariantType(typeIndex)}
                className="mt-7 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                Remove Type
              </button>
            )}
          </div>

          <div className="ml-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Options:</h4>
            
            {variantType.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Option {optionIndex + 1}
                  </span>
                  {variantType.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(typeIndex, optionIndex)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) =>
                        updateOption(typeIndex, optionIndex, 'name', e.target.value)
                      }
                      placeholder="e.g., 128GB, 8GB RAM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price +/- ($)
                    </label>
                    <input
                      type="number"
                      value={option.priceAdjustment}
                      onChange={(e) =>
                        updateOption(
                          typeIndex,
                          optionIndex,
                          'priceAdjustment',
                          e.target.value
                        )
                      }
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      +100 or -50 from base price
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={option.stock}
                      onChange={(e) =>
                        updateOption(typeIndex, optionIndex, 'stock', e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addOption(typeIndex)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
            >
              + Add {variantType.typeName || 'Option'}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addVariantType}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all font-semibold"
      >
        + Add Variant Type (Storage, Size, etc.)
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Info box explaining variants */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">💡 How Variants Work</h4>
        <p className="text-sm text-gray-700 mb-2">
          Variants are product options that affect the <strong>price</strong>. Examples:
        </p>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li><strong>Smartphones:</strong> Storage (128GB, 256GB) + RAM (8GB, 12GB)</li>
          <li><strong>Smartwatches:</strong> Size (40mm, 44mm) + Material (Aluminum, Steel)</li>
          <li><strong>Speakers:</strong> Wattage (20W, 40W) + Connectivity (Bluetooth, WiFi)</li>
          <li><strong>Laptops:</strong> Processor (i5, i7) + Storage (512GB, 1TB)</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          All combinations will be automatically generated. For example: 2 storage options × 2 RAM options = 4 total variants.
        </p>
      </div>
    </div>
  );
}