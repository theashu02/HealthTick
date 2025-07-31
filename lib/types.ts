import type { Timestamp } from 'firebase/firestore';

interface Client {
  id: string;
  name: string;
  phone: string;
}

interface Booking {
  id: string;
  client_id: string;
  client_name: string;
  type: 'onboarding' | 'follow-up';
  start_time?: Timestamp;
  end_time?: Timestamp;
  series_start_date?: string;
  recurrence?: {
    dayOfWeek: number;
    time: string;
  };
}

interface TimeSlot {
  time: string;
  booking?: Booking;
  available: boolean;
}



// export interface Meeting {
//   id: string;
//   userId: string;
//   clientName: string;
//   clientPhone: string;
//   startTime: Timestamp;
//   endTime: Timestamp;
//   duration: 20 | 40;
//   googleCalendarEventId?: string;
// }

// export interface Contact {
//   id: string;
//   userId: string;
//   name: string;
//   phone: string;
// }

// export interface UserProfile {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
// }