import React from 'react';
import { format } from 'date-fns';
import { Video, Repeat, Trash2 } from 'lucide-react';
import { BookingCardProps } from '@/lib/types';
import { Button } from '@/components/ui/button';

const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete }) => {
  const isFollowUp = booking.type === 'follow-up';
  const cardColor = isFollowUp ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200';
  const textColor = isFollowUp ? 'text-purple-800' : 'text-green-800';
  const iconColor = isFollowUp ? 'text-purple-500' : 'text-green-500';
  const iconBgColor = isFollowUp ? 'bg-purple-100' : 'bg-green-100';

  return (
    <div className={`p-3 rounded-lg border ${cardColor} flex justify-between items-center`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${iconColor} ${iconBgColor}`}>
          {isFollowUp ? <Repeat size={20} /> : <Video size={20} />}
        </div>
        <div>
          <p className={`font-bold ${textColor}`}>{booking.clientName}</p>
          <p className={`text-sm ${textColor}`}>
            {format(booking.startTime, 'h:mm a')} - {format(booking.endTime, 'h:mm a')}
          </p>
          <p className={`text-xs capitalize ${textColor}`}>{booking.type} Call</p>
        </div>
      </div>

      <Button 
        onClick={() => onDelete(booking.id)} 
        variant="outline"
        className="p-2 text-red-500 hover:text-red-800 hover:bg-red-300 rounded-full dark:hover:bg-amber-100"
        aria-label="Delete booking"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};

export default BookingCard;