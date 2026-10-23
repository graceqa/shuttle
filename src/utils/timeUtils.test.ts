import { describe, expect, it } from 'vitest';
import { timeStringToMinutes, WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE } from '../data/schedule';
import { formatCountdown, getDayName, getDayType, getNextShuttleDepartures } from './timeUtils';

describe('timeUtils', () => {
  it('parses time strings to minutes correctly', () => {
    expect(timeStringToMinutes('7:00 AM')).toBe(7 * 60);
    expect(timeStringToMinutes('12:00 PM')).toBe(12 * 60);
    expect(timeStringToMinutes('1:30 PM')).toBe(13 * 60 + 30);
    expect(timeStringToMinutes('8:50 PM')).toBe(20 * 60 + 50);
    expect(timeStringToMinutes('12:00 AM')).toBe(0);
  });

  it('detects weekday vs weekend accurately', () => {
    // 2026-10-23 is Friday
    const friday = new Date(2026, 9, 23);
    expect(getDayType(friday)).toBe('weekday');
    expect(getDayName(friday)).toBe('Friday');

    // 2026-10-24 is Saturday
    const saturday = new Date(2026, 9, 24);
    expect(getDayType(saturday)).toBe('weekend');
    expect(getDayName(saturday)).toBe('Saturday');

    // 2026-10-25 is Sunday
    const sunday = new Date(2026, 9, 25);
    expect(getDayType(sunday)).toBe('weekend');
    expect(getDayName(sunday)).toBe('Sunday');

    // 2026-10-26 is Monday
    const monday = new Date(2026, 9, 26);
    expect(getDayType(monday)).toBe('weekday');
    expect(getDayName(monday)).toBe('Monday');
  });

  it('formats countdowns cleanly', () => {
    expect(formatCountdown(45).formatted).toBe('45s');
    expect(formatCountdown(125).formatted).toBe('2m 05s');
    expect(formatCountdown(3665).formatted).toBe('1h 01m 05s');
  });

  it('finds early morning departure before first shuttle on weekday', () => {
    // Friday at 6:30 AM
    const now = new Date(2026, 9, 23, 6, 30, 0);
    const result = getNextShuttleDepartures('home', now);

    expect(result.currentDayType).toBe('weekday');
    expect(result.nextDeparture.timeStr).toBe('7:00 AM');
    expect(result.nextDeparture.isTomorrow).toBe(false);
    expect(result.countdown.hours).toBe(0);
    expect(result.countdown.minutes).toBe(30);
    expect(result.activeBreak).toBeNull();
  });

  it('switches to the next departure immediately after departure time passes', () => {
    // Friday at 7:00:01 AM (7:00 AM just departed, next is 7:20 AM)
    const now = new Date(2026, 9, 23, 7, 0, 1);
    const result = getNextShuttleDepartures('home', now);

    expect(result.nextDeparture.timeStr).toBe('7:20 AM');
    expect(result.countdown.minutes).toBe(19);
    expect(result.countdown.seconds).toBe(59);
  });

  it('identifies weekday lunch break and next departure for Home', () => {
    // Friday at 12:15 PM (Lunch break is 12:00 PM - 1:30 PM)
    const now = new Date(2026, 9, 23, 12, 15, 0);
    const result = getNextShuttleDepartures('home', now);

    expect(result.nextDeparture.timeStr).toBe('1:30 PM');
    expect(result.activeBreak).not.toBeNull();
    expect(result.activeBreak?.name).toBe('Lunch Break');
    expect(result.activeBreak?.resumesAt).toBe('1:30 PM');
  });

  it('identifies weekday afternoon break and next departure for 86th St', () => {
    // Friday at 6:15 PM (86th break is 6:00 PM - 6:40 PM)
    const now = new Date(2026, 9, 23, 18, 15, 0);
    const result = getNextShuttleDepartures('lex86', now);

    expect(result.nextDeparture.timeStr).toBe('6:40 PM');
    expect(result.activeBreak).not.toBeNull();
    expect(result.activeBreak?.name).toBe('Afternoon Break');
    expect(result.activeBreak?.resumesAt).toBe('6:40 PM');
  });

  it('identifies weekend lunch break for 86th St (1:10 PM - 2:40 PM)', () => {
    // Saturday at 1:30 PM
    const now = new Date(2026, 9, 24, 13, 30, 0);
    const result = getNextShuttleDepartures('lex86', now);

    expect(result.activeBreak).not.toBeNull();
    expect(result.activeBreak?.name).toBe('Lunch Break');
    expect(result.activeBreak?.resumesAt).toBe('2:40 PM');
    expect(result.nextDeparture.timeStr).toBe('2:40 PM');
  });

  it('handles post-service evening rollover from Friday night to Saturday morning', () => {
    // Friday at 9:15 PM (after 8:50 PM last trip from Home)
    const now = new Date(2026, 9, 23, 21, 15, 0);
    const result = getNextShuttleDepartures('home', now);

    expect(result.isPostService).toBe(true);
    expect(result.nextDeparture.isTomorrow).toBe(true);
    expect(result.nextDeparture.tomorrowDayName).toBe('Saturday');
    // Saturday first shuttle from Home is 10:00 AM
    expect(result.nextDeparture.timeStr).toBe('10:00 AM');
  });

  it('handles weekend schedule on Saturday morning', () => {
    // Saturday at 9:30 AM
    const now = new Date(2026, 9, 24, 9, 30, 0);
    const result = getNextShuttleDepartures('home', now);

    expect(result.currentDayType).toBe('weekend');
    expect(result.nextDeparture.timeStr).toBe('10:00 AM');
    expect(result.nextDeparture.isTomorrow).toBe(false);
  });

  it('handles Sunday night rollover to Monday weekday schedule', () => {
    // Sunday at 6:30 PM (after 6:00 PM last trip from Home)
    const now = new Date(2026, 9, 25, 18, 30, 0);
    const result = getNextShuttleDepartures('home', now);

    expect(result.isPostService).toBe(true);
    expect(result.nextDeparture.isTomorrow).toBe(true);
    expect(result.nextDeparture.tomorrowDayName).toBe('Monday');
    // Monday first shuttle is 7:00 AM
    expect(result.nextDeparture.timeStr).toBe('7:00 AM');
  });

  it('matches all schedule counts against PDF specifications', () => {
    // Weekday:
    // Home: 13 morning/midday + 11 afternoon + 7 evening = 31 departures
    expect(WEEKDAY_SCHEDULE.home.departures.length).toBe(31);
    // 86th: 13 morning/midday + 11 afternoon + 7 evening = 31 departures
    expect(WEEKDAY_SCHEDULE.lex86.departures.length).toBe(31);

    // Weekend:
    // Home: 7 morning/midday + 8 afternoon/evening = 15 departures
    expect(WEEKEND_SCHEDULE.home.departures.length).toBe(15);
    // 86th: 7 morning/midday + 7 afternoon = 14 departures
    expect(WEEKEND_SCHEDULE.lex86.departures.length).toBe(14);
  });
});
