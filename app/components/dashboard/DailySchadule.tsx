'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Trash2, User, Phone } from 'lucide-react';
import { ScheduleDialog } from './SchaduleDialog';
import type { Meeting } from '@/lib/types';
import { deleteMeeting } from '@/hook/action';
// import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hook/user-auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const timeSlots = [
  '10:30', '10:50', '11:00', '11:20', '11:40', '12:00', '12:20', '12:40', '13:00', '13:20',
  '13:40', '14:00', '14:20', '14:40', '15:00', '15:20', '15:40', '16:00', '16:20', '16:40',
  '17:00', '17:20', '17:40', '18:00', '18:20', '18:40', '19:00', '19:20'
];

interface DailyScheduleProps {
  selectedDate: Date;
  meetings: Meeting[];
}

export function DailySchedule({ selectedDate, meetings }: DailyScheduleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
//   const { toast } = useToast();
  const { accessToken } = useAuth();
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(selectedDate);

  const availableSlots = useMemo(() => {
    return timeSlots.filter(slot => {
      const slotTime = new Date(selectedDate);
      const [hours, minutes] = slot.split(':').map(Number);
      slotTime.setHours(hours, minutes, 0, 0);

      return !meetings.some(meeting => {
        const meetingStart = meeting.startTime.toDate();
        const meetingEnd = meeting.endTime.toDate();
        return slotTime >= meetingStart && slotTime < meetingEnd;
      });
    });
  }, [meetings, selectedDate]);
  
  const handleSlotClick = (time: string) => {
    setSelectedTime(time);
    setIsDialogOpen(true);
  };

  const handleDelete = async (meeting: Meeting) => {
    if (!accessToken) {
        // toast({ variant: 'destructive', title: 'Authentication Error', description: 'Could not verify user.' });
        return;
    }
    const result = await deleteMeeting(meeting, accessToken);
    if (result.success) {
        // toast({ title: 'Success', description: 'Meeting deleted successfully.' });
    } else {
        // toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const sortedMeetings = useMemo(() => {
    return [...meetings].sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());
  }, [meetings]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{formattedDate}</CardTitle>
          <CardDescription>Available slots and scheduled meetings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold">Available Times</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {availableSlots.map(time => (
                <Button key={time} variant="outline" onClick={() => handleSlotClick(time)}>
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </Button>
              ))}
              {availableSlots.length === 0 && (
                <p className="col-span-full text-muted-foreground">No available slots for this day.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Scheduled Meetings</h3>
            <div className="space-y-4">
              {sortedMeetings.map(meeting => (
                 <div key={meeting.id} className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="space-y-1">
                        <p className="font-semibold text-primary">{meeting.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {meeting.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <div className="flex items-center text-sm text-muted-foreground"><User className="mr-2 h-4 w-4" /> {meeting.clientName}</div>
                        <div className="flex items-center text-sm text-muted-foreground"><Phone className="mr-2 h-4 w-4" /> {meeting.clientPhone}</div>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the meeting
                            from your schedule and Google Calendar.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(meeting)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </div>
              ))}
              {meetings.length === 0 && (
                <p className="text-muted-foreground">No meetings scheduled for this day.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <ScheduleDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </>
  );
}
