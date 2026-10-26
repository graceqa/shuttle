import { SCHEDULES_BY_DAY_TYPE } from '../data/schedule';
import { Countdown, DayType, NextDepartureResult, StopId } from '../types';
import { getHolidayInfo, HolidayInfo } from './holidayUtils';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Returns whether the given date uses a 'weekday' or 'weekend' schedule.
 * If the date is a holiday designated as 'weekend_schedule', it returns 'weekend'.
 */
export function getDayType(date: Date): DayType {
  const holiday = getHolidayInfo(date);
  if (holiday && holiday.type === 'weekend_schedule') {
    return 'weekend';
  }
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
}

/**
 * Returns the human-readable day name (e.g. "Monday")
 */
export function getDayName(date: Date): string {
  return DAYS_OF_WEEK[date.getDay()];
}

/**
 * Format total seconds into a structured Countdown object
 */
export function formatCountdown(totalSeconds: number): Countdown {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  } else {
    formatted = `${seconds}s`;
  }

  return {
    totalSeconds: safeSeconds,
    hours,
    minutes,
    seconds,
    formatted,
  };
}

/**
 * Formats a Date object into a readable 12-hour time string "H:MM:SS AM/PM"
 */
export function formatCurrentTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Finds the next operating calendar day on or after `startDate` that is NOT a no_service holiday.
 */
export function getNextOperatingDate(startDate: Date): { date: Date; holiday: HolidayInfo | null } {
  const candidate = new Date(startDate);
  candidate.setHours(0, 0, 0, 0);

  while (true) {
    const holiday = getHolidayInfo(candidate);
    if (!holiday || holiday.type !== 'no_service') {
      return { date: candidate, holiday };
    }
    candidate.setDate(candidate.getDate() + 1);
  }
}

/**
 * Calculates the next departures, active countdown, breaks, holiday status, and upcoming shuttles
 */
