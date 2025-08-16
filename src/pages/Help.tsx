// src/pages/Help.tsx
import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full text-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Our Help Center is currently under construction. Please check back soon for answers to frequently asked questions and guides on using StayFinder.
        </p>
      </div>
    </div>
  );
};

export default Help;