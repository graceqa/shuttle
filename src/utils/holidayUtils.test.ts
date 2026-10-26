import { describe, expect, it } from 'vitest';
import { getHolidayInfo } from './holidayUtils';
import { getDayType, getNextShuttleDepartures } from './timeUtils';

describe('holidayUtils', () => {
  it('correctly identifies all NO SERVICE holidays in 2026', () => {
    // New Year's Day: Jan 1, 2026
    expect(getHolidayInfo(new Date(2026, 0, 1))?.name).toBe("New Year's Day");
    expect(getHolidayInfo(new Date(2026, 0, 1))?.type).toBe('no_service');

    // Memorial Day: Last Monday in May 2026 is May 25
    expect(getHolidayInfo(new Date(2026, 4, 25))?.name).toBe('Memorial Day');
    expect(getHolidayInfo(new Date(2026, 4, 25))?.type).toBe('no_service');

    // Independence Day: July 4, 2026
    expect(getHolidayInfo(new Date(2026, 6, 4))?.name).toBe('Independence Day');
    expect(getHolidayInfo(new Date(2026, 6, 4))?.type).toBe('no_service');

    // Labor Day: 1st Monday in Sep 2026 is Sep 7
    expect(getHolidayInfo(new Date(2026, 8, 7))?.name).toBe('Labor Day');
    expect(getHolidayInfo(new Date(2026, 8, 7))?.type).toBe('no_service');

    // Thanksgiving: 4th Thursday in Nov 2026 is Nov 26
    expect(getHolidayInfo(new Date(2026, 10, 26))?.name).toBe('Thanksgiving Day');
    expect(getHolidayInfo(new Date(2026, 10, 26))?.type).toBe('no_service');

    // Christmas Day: Dec 25, 2026
    expect(getHolidayInfo(new Date(2026, 11, 25))?.name).toBe('Christmas Day');
    expect(getHolidayInfo(new Date(2026, 11, 25))?.type).toBe('no_service');
  });

  it('correctly identifies all WEEKEND SCHEDULE holidays in 2026', () => {
    // MLK Day: 3rd Monday in Jan 2026 is Jan 19
    expect(getHolidayInfo(new Date(2026, 0, 19))?.name).toBe('Martin Luther King Jr. Day');
    expect(getHolidayInfo(new Date(2026, 0, 19))?.type).toBe('weekend_schedule');

    // Presidents' Day: 3rd Monday in Feb 2026 is Feb 16
    expect(getHolidayInfo(new Date(2026, 1, 16))?.name).toBe("Presidents' Day");
    expect(getHolidayInfo(new Date(2026, 1, 16))?.type).toBe('weekend_schedule');

    // Juneteenth: June 19, 2026
    expect(getHolidayInfo(new Date(2026, 5, 19))?.name).toBe('Juneteenth');
    expect(getHolidayInfo(new Date(2026, 5, 19))?.type).toBe('weekend_schedule');

    // Day After Thanksgiving: Nov 27, 2026
    expect(getHolidayInfo(new Date(2026, 10, 27))?.name).toBe('Day After Thanksgiving');
    expect(getHolidayInfo(new Date(2026, 10, 27))?.type).toBe('weekend_schedule');

    // Christmas Eve: Dec 24, 2026
    expect(getHolidayInfo(new Date(2026, 11, 24))?.name).toBe('Christmas Eve');
    expect(getHolidayInfo(new Date(2026, 11, 24))?.type).toBe('weekend_schedule');

    // New Year's Eve: Dec 31, 2026
    expect(getHolidayInfo(new Date(2026, 11, 31))?.name).toBe("New Year's Eve");
    expect(getHolidayInfo(new Date(2026, 11, 31))?.type).toBe('weekend_schedule');
  });

  it('correctly computes floating holidays for a different year (2027)', () => {
    // Memorial Day 2027: Last Monday in May is May 31
    expect(getHolidayInfo(new Date(2027, 4, 31))?.name).toBe('Memorial Day');

    // Labor Day 2027: 1st Monday in Sep is Sep 6
    expect(getHolidayInfo(new Date(2027, 8, 6))?.name).toBe('Labor Day');

    // Thanksgiving 2027: 4th Thursday in Nov is Nov 25
    expect(getHolidayInfo(new Date(2027, 10, 25))?.name).toBe('Thanksgiving Day');
    expect(getHolidayInfo(new Date(2027, 10, 26))?.name).toBe('Day After Thanksgiving');
  });

  it('treats a weekend_schedule holiday on a Monday (MLK Day) as weekend schedule', () => {
    // Jan 19, 2026 is Monday
    const mlkMonday = new Date(2026, 0, 19, 8, 0, 0); // 8:00 AM
    expect(getDayType(mlkMonday)).toBe('weekend');

    const result = getNextShuttleDepartures('home', mlkMonday);
    expect(result.activeHoliday?.name).toBe('Martin Luther King Jr. Day');
    expect(result.isNoServiceDay).toBe(false);
    // Weekend schedule starts at 10:00 AM, NOT 7:00 AM or 8:20 AM!
    expect(result.nextDeparture.timeStr).toBe('10:00 AM');
  });

  it('handles Thanksgiving Day (No Service) by rolling over to Day After Thanksgiving (Weekend Schedule at 10:00 AM)', () => {
    // Thanksgiving Thursday at 11:00 AM
    const thanksgiving = new Date(2026, 10, 26, 11, 0, 0);
    const result = getNextShuttleDepartures('home', thanksgiving);

    expect(result.isNoServiceDay).toBe(true);
    expect(result.activeHoliday?.name).toBe('Thanksgiving Day');
    // Day after Thanksgiving is Friday, Nov 27, which runs on weekend schedule -> first trip is 10:00 AM
    expect(result.nextDeparture.timeStr).toBe('10:00 AM');
    expect(result.nextDeparture.tomorrowDayName).toBe('Friday');
  });

  it('handles Christmas Day (No Service) by rolling over to Dec 26', () => {
    // Dec 25, 2026 is Friday -> No Service
    const christmas = new Date(2026, 11, 25, 14, 0, 0);
    const result = getNextShuttleDepartures('home', christmas);

    expect(result.isNoServiceDay).toBe(true);
    expect(result.activeHoliday?.name).toBe('Christmas Day');
    // Dec 26 is Saturday -> Weekend schedule starts at 10:00 AM
    expect(result.nextDeparture.timeStr).toBe('10:00 AM');
    expect(result.nextDeparture.tomorrowDayName).toBe('Saturday');
  });

  it('handles Christmas Eve (Weekend Schedule)', () => {
    // Dec 24, 2026 is Thursday -> runs weekend schedule
    const christmasEveMorning = new Date(2026, 11, 24, 9, 30, 0);
    const result = getNextShuttleDepartures('home', christmasEveMorning);

    expect(result.isNoServiceDay).toBe(false);
    expect(result.activeHoliday?.name).toBe('Christmas Eve');
    expect(result.nextDeparture.timeStr).toBe('10:00 AM');
  });
});
