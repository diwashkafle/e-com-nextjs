'use client';

import { StorageOption, RamOption } from '@/lib/validators/product';

interface StorageRAMVariantsProps {
  storageOptions: StorageOption[];
  ramOptions: RamOption[];
  onStorageChange: (options: StorageOption[]) => void;
  onRamChange: (options: RamOption[]) => void;
  storageError?: string;
  ramError?: string;
}

export default function StorageRAMVariants({
  storageOptions,
  ramOptions,
  onStorageChange,
  onRamChange,
  storageError,
  ramError,
}: StorageRAMVariantsProps) {
  
  // Storage handlers
  const addStorage = () => {
    onStorageChange([...storageOptions, { value: '', priceAdjustment: 0, stock: 0 }]);
  };

  const updateStorage = (
    index: number,
    field: keyof StorageOption,
    value: string | number
  ) => {
    const updated = [...storageOptions];
    if (field === 'value') {
      updated[index][field] = value as string;
    } else {
      updated[index][field] = Number(value);
    }
    onStorageChange(updated);
  };

  const removeStorage = (index: number) => {
    onStorageChange(storageOptions.filter((_, i) => i !== index));
  };

  // RAM handlers
  const addRam = () => {
    onRamChange([...ramOptions, { value: '', priceAdjustment: 0, stock: 0 }]);
  };

  const updateRam = (
    index: number,
    field: keyof RamOption,
    value: string | number
  ) => {
    const updated = [...ramOptions];
    if (field === 'value') {
      updated[index][field] = value as string;
    } else {
      updated[index][field] = Number(value);
    }
    onRamChange(updated);
  };

  const removeRam = (index: number) => {
    onRamChange(ramOptions.filter((_, i) => i !== index));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Storage Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Storage Options</h3>
        
        <div className="space-y-3">
          {storageOptions.map((storage, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-700">Storage {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeStorage(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Value
                  </label>
                  <input
                    type="text"
                    value={storage.value}
                    onChange={(e) => updateStorage(index, 'value', e.target.value)}
                    placeholder="e.g., 64GB, 128GB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price +/-
                    </label>
                    <input
                      type="number"
                      value={storage.priceAdjustment}
                      onChange={(e) => updateStorage(index, 'priceAdjustment', e.target.value)}
                      placeholder="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={storage.stock}
                      onChange={(e) => updateStorage(index, 'stock', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addStorage}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
          >
            + Add Storage Option
          </button>
          
          {storageError && <p className="text-sm text-red-600">{storageError}</p>}
        </div>
      </div>

      {/* RAM Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">RAM Options</h3>
        
        <div className="space-y-3">
          {ramOptions.map((ram, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-700">RAM {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeRam(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RAM Value
                  </label>
                  <input
                    type="text"
                    value={ram.value}
                    onChange={(e) => updateRam(index, 'value', e.target.value)}
                    placeholder="e.g., 4GB, 8GB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price +/-
                    </label>
                    <input
                      type="number"
                      value={ram.priceAdjustment}
                      onChange={(e) => updateRam(index, 'priceAdjustment', e.target.value)}
                      placeholder="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={ram.stock}
                      onChange={(e) => updateRam(index, 'stock', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addRam}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
          >
            + Add RAM Option
          </button>
          
          {ramError && <p className="text-sm text-red-600">{ramError}</p>}
        </div>
      </div>
    </div>
  );
}