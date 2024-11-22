import React from 'react';

const Legend: React.FC = () => {
  return (
    <div className="mt-6 flex justify-center gap-8">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-[#D1D5DB] rounded mr-2"></div>
        <span className="text-sm text-gray-600">No visitado</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Visitado</span>
      </div>
    </div>
  );
};

export default Legend;