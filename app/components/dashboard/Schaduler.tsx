'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hook/user-auth';
import { db } from '@/config/firebase';
import type { Meeting } from '@/lib/types';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { DailySchedule } from './DailySchadule';
import { Skeleton } from '@/components/ui/skeleton';

export function Scheduler() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  const startOfDay = useMemo(() => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    return date;
  }, [selectedDate]);

  const endOfDay = useMemo(() => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate);
    date.setHours(23, 59, 59, 999);
    return date;
  }, [selectedDate]);


  useEffect(() => {
    if (!user || !startOfDay || !endOfDay) {
        setMeetings([]);
        return;
    };
    
    setLoading(true);

    const meetingsCol = collection(db, 'meetings');
    const q = query(
      meetingsCol,
      where('userId', '==', user.uid),
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<=', Timestamp.fromDate(endOfDay))
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userMeetings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Meeting));
      setMeetings(userMeetings);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching meetings: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedDate, startOfDay, endOfDay]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardContent className="p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
          />
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        {loading ? (
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
             </Card>
        ) : (
            <DailySchedule 
                selectedDate={selectedDate || new Date()}
                meetings={meetings}
            />
        )}
      </div>
    </div>
  );
}
