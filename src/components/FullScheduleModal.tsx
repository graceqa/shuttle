import React, { useState } from 'react';
import { SCHEDULES_BY_DAY_TYPE, STOPS } from '../data/schedule';
import { DayType, StopId } from '../types';

interface FullScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStopId: StopId;
  currentDayType: DayType;
  nextDepartureTimeStr?: string;
}

export const FullScheduleModal: React.FC<FullScheduleModalProps> = ({
  isOpen,
  onClose,
  activeStopId,
  currentDayType,
  nextDepartureTimeStr,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<DayType>(currentDayType);
  const [selectedStopTab, setSelectedStopTab] = useState<StopId>(activeStopId);

  if (!isOpen) return null;

  const currentSchedule = SCHEDULES_BY_DAY_TYPE[selectedDayTab][selectedStopTab];
  const stopDetails = STOPS[selectedStopTab];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Complete Shuttle Timetable</h2>
            <p className="modal-subtitle">Official Glenwood Hampton Court Schedule</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close timetable modal"
          >
            ✕
          </button>
        </div>

        {/* Schedule Day Selector */}
        <div className="modal-tabs-wrapper">
          <div className="modal-day-tabs">
            <button
              type="button"
              className={`modal-tab-btn ${selectedDayTab === 'weekday' ? 'active' : ''}`}
              onClick={() => setSelectedDayTab('weekday')}
            >
              Monday – Friday
            </button>
            <button
              type="button"
              className={`modal-tab-btn ${selectedDayTab === 'weekend' ? 'active' : ''}`}
              onClick={() => setSelectedDayTab('weekend')}
            >
              Saturday & Sunday
            </button>
          </div>

          <div className="modal-stop-tabs">
            <button
              type="button"
              className={`modal-stop-btn ${selectedStopTab === 'home' ? 'active' : ''}`}
              onClick={() => setSelectedStopTab('home')}
            >
              From Home (333 E 102nd)
            </button>
            <button
              type="button"
              className={`modal-stop-btn ${selectedStopTab === 'lex86' ? 'active' : ''}`}
              onClick={() => setSelectedStopTab('lex86')}
            >
              From 86th & Lex
            </button>
          </div>
        </div>

        <div className="modal-location-header">
          <strong>{stopDetails.name}</strong>
          <span>{stopDetails.address} {stopDetails.landmarkNote ? `(${stopDetails.landmarkNote})` : ''}</span>
        </div>

        {/* Timetable List */}
        <div className="modal-times-grid">
          {currentSchedule.departures.map((item, idx) => {
            const isHighlighted =
              selectedDayTab === currentDayType &&
              selectedStopTab === activeStopId &&
              item.timeStr === nextDepartureTimeStr;

            return (
              <div
                key={`${item.timeStr}-${idx}`}
                className={`timetable-slot ${isHighlighted ? 'highlighted-slot' : ''} ${item.isLastTrip ? 'last-trip-slot' : ''}`}
              >
                <span className="slot-time">{item.timeStr}</span>
                {item.isLastTrip && <span className="slot-badge">Last Trip</span>}
                {isHighlighted && <span className="slot-badge current-badge">Next Up</span>}
              </div>
            );
          })}
        </div>

        {/* Break info summary */}
        {currentSchedule.breaks.length > 0 && (
          <div className="modal-breaks-summary">
            <h4>Scheduled Driver Breaks</h4>
            <ul>
              {currentSchedule.breaks.map((b) => (
                <li key={b.name}>
                  <strong>{b.name}:</strong> Resumes service at {b.resumesAt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Holiday Policy Summary */}
        <div className="modal-breaks-summary modal-holidays-summary">
          <h4>Building Holiday Policies</h4>
          <div className="holiday-lists-grid">
            <div>
              <strong className="holiday-group-title">🛑 No Shuttle Service</strong>
              <ul className="holiday-list">
                <li>New Year's Day (Jan 1)</li>
                <li>Memorial Day (Last Mon in May)</li>
                <li>Independence Day (July 4)</li>
                <li>Labor Day (1st Mon in Sep)</li>
                <li>Thanksgiving Day (4th Thu in Nov)</li>
                <li>Christmas Day (Dec 25)</li>
              </ul>
            </div>
            <div>
              <strong className="holiday-group-title">🗓️ Runs on Weekend Schedule</strong>
              <ul className="holiday-list">
                <li>MLK Day (3rd Mon in Jan)</li>
                <li>Presidents' Day (3rd Mon in Feb)</li>
                <li>Juneteenth (June 19)</li>
                <li>Day After Thanksgiving</li>
                <li>Christmas Eve (Dec 24)</li>
                <li>New Year's Eve (Dec 31)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <p className="modal-policy-note">
            ⚠️ <strong>Notice:</strong> No exceptions to the bus route are permitted. Bus tags must be presented upon boarding.
          </p>
        </div>
      </div>
    </div>
  );
};
