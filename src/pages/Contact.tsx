// src/pages/Contact.tsx
import React from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full text-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Have questions or feedback? We'd love to hear from you. Reach out to us through the contact details below.
        </p>
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="flex items-center space-x-2">
            <EnvelopeIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">support@stayfinder.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
          </div>
        </div>
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Placeholder for a contact form</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;