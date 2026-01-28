'use client';

import { useState } from 'react';

interface InfoTooltipProps {
  content: string;
}

export default function InfoTooltip({ content }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        ?
      </button>
      
      {isVisible && (
        <div className="absolute left-6 top-0 z-50 w-64 p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg">
          {content}
          <div className="absolute w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45 -left-1 top-2" />
        </div>
      )}
    </div>
  );
}