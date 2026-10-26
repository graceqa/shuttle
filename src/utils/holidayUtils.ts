export type HolidayType = 'no_service' | 'weekend_schedule';

export interface HolidayInfo {
  name: string;
  type: HolidayType;
}

/**
 * Returns the N-th occurrence of a day of week (0=Sun, 1=Mon, ..., 4=Thu, etc.) in a given year and month (0-indexed).
 */
function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, n: number): number {
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === dayOfWeek) {
      count++;
      if (count === n) {
        return day;
      }
    }
  }
  return 1;
}

/**
 * Returns the date of the last occurrence of a day of week in a given year and month (0-indexed).
 */
function getLastDayOfMonth(year: number, month: number, dayOfWeek: number): number {
  for (let day = 31; day >= 20; day--) {
    const d = new Date(year, month, day);
    if (d.getMonth() === month && d.getDay() === dayOfWeek) {
      return day;
    }
  }
  return 31;
}

/**
 * Checks if the given date is one of the designated building holidays and returns its rule.
 *
 * NO SERVICE HOLIDAYS:
 * - New Year's Day (Jan 1)
 * - Memorial Day (Last Monday in May)
 * - Independence Day (July 4)
 * - Labor Day (First Monday in September)
 * - Thanksgiving Day (Fourth Thursday in November)
 * - Christmas Day (December 25)
 *
 * WEEKEND SCHEDULE HOLIDAYS:
 * - Martin Luther King Jr. Day (Third Monday in January)
 * - Presidents' Day (Third Monday in February)
 * - Juneteenth (June 19)
 * - Day After Thanksgiving (Fourth Friday in November)
 * - Christmas Eve (December 24)
 * - New Year's Eve (December 31)
 */
export function getHolidayInfo(date: Date): HolidayInfo | null {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate(); // 1-31

  // January (month 0)
  if (month === 0) {
    if (day === 1) {
      return { name: "New Year's Day", type: 'no_service' };
    }
    const mlkDay = getNthDayOfMonth(year, 0, 1, 3); // 3rd Monday
    if (day === mlkDay) {
      return { name: 'Martin Luther King Jr. Day', type: 'weekend_schedule' };
    }
  }

  // February (month 1)
  if (month === 1) {
    const presDay = getNthDayOfMonth(year, 1, 1, 3); // 3rd Monday
    if (day === presDay) {
      return { name: "Presidents' Day", type: 'weekend_schedule' };
    }
  }

  // May (month 4)
  if (month === 4) {
    const memDay = getLastDayOfMonth(year, 4, 1); // Last Monday
    if (day === memDay) {
      return { name: 'Memorial Day', type: 'no_service' };
    }
  }

  // June (month 5)
  if (month === 5) {
    if (day === 19) {
      return { name: 'Juneteenth', type: 'weekend_schedule' };
    }
  }

  // July (month 6)
  if (month === 6) {
    if (day === 4) {
      return { name: 'Independence Day', type: 'no_service' };
    }
  }

  // September (month 8)
  if (month === 8) {
    const laborDay = getNthDayOfMonth(year, 8, 1, 1); // 1st Monday
    if (day === laborDay) {
      return { name: 'Labor Day', type: 'no_service' };
    }
  }

  // November (month 10)
  if (month === 10) {
    const thanksgivingDay = getNthDayOfMonth(year, 10, 4, 4); // 4th Thursday
    if (day === thanksgivingDay) {
      return { name: 'Thanksgiving Day', type: 'no_service' };
    }
    const dayAfterThanksgiving = thanksgivingDay + 1; // 4th Friday
    if (day === dayAfterThanksgiving) {
      return { name: 'Day After Thanksgiving', type: 'weekend_schedule' };
    }
  }

  // December (month 11)
  if (month === 11) {
    if (day === 24) {
      return { name: 'Christmas Eve', type: 'weekend_schedule' };
    }
    if (day === 25) {
      return { name: 'Christmas Day', type: 'no_service' };
    }
    if (day === 31) {
      return { name: "New Year's Eve", type: 'weekend_schedule' };
    }
  }

  return null;
}

export const HOLIDAY_POLICY_LIST: Array<{ name: string; type: HolidayType; ruleDescription: string }> = [
  { name: "New Year's Day (Jan 1)", type: 'no_service', ruleDescription: 'No Shuttle Service' },
  { name: 'Memorial Day (Last Mon in May)', type: 'no_service', ruleDescription: 'No Shuttle Service' },
  { name: 'Independence Day (July 4)', type: 'no_service', ruleDescription: 'No Shuttle Service' },
  { name: 'Labor Day (1st Mon in Sep)', type: 'no_service', ruleDescription: 'No Shuttle Service' },
  { name: 'Thanksgiving Day (4th Thu in Nov)', type: 'no_service', ruleDescription: 'No Shuttle Service' },
  { name: 'Christmas Day (Dec 25)', type: 'no_service', ruleDescription: 'No Shuttle Service' },

  { name: 'Martin Luther King Jr. Day (3rd Mon in Jan)', type: 'weekend_schedule', ruleDescription: 'Runs on Weekend Schedule' },
  { name: "Presidents' Day (3rd Mon in Feb)", type: 'weekend_schedule', ruleDescription: 'Runs on Weekend Schedule' },
  { name: 'Juneteenth (June 19)', type: 'weekend_schedule', ruleDescription: 'Runs on Weekend Schedule' },
  { name: 'Day After Thanksgiving (Black Friday)', type: 'weekend_schedule', ruleDescription: 'Runs on Weekend Schedule' },
  { name: 'Christmas Eve (Dec 24)', type: 'weekend_schedule', ruleDescription: 'Runs on Weekend Schedule' },
  { name: "New Year's Eve (Dec 31)", type: 'weekend_schedule', ruleDescription: 'Runs on Weekend Schedule' },
];
