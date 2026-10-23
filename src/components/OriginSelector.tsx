import React from 'react';
import { STOPS } from '../data/schedule';
import { StopId } from '../types';

interface OriginSelectorProps {
  selectedStop: StopId;
  onSelectStop: (stop: StopId) => void;
}

export const OriginSelector: React.FC<OriginSelectorProps> = ({
  selectedStop,
  onSelectStop,
}) => {
  const toggleStop = () => {
    onSelectStop(selectedStop === 'home' ? 'lex86' : 'home');
  };

  const currentStopDetails = STOPS[selectedStop];

  return (
    <div className="origin-selector-container">
      <div className="selector-label-row">
        <span className="selector-label">DEPARTING FROM</span>
        <button
          type="button"
          className="swap-button"
          onClick={toggleStop}
          title="Switch departure stop"
          aria-label="Switch departure stop"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1 4 4H3" />
          </svg>
          <span>Switch</span>
        </button>
      </div>

      <div className="stop-toggle-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedStop === 'home'}
          className={`stop-tab ${selectedStop === 'home' ? 'active' : ''}`}
          onClick={() => onSelectStop('home')}
        >
          <span className="tab-icon">🏠</span>
          <span className="tab-text">
            <strong>Home</strong>
            <small>333 E 102nd St</small>
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selectedStop === 'lex86'}
          className={`stop-tab ${selectedStop === 'lex86' ? 'active' : ''}`}
          onClick={() => onSelectStop('lex86')}
        >
          <span className="tab-icon">🚇</span>
          <span className="tab-text">
            <strong>86th & Lex</strong>
            <small>in front of H&M</small>
          </span>
        </button>
      </div>

      <div className="stop-location-banner">
        <div className="location-pin" aria-hidden="true">📍</div>
        <div className="location-info">
          <div className="location-address">{currentStopDetails.address}</div>
          {currentStopDetails.landmarkNote && (
            <div className="location-landmark">{currentStopDetails.landmarkNote}</div>
          )}
        </div>
      </div>
    </div>
  );
};
