'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { format, addMinutes, getDay, isBefore, isAfter } from 'date-fns';
import { collection, addDoc } from 'firebase/firestore';
import { X, Video, Repeat } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { BookingModalProps, Client, Booking } from '@/lib/types';
import { CALENDAR_CONFIG } from '@/lib/constants';
import ClientSearch from '@/app/components/common/ClientSearch';

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  slot,
  clients,
  coachId,
  existingBookings,
  user
}) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [callType, setCallType] = useState<'onboarding' | 'follow-up'>('onboarding');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setSelectedClient(null);
    setCallType('onboarding');
    setSearchTerm('');
    setError('');
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchTerm(client.name);
  };

    const addEventToGoogleCalendar = async (bookingDetails: {
    startTime: Date;
    endTime: Date;
    title: string;
    description: string;
    isRecurring: boolean;
  }) => {
    const accessToken = (auth.currentUser as any)?.stsTokenManager?.accessToken;
    if (!accessToken) {
      console.error("No access token available for Google Calendar API.");
      alert("Could not add to Google Calendar: Not signed in or permissions missing.");
      return;
    }

    const event = {
      'summary': bookingDetails.title,
      'description': bookingDetails.description,
      'start': {
        'dateTime': bookingDetails.startTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'end': {
        'dateTime': bookingDetails.endTime.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'attendees': [],
      'reminders': {
        'useDefault': true,
      },
      ...(bookingDetails.isRecurring && {
        'recurrence': ['RRULE:FREQ=WEEKLY']
      })
    };

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
      const data = await response.json();
      if (data.error) {
        console.error('Google Calendar API Error:', data.error);
        alert(`Booking saved, but failed to add to Google Calendar. Error: ${data.error.message}`);
      } else {
        console.log('Event created: %s', data.htmlLink);
      }
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
      alert(`Booking saved, but an error occurred while adding to Google Calendar.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedClient) {
      setError('Please select a client.');
      return;
    }
    setIsSubmitting(true);

    const duration = callType === 'onboarding' 
      ? CALENDAR_CONFIG.ONBOARDING_DURATION 
      : CALENDAR_CONFIG.FOLLOWUP_DURATION;
    const newBookingStartTime = slot;
    const newBookingEndTime = addMinutes(newBookingStartTime, duration);

    const overlap = existingBookings.some(b =>
      isBefore(newBookingStartTime, b.endTime) && isAfter(newBookingEndTime, b.startTime)
    );

    if (overlap) {
      setError('This time slot overlaps with an existing booking.');
      setIsSubmitting(false);
      return;
    }

    const newBookingData: Omit<Booking, 'id'> = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      coachId,
      type: callType,
      startTime: newBookingStartTime,
      endTime: newBookingEndTime,
      ...(callType === 'follow-up' && {
        recurring: true,
        dayOfWeek: getDay(newBookingStartTime)
      })
    };

    try {
      await addDoc(collection(db, 'bookings'), newBookingData);
      
      await addEventToGoogleCalendar({
        startTime: newBookingStartTime,
        endTime: newBookingEndTime,
        title: `${callType === 'onboarding' ? 'Onboarding' : 'Follow-up'} with ${selectedClient.name}`,
        description: `Client: ${selectedClient.name}\nPhone: ${selectedClient.phone}\nCall Type: ${callType}`,
        isRecurring: callType === 'follow-up'
      });

      onClose();
    } catch (err) {
      console.error("Error creating booking:", err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Book a Call</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            Booking for: <span className="font-semibold">
              {format(slot, 'EEEE, MMMM d, yyyy')} at {format(slot, 'h:mm a')}
            </span>
          </div>

          <ClientSearch
            clients={clients}
            searchTerm={searchTerm}
            selectedClient={selectedClient}
            onSearchChange={setSearchTerm}
            onClientSelect={handleClientSelect}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCallType('onboarding')}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                  callType === 'onboarding' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Video className="mb-2 text-green-500" />
                <span className="font-semibold">Onboarding</span>
                <span className="text-xs text-gray-500">
                  ({CALENDAR_CONFIG.ONBOARDING_DURATION} min)
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setCallType('follow-up')}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                  callType === 'follow-up' 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Repeat className="mb-2 text-purple-500" />
                <span className="font-semibold">Follow-up</span>
                <span className="text-xs text-gray-500">
                  ({CALENDAR_CONFIG.FOLLOWUP_DURATION} min, weekly)
                </span>
              </button>
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedClient || isSubmitting}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? 'Booking...' : 'Book Call'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;