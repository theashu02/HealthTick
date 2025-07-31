import type { Timestamp } from 'firebase/firestore';

export interface Meeting {
  id: string;
  userId: string;
  clientName: string;
  clientPhone: string;
  startTime: Timestamp;
  endTime: Timestamp;
  duration: 20 | 40;
  googleCalendarEventId?: string;
}

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
