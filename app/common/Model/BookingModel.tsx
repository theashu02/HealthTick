"use client";
import React, { useState, useCallback, useEffect } from "react";
import { format, addMinutes, getDay, isBefore, isAfter } from "date-fns";
import { collection, addDoc } from "firebase/firestore";
import { X, Video, Repeat, Search, UserPlus } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { BookingModalProps, Client, Booking } from "@/lib/types";
import { CALENDAR_CONFIG } from "@/lib/constants";
import ClientSearch from "@/app/components/common/ClientSearch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  slot,
  clients,
  coachId,
  existingBookings,
  user,
}) => {
  const [mode, setMode] = useState<"search" | "add">("search");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [callType, setCallType] = useState<"onboarding" | "follow-up">(
    "onboarding"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const resetForm = useCallback(() => {
    setMode("search");
    setSelectedClient(null);
    setCallType("onboarding");
    setSearchTerm("");
    setNewClientName("");
    setNewClientPhone("");
    setError("");
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleClientSelection = (client: Client | null) => {
    setSelectedClient(client);
  };


  //  need acces from the google
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
      toast("Could not add to Google Calendar: Not signed in or permissions missing.")
      return;
    }

    const event = {
      summary: bookingDetails.title,
      description: bookingDetails.description,
      start: {
        dateTime: bookingDetails.startTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: bookingDetails.endTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [],
      reminders: {
        useDefault: true,
      },
      ...(bookingDetails.isRecurring && {
        recurrence: ["RRULE:FREQ=WEEKLY"],
      }),
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );
      const data = await response.json();
      if (data.error) {
        console.error("Google Calendar API Error:", data.error);
        toast(`Booking saved, but failed to add to Google Calendar. Error: ${data.error.message}`)
      } else {
        console.log("Event created: %s", data.htmlLink);
      }
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
      toast("Booking saved, but an error occurred while adding to Google Calendar.")
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let clientToBook: Client | null = selectedClient;

    if (mode === "add") {
      if (!newClientName || !newClientPhone) {
        setError("Please provide a name and phone number for the new client.");
        toast("Please provide a name and phone number for the new client.")
        setIsSubmitting(false);
        return;
      }
      try {
        const newClientRef = await addDoc(collection(db, "clients"), {
          name: newClientName,
          phone: newClientPhone,
        });
        clientToBook = {
          id: newClientRef.id,
          name: newClientName,
          phone: newClientPhone,
        };
      } catch (err) {
        console.error("Error adding new client:", err);
        setError("Failed to add new client. Please try again.");
        toast("Failed to add new client. Please try again.")
        setIsSubmitting(false);
        return;
      }
    }

    if (!clientToBook) {
      setError("Please select or add a client.");
      setIsSubmitting(false);
      return;
    }

    const duration =
      callType === "onboarding"
        ? CALENDAR_CONFIG.ONBOARDING_DURATION
        : CALENDAR_CONFIG.FOLLOWUP_DURATION;
    const newBookingStartTime = slot;
    const newBookingEndTime = addMinutes(newBookingStartTime, duration);

    const overlap = existingBookings.some(
      (b) =>
        isBefore(newBookingStartTime, b.endTime) &&
        isAfter(newBookingEndTime, b.startTime)
    );

    if (overlap) {
      setError("This time slot overlaps with an existing booking.");
      toast("This time slot overlaps with an existing booking.")
      setIsSubmitting(false);
      return;
    }

    const newBookingData: Omit<Booking, "id"> = {
      clientId: clientToBook.id,
      clientName: clientToBook.name,
      coachId,
      type: callType,
      startTime: newBookingStartTime,
      endTime: newBookingEndTime,
      ...(callType === "follow-up" && {
        recurring: true,
        dayOfWeek: getDay(newBookingStartTime),
      }),
    };

    try {
      await addDoc(collection(db, "bookings"), newBookingData);

      // await addEventToGoogleCalendar({
      //   startTime: newBookingStartTime,
      //   endTime: newBookingEndTime,
      //   title: `${
      //     callType === "onboarding" ? "Onboarding" : "Follow-up"
      //   } with ${clientToBook.name}`,
      //   description: `Client: ${clientToBook.name}\nPhone: ${clientToBook.phone}\nCall Type: ${callType}`,
      //   isRecurring: callType === "follow-up",
      // });
  
      onClose();
      toast("Great! The meeting has been scheduled perfectly.")
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 border-2 shadow-xl">
        <DialogHeader className="p-4 border-b border-gray-200 dark:border-b dark:border-gray-800">
          <DialogTitle className="text-lg font-semibold">
            Book a Call
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-3 bg-blue-50 dark:bg-black/30 dark:border-2 border border-blue-200 dark:border-gray-900 dark:text-gray-200 rounded-lg text-blue-800">
            Booking for:{" "}
            <span className="font-semibold dark:text-gray-300">
              {format(slot, "EEEE, MMMM d, yyyy")} at {format(slot, "h:mm a")}
            </span>
          </div>

          <div>
            <div className="flex border-b border-gray-200 mb-4">
              <button
                type="button"
                onClick={() => setMode("search")}
                className={`flex-1 py-2 text-sm font-medium flex items-center justify-center dark:text-gray-300 gap-2 dark:hover:rounded-lg hover:dark:bg-gray-700 ${
                  mode === "search"
                    ? "text-blue-600 border-blue-600 dark:border-gray-400 border-b-4 dark:text-gray-200"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Search size={16} /> Search Client
              </button>
              <button
                type="button"
                onClick={() => setMode("add")}
                className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 dark:text-gray-300 dark:hover:rounded-lg hover:dark:bg-gray-700 ${
                  mode === "add"
                    ? "text-blue-600 border-b-2 border-blue-600 dark:border-gray-400 border-b-4 dark:text-gray-200"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <UserPlus size={16} /> Add New Client
              </button>
            </div>

            {mode === "search" && (
              <ClientSearch
                clients={clients}
                searchTerm={searchTerm}
                // selectedClient={selectedClient}
                onSearchChange={setSearchTerm}
                selectedClient={selectedClient}
                onClientSelect={handleClientSelection}
              />
            )}

            {mode === "add" && (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="new-client-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Client Name
                  </Label>
                  <Input
                    id="new-client-name"
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Enter full name"
                    required={mode === "add"}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="new-client-phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Client Phone
                  </Label>
                  <Input
                    id="new-client-phone"
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required={mode === "add"}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Call Type
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCallType("onboarding")}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  callType === "onboarding"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Video className="mb-2 text-green-500" />
                <span className="font-semibold">Onboarding</span>
                <span className="text-xs text-gray-500">
                  ({CALENDAR_CONFIG.ONBOARDING_DURATION} min)
                </span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setCallType("follow-up")}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  callType === "follow-up"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <Repeat className="mb-2 text-purple-500" />
                <span className="font-semibold">Follow-up</span>
                <span className="text-xs text-gray-500">
                  ({CALENDAR_CONFIG.FOLLOWUP_DURATION} min, weekly)
                </span>
              </Button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                (mode === "search" && !selectedClient) ||
                (mode === "add" && (!newClientName || !newClientPhone))
              }
            >
              {isSubmitting ? "Booking..." : "Book Call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
