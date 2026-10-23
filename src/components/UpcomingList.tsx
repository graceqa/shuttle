import React from 'react';
import { NextDepartureResult } from '../types';

interface UpcomingListProps {
  departureInfo: NextDepartureResult;
}

export const UpcomingList: React.FC<UpcomingListProps> = ({ departureInfo }) => {
  const { upcomingDepartures, isPostService } = departureInfo;

  if (upcomingDepartures.length === 0) {
    return null;
  }

  return (
    <div className="upcoming-section">
      <h2 className="section-title">
        {isPostService ? 'Tomorrow\'s Follow-up Departures' : 'Later Departures'}
      </h2>

      <div className="upcoming-grid">
        {upcomingDepartures.map((item, index) => {
          let relativeText = '';
          if (item.minutesUntil < 60) {
            relativeText = `in ${item.minutesUntil}m`;
          } else {
            const h = Math.floor(item.minutesUntil / 60);
            const m = item.minutesUntil % 60;
            relativeText = `in ${h}h ${m > 0 ? `${m}m` : ''}`;
          }

          return (
            <div key={`${item.timeStr}-${index}`} className="upcoming-card">
              <div className="upcoming-time-col">
                <span className="upcoming-time">{item.timeStr}</span>
                {item.isLastTrip && (
                  <span className="last-trip-tag">Last Trip</span>
                )}
              </div>
              <div className="upcoming-relative-col">
                <span className="upcoming-relative-chip">{relativeText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