export function getNextShuttleDepartures(stopId: StopId, now: Date = new Date()): NextDepartureResult {
  const todayHoliday = getHolidayInfo(now);
  const currentDayType = getDayType(now);
  const currentDayName = getDayName(now);
  const currentTimeStr = formatCurrentTime(now);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const currentTotalSeconds = hours * 3600 + minutes * 60 + seconds;
  const currentMinuteOfDay = hours * 60 + minutes;

  // CASE 1: Today is a NO SERVICE holiday (e.g. Thanksgiving, Christmas, New Year's Day, etc.)
  if (todayHoliday && todayHoliday.type === 'no_service') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { date: nextOperatingDay } = getNextOperatingDate(tomorrow);

    const targetDayType = getDayType(nextOperatingDay);
    const targetDayName = getDayName(nextOperatingDay);
    const targetSchedule = SCHEDULES_BY_DAY_TYPE[targetDayType][stopId];
    const firstTargetDep = targetSchedule.departures[0];

    const targetDepTime = new Date(nextOperatingDay);
    targetDepTime.setHours(Math.floor(firstTargetDep.minutes / 60), firstTargetDep.minutes % 60, 0, 0);

    const totalSecondsRemaining = Math.max(0, Math.floor((targetDepTime.getTime() - now.getTime()) / 1000));
    const countdown = formatCountdown(totalSecondsRemaining);

    const isTomorrow =
      nextOperatingDay.getDate() === now.getDate() + 1 &&
      nextOperatingDay.getMonth() === now.getMonth() &&
      nextOperatingDay.getFullYear() === now.getFullYear();

    const upcomingList = targetSchedule.departures.slice(1, 4).map((dep) => {
      const depTime = new Date(nextOperatingDay);
      depTime.setHours(Math.floor(dep.minutes / 60), dep.minutes % 60, 0, 0);
      const diffSecs = Math.max(0, Math.floor((depTime.getTime() - now.getTime()) / 1000));
      return {
        timeStr: dep.timeStr,
        minutesUntil: Math.round(diffSecs / 60),
        isTomorrow,
        isLastTrip: dep.isLastTrip,
      };
    });

    return {
      currentStopId: stopId,
      currentDayType,
      currentDayName,
      currentTimeStr,
      nextDeparture: {
        timeStr: firstTargetDep.timeStr,
        isTomorrow,
        tomorrowDayName: targetDayName,
        isLastTripToday: false,
        totalSecondsRemaining,
      },
      countdown,
      upcomingDepartures: upcomingList,
      activeBreak: null,
      activeHoliday: todayHoliday,
      isNoServiceDay: true,
      isPostService: false,
    };
  }

  // CASE 2: Today is an operational day (regular weekday, weekend, or weekend_schedule holiday)
  const todaySchedule = SCHEDULES_BY_DAY_TYPE[currentDayType][stopId];
  const departures = todaySchedule.departures;
  const breaks = todaySchedule.breaks;

  // Check if currently inside a scheduled break period
  let activeBreak: { name: string; resumesAt: string } | null = null;
  for (const b of breaks) {
    if (currentMinuteOfDay >= b.startMinutes && currentMinuteOfDay < b.endMinutes) {
      activeBreak = {
        name: b.name,
        resumesAt: b.resumesAt,
      };
      break;
    }
  }

  // Find departures remaining today
  const upcomingToday = departures.filter(
    (dep) => dep.minutes * 60 > currentTotalSeconds
  );

  if (upcomingToday.length > 0) {
    // Next departure is today
    const nextDep = upcomingToday[0];
    const totalSecondsRemaining = nextDep.minutes * 60 - currentTotalSeconds;
    const countdown = formatCountdown(totalSecondsRemaining);

    // Following upcoming departures (up to 3)
    const upcomingList = upcomingToday.slice(1, 4).map((dep) => ({
      timeStr: dep.timeStr,
      minutesUntil: Math.round((dep.minutes * 60 - currentTotalSeconds) / 60),
      isTomorrow: false,
      isLastTrip: dep.isLastTrip,
    }));

    return {
      currentStopId: stopId,
      currentDayType,
      currentDayName,
      currentTimeStr,
      nextDeparture: {
        timeStr: nextDep.timeStr,
        isTomorrow: false,
        isLastTripToday: nextDep.isLastTrip,
        totalSecondsRemaining,
      },
      countdown,
      upcomingDepartures: upcomingList,
      activeBreak,
      activeHoliday: todayHoliday,
      isNoServiceDay: false,
      isPostService: false,
    };
  }

  // CASE 3: No more departures today -> Rollover to next operating day
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const { date: nextOperatingDay } = getNextOperatingDate(tomorrow);

  const targetDayType = getDayType(nextOperatingDay);
  const targetDayName = getDayName(nextOperatingDay);
  const targetSchedule = SCHEDULES_BY_DAY_TYPE[targetDayType][stopId];
  const firstTargetDep = targetSchedule.departures[0];

  const targetDepTime = new Date(nextOperatingDay);
  targetDepTime.setHours(Math.floor(firstTargetDep.minutes / 60), firstTargetDep.minutes % 60, 0, 0);

  const totalSecondsRemaining = Math.max(0, Math.floor((targetDepTime.getTime() - now.getTime()) / 1000));
  const countdown = formatCountdown(totalSecondsRemaining);

  const isTomorrow =
    nextOperatingDay.getDate() === now.getDate() + 1 &&
    nextOperatingDay.getMonth() === now.getMonth() &&
    nextOperatingDay.getFullYear() === now.getFullYear();

  const upcomingList = targetSchedule.departures.slice(1, 4).map((dep) => {
    const depTime = new Date(nextOperatingDay);
    depTime.setHours(Math.floor(dep.minutes / 60), dep.minutes % 60, 0, 0);
    const diffSecs = Math.max(0, Math.floor((depTime.getTime() - now.getTime()) / 1000));
    return {
      timeStr: dep.timeStr,
      minutesUntil: Math.round(diffSecs / 60),
      isTomorrow,
      isLastTrip: dep.isLastTrip,
    };
  });

  return {
    currentStopId: stopId,
    currentDayType,
    currentDayName,
    currentTimeStr,
    nextDeparture: {
      timeStr: firstTargetDep.timeStr,
      isTomorrow,
      tomorrowDayName: targetDayName,
      isLastTripToday: false,
      totalSecondsRemaining,
    },
    countdown,
    upcomingDepartures: upcomingList,
    activeBreak,
    activeHoliday: todayHoliday,
    isNoServiceDay: false,
    isPostService: true,
  };
}
