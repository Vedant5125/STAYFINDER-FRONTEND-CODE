// src/components/Modals/DescriptionGeneratorModal.tsx

import React, { useState } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../Common/LoadingSpinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (attributes: string) => void;
  isLoading: boolean;
}

const DescriptionGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onGenerate, isLoading }) => {
  const [attributes, setAttributes] = useState('');

  if (!isOpen) return null;

  const handleGenerateClick = () => {
    onGenerate(attributes);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md mx-auto shadow-xl">
          <h3 className="text-xl font-bold mb-4">Auto-Generate Description</h3>
          <p className="text-gray-600 mb-4">
            Give us a few **key attributes** of your listing (e.g., "cozy", "beachfront", "newly renovated") and we'll craft a description for you.
          </p>
          <p className="text-sm text-blue-600 mb-4">
            You can always edit the description to your liking after it's generated.
          </p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            rows={4}
            placeholder="e.g., 'Spacious, family-friendly, great view, hot tub'"
            value={attributes}
            onChange={(e) => setAttributes(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isLoading || !attributes.trim()}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Generating...
                </>
              ) : (
                <>
                  <LightBulbIcon className="h-5 w-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionGeneratorModal;