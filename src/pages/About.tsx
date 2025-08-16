// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full text-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">About StayFinder</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Welcome to StayFinder, your premier destination for discovering unique and memorable accommodations worldwide. Our mission is to connect travelers with the perfect place to stay, whether it's a cozy apartment, a luxury villa, or a charming guesthouse.
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          We believe that travel is more than just visiting a new place; it's about experiencing different cultures and creating lasting memories. That's why we meticulously curate our listings to ensure they offer an exceptional and authentic experience.
        </p>
      </div>
    </div>
  );
};

export default About;