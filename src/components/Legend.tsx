import React from 'react';

const Legend: React.FC = () => {
  return (
    <div className="mt-1 h-16 rounded flex justify-center gap-8 bg-white">
      <div className="flex items-center">
        <div className="w-6 h-6 bg-[#D1D5DB] rounded mr-2 border border-black"></div>
        <span className="text-xl font-bold text-gray-900">No visitado</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-[#38b000] rounded mr-2 border border-black"></div>
        <span className="text-xl font-bold text-gray-900">Visitado</span>
      </div>
    </div>
  );
};

export default Legend;