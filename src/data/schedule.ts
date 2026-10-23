import { DaySchedule, DayType, StopDetails, StopId } from '../types';

export const STOPS: Record<StopId, StopDetails> = {
  home: {
    id: 'home',
    name: 'Home (Hampton Court)',
    shortName: 'Home',
    address: '333 E 102nd St (front of building)',
    landmarkNote: 'Front of Hampton Court building',
  },
  lex86: {
    id: 'lex86',
    name: '86th St & Lexington',
    shortName: '86th & Lex',
    address: 'S.E. Corner of 86th St & Lexington Ave',
    landmarkNote: 'On 86th St in front of H&M',
  },
};

export const BUS_RULES_NOTE =
  'Bus tags must be presented at all times. No exception to bus route permitted.';

// Helper to convert "H:MM AM/PM" to minutes from 00:00 midnight
export function timeStringToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

export const WEEKDAY_SCHEDULE: DaySchedule = {
  home: {
    departures: [
      '7:00 AM', '7:20 AM', '7:40 AM', '8:00 AM', '8:20 AM', '8:40 AM',
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
      // Lunch Break (12:00 PM - 1:30 PM)
      '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
      '4:30 PM', '4:50 PM', '5:10 PM', '5:30 PM', '5:50 PM',
      // Afternoon Break (5:50 PM - 6:50 PM)
      '6:50 PM', '7:10 PM', '7:30 PM', '7:50 PM', '8:10 PM', '8:30 PM', '8:50 PM'
    ].map((timeStr, idx, arr) => ({
      timeStr,
      minutes: timeStringToMinutes(timeStr),
      isLastTrip: idx === arr.length - 1,
    })),
    breaks: [
      {
        name: 'Lunch Break',
        startMinutes: timeStringToMinutes('12:00 PM'),
        endMinutes: timeStringToMinutes('1:30 PM'),
        resumesAt: '1:30 PM',
      },
      {
        name: 'Afternoon Break',
        startMinutes: timeStringToMinutes('5:50 PM'),
        endMinutes: timeStringToMinutes('6:50 PM'),
        resumesAt: '6:50 PM',
      },
    ],
  },
  lex86: {
    departures: [
      '7:10 AM', '7:30 AM', '7:50 AM', '8:10 AM', '8:30 AM', '8:50 AM',
      '9:10 AM', '9:40 AM', '10:10 AM', '10:40 AM', '11:10 AM', '11:40 AM', '12:10 PM',
      // Lunch Break (12:10 PM - 1:40 PM)
      '1:40 PM', '2:10 PM', '2:40 PM', '3:10 PM', '3:40 PM', '4:10 PM',
      '4:40 PM', '5:00 PM', '5:20 PM', '5:40 PM', '6:00 PM',
      // Afternoon Break (6:00 PM - 6:40 PM)
      '6:40 PM', '7:00 PM', '7:20 PM', '7:40 PM', '8:00 PM', '8:20 PM', '8:40 PM'
    ].map((timeStr, idx, arr) => ({
      timeStr,
      minutes: timeStringToMinutes(timeStr),
      isLastTrip: idx === arr.length - 1,
    })),
    breaks: [
      {
        name: 'Lunch Break',
        startMinutes: timeStringToMinutes('12:10 PM'),
        endMinutes: timeStringToMinutes('1:40 PM'),
        resumesAt: '1:40 PM',
      },
      {
        name: 'Afternoon Break',
        startMinutes: timeStringToMinutes('6:00 PM'),
        endMinutes: timeStringToMinutes('6:40 PM'),
        resumesAt: '6:40 PM',
      },
    ],
  },
};

export const WEEKEND_SCHEDULE: DaySchedule = {
  home: {
    departures: [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM',
      // Lunch Break (1:00 PM - 2:30 PM)
      '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM'
    ].map((timeStr, idx, arr) => ({
      timeStr,
      minutes: timeStringToMinutes(timeStr),
      isLastTrip: idx === arr.length - 1,
    })),
    breaks: [
      {
        name: 'Lunch Break',
        startMinutes: timeStringToMinutes('1:00 PM'),
        endMinutes: timeStringToMinutes('2:30 PM'),
        resumesAt: '2:30 PM',
      },
    ],
  },
  lex86: {
    departures: [
      '10:10 AM', '10:40 AM', '11:10 AM', '11:40 AM', '12:10 PM', '12:40 PM', '1:10 PM',
      // Lunch Break (1:10 PM - 2:40 PM)
      '2:40 PM', '3:10 PM', '3:40 PM', '4:10 PM', '4:40 PM', '5:10 PM', '5:40 PM'
    ].map((timeStr, idx, arr) => ({
      timeStr,
      minutes: timeStringToMinutes(timeStr),
      isLastTrip: idx === arr.length - 1,
    })),
    breaks: [
      {
        name: 'Lunch Break',
        startMinutes: timeStringToMinutes('1:10 PM'),
        endMinutes: timeStringToMinutes('2:40 PM'),
        resumesAt: '2:40 PM',
      },
    ],
  },
};

export const SCHEDULES_BY_DAY_TYPE: Record<DayType, DaySchedule> = {
  weekday: WEEKDAY_SCHEDULE,
  weekend: WEEKEND_SCHEDULE,
};
