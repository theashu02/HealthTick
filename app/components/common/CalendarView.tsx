// "use client";
// import React, { useState, useMemo } from "react";
// import {
//   format,
//   addMinutes,
//   startOfDay,
//   isEqual,
//   isBefore,
//   isAfter,
// } from "date-fns";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useClients } from "@/hook/useClients";
// import { useBookings } from "@/hook/useBooking";
// import { CALENDAR_CONFIG } from "@/lib/constants";
// import BookingCard from "./BookingCard";
// import EmptySlot from "./EmptySlot";
// import BookingModal from "../../common/Model/BookingModel";
// import Sidebar from "./Sidebar";

// interface CalendarViewProps {
//   user: any;
//   onSignOut: () => void;
// }

// const CalendarView: React.FC<CalendarViewProps> = ({ user, onSignOut }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

//   const coachId = user.uid;
//   const { clients } = useClients(user);
//   const { bookings, loadingBookings, handleDelete } = useBookings(
//     selectedDate,
//     coachId
//   );

//   const timeSlots = useMemo(() => {
//     const slots = [];
//     let currentTime = startOfDay(selectedDate);
//     currentTime.setHours(
//       CALENDAR_CONFIG.START_HOUR,
//       CALENDAR_CONFIG.START_MINUTE,
//       0,
//       0
//     );
//     const endTime = startOfDay(selectedDate);
//     endTime.setHours(
//       CALENDAR_CONFIG.END_HOUR,
//       CALENDAR_CONFIG.END_MINUTE,
//       0,
//       0
//     );

//     while (isBefore(currentTime, endTime)) {
//       slots.push(new Date(currentTime));
//       currentTime = addMinutes(
//         currentTime,
//         CALENDAR_CONFIG.SLOT_DURATION_MINUTES
//       );
//     }
//     return slots;
//   }, [selectedDate]);

//   const handleSlotClick = (slot: Date) => {
//     setSelectedSlot(slot);
//     setIsModalOpen(true);
//   };

//   const changeDate = (amount: number) => {
//     const newDate = new Date(selectedDate);
//     newDate.setDate(newDate.getDate() + amount);
//     setSelectedDate(newDate);
//   };

//   return (
//     <>
//       <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//         <Sidebar user={user} onSignOut={onSignOut} />
//         <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//           {/* Main Content Area */}
//           <div className="flex-1 overflow-auto">
//             <div className="h-full p-4 sm:p-6 lg:p-8">
//               <div className="max-w-7xl mx-auto h-full">
//                 {/* Page Header */}
//                 <div className="mb-6 lg:mb-8">
//                   <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
//                     Schedule Management
//                   </h1>
//                   <p className="text-sm sm:text-base text-slate-600">
//                     Manage your coaching sessions and appointments
//                   </p>
//                 </div>

//                 <div className="flex justify-between items-center mb-6">
//                   <button
//                     onClick={() => changeDate(-1)}
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <ChevronLeft />
//                   </button>
//                   <h2 className="text-xl font-semibold text-center">
//                     {format(selectedDate, "EEEE, MMMM d, yyyy")}
//                   </h2>
//                   <button
//                     onClick={() => changeDate(1)}
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <ChevronRight />
//                   </button>
//                 </div>

//                 {/* Schedule Card */}
//                 <div className="grid grid-cols-1 gap-2">
//                   {loadingBookings ? (
//                     <div className="text-center py-10">Loading schedule...</div>
//                   ) : (
//                     timeSlots.map((slot) => {
//                       const bookingInSlot = bookings.find(
//                         (b) =>
//                           !isAfter(slot, b.endTime) &&
//                           isBefore(slot, b.endTime) &&
//                           !isBefore(slot, b.startTime)
//                       );
//                       const isSlotBooked = !!bookingInSlot;

//                       if (isSlotBooked && bookingInSlot) {
//                         if (isEqual(slot, bookingInSlot.startTime)) {
//                           return (
//                             <BookingCard
//                               key={bookingInSlot.id}
//                               booking={bookingInSlot}
//                               onDelete={handleDelete}
//                             />
//                           );
//                         }
//                         return null;
//                       } else {
//                         return (
//                           <EmptySlot
//                             key={slot.toISOString()}
//                             slot={slot}
//                             onClick={() => handleSlotClick(slot)}
//                           />
//                         );
//                       }
//                     })
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//       {isModalOpen && selectedSlot && (
//         <BookingModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           slot={selectedSlot}
//           clients={clients}
//           coachId={coachId}
//           existingBookings={bookings}
//           user={user}
//         />
//       )}
//     </>
//   );
// };

// export default CalendarView;

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
import { useClients } from "@/hook/useClients";
import { useBookings } from "@/hook/useBooking";
import { CALENDAR_CONFIG } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar";
import BookingCard from "./BookingCard";
import EmptySlot from "./EmptySlot";
import BookingModal from "../../common/Model/BookingModel";
import Sidebar from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarViewProps {
  user: any;
  onSignOut: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ user, onSignOut }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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
    // Ensure selectedDate is a valid Date object before proceeding
    if (!selectedDate) return [];

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

  // The changeDate function is no longer needed

  return (
    <>
      <div className="flex h-screen bg-[#f4f4f4] dark:bg-black dark:border-2">
        <Sidebar user={user} onSignOut={onSignOut} />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <div className="max-w-screen mx-auto h-full">
              {/* Page Header */}
              <div className="p-4 mt-16 md:mt-0">
                <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-gray-200 mb-2">
                  Schedule Management
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300">
                  Select a day from the calendar to view or manage your
                  schedule.
                </p>
              </div>

              {/* Main Content: Calendar and Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)] p-6 md:p-8">
                {/* Left Column: Calendar */}
                <div className="lg:col-span-1">
                  <div className="bg-[#f4f4f4] dark:bg-black/50 rounded-lg border-2 shadow-sm p-4 lg:sticky lg:top-8 dark:border-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md w-full dark:border-2 dark:border-gray-900 bg-[#f4f4f4]"
                    />
                  </div>
                </div>

                {/* Right Column: Time Slots for Selected Day */}
                <div className="lg:col-span-2">
                  <div className="bg-[#f4f4f4] dark:bg-black/50 rounded-lg border shadow-sm flex flex-col h-full dark:border-4">
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-gray-300">
                        Schedule for{" "}
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </h2>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-hidden mb-5">
                      <ScrollArea className="h-full w-full">
                        <div className="p-4 sm:p-6 pt-4">
                          <div className="grid grid-cols-1 gap-3 max-h-96">
                            {loadingBookings ? (
                              <div className="flex items-center justify-center h-64 text-slate-500">
                                <div className="text-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mx-auto mb-2"></div>
                                  Loading schedule...
                                </div>
                              </div>
                            ) : timeSlots.length > 0 ? (
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
                            ) : (
                              <div className="flex items-center justify-center h-64 text-slate-500">
                                <div className="text-center">
                                  <div className="text-4xl mb-2">📅</div>
                                  <p className="text-lg font-medium mb-1">
                                    No time slots available
                                  </p>
                                  <p className="text-sm">
                                    Select a different date to view available
                                    slots.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
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
    </>
  );
};

export default CalendarView;
