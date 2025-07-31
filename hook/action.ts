'use server';

import { z } from 'zod';
import { auth, db } from '@/config/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import type { Meeting, Contact } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

const scheduleSchema = z.object({
  clientName: z.string().min(2),
  clientPhone: z.string().min(10),
  duration: z.union([z.literal(20), z.literal(40)]),
  date: z.string().datetime(),
  time: z.string(),
});

// Helper to get user from token
async function getUserIdFromToken() {
    const authorization = await headers().get('Authorization');
    if (!authorization) return null;
    const idToken = authorization.split('Bearer ')[1];
    if (!idToken) return null;
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return decodedToken.uid;
    } catch (error) {
        console.error("Error verifying auth token:", error);
        return null;
    }
}


// --- Google Calendar API Calls ---
const GOOGLE_CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

async function createGoogleCalendarEvent(accessToken: string, meeting: Omit<Meeting, 'id' | 'userId'> & {clientEmail?: string}) {
    try {
        const response = await fetch(GOOGLE_CALENDAR_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                summary: `Meeting with ${meeting.clientName}`,
                description: `Scheduled via TimeWise Scheduler. Client Phone: ${meeting.clientPhone}`,
                start: { dateTime: meeting.startTime.toDate().toISOString() },
                end: { dateTime: meeting.endTime.toDate().toISOString() },
                attendees: meeting.clientEmail ? [{ email: meeting.clientEmail }] : [],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 10 },
                    ],
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Google Calendar API Error:', error);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to create Google Calendar event:', error);
        return null;
    }
}

async function deleteGoogleCalendarEvent(accessToken: string, eventId: string) {
    try {
        const response = await fetch(`${GOOGLE_CALENDAR_API_URL}/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 204) {
            return true;
        }
        console.error('Failed to delete Google Calendar event:', await response.text());
        return false;
    } catch (error) {
        console.error('Error deleting Google Calendar event:', error);
        return false;
    }
}

// --- Server Actions ---

export async function scheduleMeeting(data: unknown, accessToken: string) {
    const result = scheduleSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: 'Invalid data provided.' };
    }
    const { clientName, clientPhone, duration, date, time } = result.data;
  
    const userId = await getUserIdFromToken();
    if (!userId) {
        return { success: false, error: 'User not authenticated.' };
    }

    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Check for conflicts
    const meetingsRef = collection(db, 'meetings');
    const q = query(
      meetingsRef,
      where('userId', '==', userId),
      where('startTime', '<', Timestamp.fromDate(endTime)),
      where('endTime', '>', Timestamp.fromDate(startTime))
    );
    const conflictingMeetings = await getDocs(q);
    if (!conflictingMeetings.empty) {
        return { success: false, error: 'This time slot is no longer available.' };
    }
    
    // Create Meeting object for Google Calendar
    const newMeetingData = {
        clientName,
        clientPhone,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        duration,
    };

    const gcalEvent = await createGoogleCalendarEvent(accessToken, newMeetingData);

    try {
        await addDoc(collection(db, 'meetings'), {
          userId,
          ...newMeetingData,
          googleCalendarEventId: gcalEvent?.id ?? null,
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        if (gcalEvent?.id) {
            await deleteGoogleCalendarEvent(accessToken, gcalEvent.id);
        }
        return { success: false, error: 'Failed to save meeting to database.' };
    }
}

export async function deleteMeeting(meeting: Meeting, accessToken: string) {
    const userId = await getUserIdFromToken();
    if (!userId || userId !== meeting.userId) {
        return { success: false, error: 'Unauthorized action.' };
    }

    try {
        if (meeting.googleCalendarEventId) {
            await deleteGoogleCalendarEvent(accessToken, meeting.googleCalendarEventId);
        }

        await deleteDoc(doc(db, 'meetings', meeting.id));
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to delete meeting.' };
    }
}