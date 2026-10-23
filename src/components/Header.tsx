import React from 'react';
import { DayType } from '../types';

interface HeaderProps {
  currentDayName: string;
  currentDayType: DayType;
  currentTimeStr: string;
  onOpenFullSchedule: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDayName,
  currentDayType,
  currentTimeStr,
  onOpenFullSchedule,
}) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
              <path d="M4 11h16" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Hampton Court Shuttle</h1>
            <p className="brand-subtitle">Live Departure Tracker</p>
          </div>
        </div>

        <button
          type="button"
          className="schedule-btn"
          onClick={onOpenFullSchedule}
          title="View full schedule timetable"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Timetable</span>
        </button>
      </div>

      <div className="header-meta">
        <div className="live-clock">
          <span className="live-pulse" aria-hidden="true"></span>
          <span className="clock-time">{currentTimeStr}</span>
        </div>
        <div className="day-badge-container">
          <span className={`day-pill ${currentDayType}`}>
            {currentDayName} ({currentDayType === 'weekday' ? 'Weekday Schedule' : 'Weekend Schedule'})
          </span>
        </div>
      </div>
    </header>
  );
};
