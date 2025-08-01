import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { EmptySlotProps } from '@/lib/types';

const EmptySlot: React.FC<EmptySlotProps> = ({ slot, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 text-left border border-dashed border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors flex items-center gap-2 text-gray-500"
    >
      <Clock size={16} />
      {format(slot, 'h:mm a')} - Available
    </button>
  );
};

export default EmptySlot;