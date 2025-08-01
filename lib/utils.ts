import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date for display in the calendar
 */
export const formatDisplayDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

/**
 * Formats time for display
 */
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

/**
 * Formats time range for display
 */
export const formatTimeRange = (startTime: Date, endTime: Date): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Checks if two time slots overlap
 */
export const timeSlotsOverlap = (
  start1: Date, 
  end1: Date, 
  start2: Date, 
  end2: Date
): boolean => {
  return start1 < end2 && start2 < end1;
};