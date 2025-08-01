import { Client } from './types';

export const DUMMY_CLIENTS: Omit<Client, 'id'>[] = [
  { name: 'Sriram', phone: '555-0101' },
  { name: 'Shilpa', phone: '555-0102' },
  { name: 'Rahul', phone: '555-0103' },
  { name: 'Priya', phone: '555-0104' },
  { name: 'Amit', phone: '555-0105' },
  { name: 'Anjali', phone: '555-0106' },
  { name: 'Vikram', phone: '555-0107' },
  { name: 'Sunita', phone: '555-0108' },
  { name: 'Deepak', phone: '555-0109' },
  { name: 'Meera', phone: '555-0110' },
  { name: 'Rohan', phone: '555-0111' },
  { name: 'Kavita', phone: '555-0112' },
  { name: 'Arjun', phone: '555-0113' },
  { name: 'Neha', phone: '555-0114' },
  { name: 'Sameer', phone: '555-0115' },
  { name: 'Pooja', phone: '555-0116' },
  { name: 'Aditya', phone: '555-0117' },
  { name: 'Isha', phone: '555-0118' },
  { name: 'Harish', phone: '555-0119' },
  { name: 'Divya', phone: '555-0120' }
];

export const CALENDAR_CONFIG = {
  START_HOUR: 10,
  START_MINUTE: 30,
  END_HOUR: 19,
  END_MINUTE: 30,
  SLOT_DURATION_MINUTES: 20,
  ONBOARDING_DURATION: 60,
  FOLLOWUP_DURATION: 40,
} as const;