import React from 'react';
import { NextDepartureResult, StopDetails } from '../types';

interface NextShuttleHeroProps {
  departureInfo: NextDepartureResult;
  stopDetails: StopDetails;
}

export const NextShuttleHero: React.FC<NextShuttleHeroProps> = ({
  departureInfo,
  stopDetails,
}) => {
  const { nextDeparture, countdown, activeBreak, isPostService } = departureInfo;

  // Visual status calculation
  let statusBadgeText = 'On Schedule';
  let statusBadgeType = 'status-normal';

  if (activeBreak) {
    statusBadgeText = `${activeBreak.name}`;
    statusBadgeType = 'status-break';
  } else if (isPostService) {
    statusBadgeText = 'Service Concluded';
    statusBadgeType = 'status-ended';
  } else if (nextDeparture.isLastTripToday) {
    statusBadgeText = 'Final Trip Today';
    statusBadgeType = 'status-warning';
  } else if (countdown.totalSeconds <= 180) {
    statusBadgeText = 'Boarding Soon';
    statusBadgeType = 'status-urgent';
  }

  return (
    <div className={`next-shuttle-hero ${statusBadgeType}`}>
      <div className="hero-top-row">
        <span className={`status-badge ${statusBadgeType}`}>
          <span className="status-dot"></span>
          {statusBadgeText}
        </span>
        <span className="stop-target-chip">
          {stopDetails.shortName}
        </span>
      </div>

      <div className="hero-content">
        <div className="departure-time-display">
          <div className="departure-label">
            {nextDeparture.isTomorrow ? `Next Shuttle (${nextDeparture.tomorrowDayName || 'Tomorrow'})` : 'Next Departure'}
          </div>
          <div className="time-number">
            {nextDeparture.timeStr}
          </div>
        </div>

        <div className="countdown-display">
          <div className="countdown-label">Leaves in</div>
          <div className="countdown-value">
            {isPostService && nextDeparture.isTomorrow ? (
              <span className="countdown-tomorrow">
                {countdown.hours}h {countdown.minutes}m
              </span>
            ) : countdown.totalSeconds <= 30 ? (
              <span className="countdown-now">Now</span>
            ) : (
              <span className="countdown-clock">
                {countdown.formatted}
              </span>
            )}
          </div>
        </div>
      </div>

      {activeBreak && (
        <div className="break-callout">
          <span className="break-icon">☕</span>
          <span>
            Currently on <strong>{activeBreak.name}</strong>. Regular service resumes at <strong>{activeBreak.resumesAt}</strong>.
          </span>
        </div>
      )}

      {isPostService && (
        <div className="break-callout night-callout">
          <span className="break-icon">🌙</span>
          <span>
            Shuttle service has ended for today. Service resumes tomorrow at <strong>{nextDeparture.timeStr}</strong>.
          </span>
        </div>
      )}

      <div className="hero-footer-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Reminder: Bus tags must be presented when boarding.</span>
      </div>
    </div>
  );
};
