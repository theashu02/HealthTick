export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  coachId: string;
  type: 'onboarding' | 'follow-up';
  startTime: Date;
  endTime: Date;
  recurring?: boolean;
  dayOfWeek?: number;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: Date;
  clients: Client[];
  coachId: string;
  existingBookings: Booking[];
  user: any; // Firebase User type
}

export interface BookingCardProps {
  booking: Booking;
  onDelete: (id: string) => void;
}

export interface EmptySlotProps {
  slot: Date;
  onClick: () => void;
}

export interface LoginProps {
  onSignIn: () => void;
  authError: string | null;
}