export type StopId = 'home' | 'lex86';

export type DayType = 'weekday' | 'weekend';

export interface StopDetails {
  id: StopId;
  name: string;
  shortName: string;
  address: string;
  landmarkNote?: string;
}

export interface DepartureEntry {
  timeStr: string;
  minutes: number; // Minutes from 00:00 midnight
  isLastTrip?: boolean;
}

export interface BreakPeriod {
  name: string;
  startMinutes: number;
  endMinutes: number;
  resumesAt: string;
}

export interface StopSchedule {
  departures: DepartureEntry[];
  breaks: BreakPeriod[];
}

export interface DaySchedule {
  home: StopSchedule;
  lex86: StopSchedule;
}

export interface Countdown {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

export interface NextDepartureResult {
  currentStopId: StopId;
  currentDayType: DayType;
  currentDayName: string;
  currentTimeStr: string;
  nextDeparture: {
    timeStr: string;
    isTomorrow: boolean;
    tomorrowDayName?: string;
    isLastTripToday?: boolean;
    totalSecondsRemaining: number;
  };
  countdown: Countdown;
  upcomingDepartures: Array<{
    timeStr: string;
    minutesUntil: number;
    isTomorrow?: boolean;
    isLastTrip?: boolean;
  }>;
  activeBreak: {
    name: string;
    resumesAt: string;
  } | null;
  isPostService: boolean;
}
