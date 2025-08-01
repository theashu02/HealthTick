'use client'
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { format, getDay, isAfter, startOfDay } from 'date-fns';
import { db } from '@/lib/firebase';
import { Booking } from '@/lib/types';

export const useBookings = (selectedDate: Date, coachId: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Effect to fetch bookings for the selected date
  useEffect(() => {
    setLoadingBookings(true);
    const bookingsRef = collection(db, 'bookings');
    const selectedDayOfWeek = getDay(selectedDate);
    
    const q = query(bookingsRef, where('coachId', '==', coachId));

    const bookingsUnsub = onSnapshot(q, (snapshot) => {
      const allCoachBookings = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startTime: (data.startTime as Timestamp).toDate(),
          endTime: (data.endTime as Timestamp).toDate(),
        } as Booking;
      });

      const todaysBookings = allCoachBookings.filter(booking => {
        if (booking.recurring) {
          return booking.dayOfWeek === selectedDayOfWeek && 
                 !isAfter(startOfDay(booking.startTime), startOfDay(selectedDate));
        } else {
          return format(booking.startTime, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        }
      }).map(booking => {
        if (booking.recurring) {
          const newStartTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${format(booking.startTime, 'HH:mm')}`);
          const newEndTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${format(booking.endTime, 'HH:mm')}`);
          return { ...booking, startTime: newStartTime, endTime: newEndTime };
        }
        return booking;
      });

      setBookings(todaysBookings);
      setLoadingBookings(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoadingBookings(false);
    });

    return () => bookingsUnsub();
  }, [selectedDate, coachId]);

  const handleDelete = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking.");
      }
    }
  };

  return {
    bookings,
    loadingBookings,
    handleDelete
  };
};