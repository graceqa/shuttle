import { SCHEDULES_BY_DAY_TYPE } from '../data/schedule';
import { Countdown, DayType, NextDepartureResult, StopId } from '../types';

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
 * Returns whether the given date is a weekday (Mon-Fri) or weekend (Sat-Sun)
 */
export function getDayType(date: Date): DayType {
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
 * Calculates the next departures, active countdown, breaks, and upcoming shuttles
 */
export function getNextShuttleDepartures(stopId: StopId, now: Date = new Date()): NextDepartureResult {
  const currentDayType = getDayType(now);
  const currentDayName = getDayName(now);
  const currentTimeStr = formatCurrentTime(now);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const currentTotalSeconds = hours * 3600 + minutes * 60 + seconds;
  const currentMinuteOfDay = hours * 60 + minutes;

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
  // A departure is eligible if its departure seconds > currentTotalSeconds
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
      isPostService: false,
    };
  }

  // If no departures remaining today, calculate rollover to tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const tomorrowDayType = getDayType(tomorrow);
  const tomorrowDayName = getDayName(tomorrow);
  const tomorrowSchedule = SCHEDULES_BY_DAY_TYPE[tomorrowDayType][stopId];
  const firstTomorrowDep = tomorrowSchedule.departures[0];

  // Seconds until midnight + seconds into tomorrow
  const secondsUntilMidnight = 86400 - currentTotalSeconds;
  const totalSecondsRemaining = secondsUntilMidnight + firstTomorrowDep.minutes * 60;
  const countdown = formatCountdown(totalSecondsRemaining);

  const upcomingList = tomorrowSchedule.departures.slice(1, 4).map((dep) => {
    const totalSecs = secondsUntilMidnight + dep.minutes * 60;
    return {
      timeStr: dep.timeStr,
      minutesUntil: Math.round(totalSecs / 60),
      isTomorrow: true,
      isLastTrip: dep.isLastTrip,
    };
  });

  return {
    currentStopId: stopId,
    currentDayType,
    currentDayName,
    currentTimeStr,
    nextDeparture: {
      timeStr: firstTomorrowDep.timeStr,
      isTomorrow: true,
      tomorrowDayName,
      isLastTripToday: false,
      totalSecondsRemaining,
    },
    countdown,
    upcomingDepartures: upcomingList,
    activeBreak: null,
    isPostService: true,
  };
}
