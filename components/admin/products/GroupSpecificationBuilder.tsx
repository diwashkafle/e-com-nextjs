'use client';

import { SpecificationGroup } from '@/lib/validators/product';
import InfoTooltip from './InfoTooltip';

interface GroupedSpecificationBuilderProps {
  specifications: SpecificationGroup[];
  onChange: (specs: SpecificationGroup[]) => void;
  error?: string;
}

export default function GroupedSpecificationBuilder({
  specifications,
  onChange,
  error,
}: GroupedSpecificationBuilderProps) {
  
  const addGroup = () => {
    onChange([
      ...specifications,
      { groupName: '', details: [{ key: '', value: '' }] },
    ]);
  };

  const updateGroupName = (index: number, name: string) => {
    const updated = [...specifications];
    updated[index].groupName = name;
    onChange(updated);
  };

  const removeGroup = (index: number) => {
    onChange(specifications.filter((_, i) => i !== index));
  };

  const addDetail = (groupIndex: number) => {
    const updated = [...specifications];
    updated[groupIndex].details.push({ key: '', value: '' });
    onChange(updated);
  };

  const updateDetail = (
    groupIndex: number,
    detailIndex: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...specifications];
    updated[groupIndex].details[detailIndex][field] = value;
    onChange(updated);
  };

  const removeDetail = (groupIndex: number, detailIndex: number) => {
    const updated = [...specifications];
    updated[groupIndex].details = updated[groupIndex].details.filter(
      (_, i) => i !== detailIndex
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {specifications.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className="p-6 bg-gray-50 border-2 border-gray-200 rounded-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <label className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                Group Name {groupIndex + 1} *
                <InfoTooltip content="e.g., Display, Camera, Performance, Battery, Connectivity" />
              </label>
              <input
                type="text"
                value={group.groupName}
                onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                placeholder="e.g., Display, Camera, Performance"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium text-lg"
              />
            </div>
            
            <button
              type="button"
              onClick={() => removeGroup(groupIndex)}
              className="mt-7 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Remove Group
            </button>
          </div>

          <div className="ml-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Specifications:</h4>
            
            {group.details.map((detail, detailIndex) => (
              <div
                key={detailIndex}
                className="flex gap-3 items-start p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    value={detail.key}
                    onChange={(e) =>
                      updateDetail(groupIndex, detailIndex, 'key', e.target.value)
                    }
                    placeholder="Property (e.g., Screen Size)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    value={detail.value}
                    onChange={(e) =>
                      updateDetail(groupIndex, detailIndex, 'value', e.target.value)
                    }
                    placeholder="Value (e.g., 6.1 inches)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                  />
                </div>

                {group.details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDetail(groupIndex, detailIndex)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove specification"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => addDetail(groupIndex)}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all text-sm font-medium"
            >
              + Add Specification to {group.groupName || 'Group'}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addGroup}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all font-semibold"
      >
        + Add Specification Group
      </button>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Example box */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">📋 Specification Examples</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <div>
            <strong>Display Group:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Screen Size → 6.1 inches</li>
              <li>Resolution → 2532 × 1170</li>
              <li>Type → OLED</li>
            </ul>
          </div>
          <div>
            <strong>Camera Group:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Rear Camera → 48MP + 12MP</li>
              <li>Front Camera → 12MP</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}