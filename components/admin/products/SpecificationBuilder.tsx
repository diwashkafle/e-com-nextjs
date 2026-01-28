'use client';

import { Specification } from '@/lib/validators/product';

interface SpecificationBuilderProps {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
  error?: string;
}

export default function SpecificationBuilder({
  specifications,
  onChange,
  error,
}: SpecificationBuilderProps) {
  const addSpecification = () => {
    onChange([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeSpecification = (index: number) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {specifications.map((spec, index) => (
        <div key={index} className="flex gap-3 items-start">
          <div className="flex-1">
            <input
              type="text"
              value={spec.key}
              onChange={(e) => updateSpecification(index, 'key', e.target.value)}
              placeholder="Property (e.g., Screen Size)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              value={spec.value}
              onChange={(e) => updateSpecification(index, 'value', e.target.value)}
              placeholder="Value (e.g., 6.1 inches)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            type="button"
            onClick={() => removeSpecification(index)}
            className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove specification"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addSpecification}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
      >
        + Add Specification
      </button>
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}