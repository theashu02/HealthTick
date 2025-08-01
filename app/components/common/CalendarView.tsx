"use client";
import React, { useState, useMemo } from "react";
import {
  format,
  addMinutes,
  startOfDay,
  isEqual,
  isBefore,
  isAfter,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClients } from "@/hook/useClients";
import { useBookings } from "@/hook/useBooking";
import { CALENDAR_CONFIG } from "@/lib/constants";
// import Header from "@/app/components/common/Header";
import BookingCard from "./BookingCard";
import EmptySlot from "./EmptySlot";
import BookingModal from "../../common/Model/BookingModel";
import Sidebar from "./Sidebar";

interface CalendarViewProps {
  user: any;
  onSignOut: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ user, onSignOut }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const coachId = user.uid;
  const { clients } = useClients(user);
  const { bookings, loadingBookings, handleDelete } = useBookings(
    selectedDate,
    coachId
  );

  const timeSlots = useMemo(() => {
    const slots = [];
    let currentTime = startOfDay(selectedDate);
    currentTime.setHours(
      CALENDAR_CONFIG.START_HOUR,
      CALENDAR_CONFIG.START_MINUTE,
      0,
      0
    );
    const endTime = startOfDay(selectedDate);
    endTime.setHours(
      CALENDAR_CONFIG.END_HOUR,
      CALENDAR_CONFIG.END_MINUTE,
      0,
      0
    );

    while (isBefore(currentTime, endTime)) {
      slots.push(new Date(currentTime));
      currentTime = addMinutes(
        currentTime,
        CALENDAR_CONFIG.SLOT_DURATION_MINUTES
      );
    }
    return slots;
  }, [selectedDate]);

  const handleSlotClick = (slot: Date) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const changeDate = (amount: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };

  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar user={user} onSignOut={onSignOut} />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="h-full p-4 sm:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto h-full">
                {/* Page Header */}
                <div className="mb-6 lg:mb-8">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                    Schedule Management
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600">
                    Manage your coaching sessions and appointments
                  </p>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => changeDate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft />
                  </button>
                  <h2 className="text-xl font-semibold text-center">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h2>
                  <button
                    onClick={() => changeDate(1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight />
                  </button>
                </div>

                {/* Schedule Card */}
                <div className="grid grid-cols-1 gap-2">
                  {loadingBookings ? (
                    <div className="text-center py-10">Loading schedule...</div>
                  ) : (
                    timeSlots.map((slot) => {
                      const bookingInSlot = bookings.find(
                        (b) =>
                          !isAfter(slot, b.endTime) &&
                          isBefore(slot, b.endTime) &&
                          !isBefore(slot, b.startTime)
                      );
                      const isSlotBooked = !!bookingInSlot;

                      if (isSlotBooked && bookingInSlot) {
                        if (isEqual(slot, bookingInSlot.startTime)) {
                          return (
                            <BookingCard
                              key={bookingInSlot.id}
                              booking={bookingInSlot}
                              onDelete={handleDelete}
                            />
                          );
                        }
                        return null;
                      } else {
                        return (
                          <EmptySlot
                            key={slot.toISOString()}
                            slot={slot}
                            onClick={() => handleSlotClick(slot)}
                          />
                        );
                      }
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isModalOpen && selectedSlot && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          slot={selectedSlot}
          clients={clients}
          coachId={coachId}
          existingBookings={bookings}
          user={user}
        />
      )}

      {/* hidden div for main */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-screen h-screen hidden mx-auto bg-red-400">
        {/* <Header user={user} onSignOut={onSignOut} /> */}
        <Sidebar user={user} onSignOut={onSignOut} />
        <div className="bg-white p-6 rounded-xl shadow-lg hidden">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-xl font-semibold text-center">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h2>
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {loadingBookings ? (
              <div className="text-center py-10">Loading schedule...</div>
            ) : (
              timeSlots.map((slot) => {
                const bookingInSlot = bookings.find(
                  (b) =>
                    !isAfter(slot, b.endTime) &&
                    isBefore(slot, b.endTime) &&
                    !isBefore(slot, b.startTime)
                );
                const isSlotBooked = !!bookingInSlot;

                if (isSlotBooked && bookingInSlot) {
                  if (isEqual(slot, bookingInSlot.startTime)) {
                    return (
                      <BookingCard
                        key={bookingInSlot.id}
                        booking={bookingInSlot}
                        onDelete={handleDelete}
                      />
                    );
                  }
                  return null;
                } else {
                  return (
                    <EmptySlot
                      key={slot.toISOString()}
                      slot={slot}
                      onClick={() => handleSlotClick(slot)}
                    />
                  );
                }
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarView;
