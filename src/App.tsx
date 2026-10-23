import { useEffect, useState } from 'react';
import './App.css';
import { FullScheduleModal } from './components/FullScheduleModal';
import { Header } from './components/Header';
import { NextShuttleHero } from './components/NextShuttleHero';
import { OriginSelector } from './components/OriginSelector';
import { UpcomingList } from './components/UpcomingList';
import { STOPS } from './data/schedule';
import { StopId } from './types';
import { getNextShuttleDepartures } from './utils/timeUtils';

export function App() {
  // Always default to Home (333 E 102nd St) per user preference
  const [selectedStop, setSelectedStop] = useState<StopId>('home');
  const [now, setNow] = useState<Date>(() => new Date());
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Live timer ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Compute live departure status for the selected stop
  const departureInfo = getNextShuttleDepartures(selectedStop, now);
  const stopDetails = STOPS[selectedStop];

  return (
    <div className="app-container">
      <div className="app-card">
        <Header
          currentDayName={departureInfo.currentDayName}
          currentDayType={departureInfo.currentDayType}
          currentTimeStr={departureInfo.currentTimeStr}
          onOpenFullSchedule={() => setIsScheduleOpen(true)}
        />

        <main className="app-main">
          <OriginSelector
            selectedStop={selectedStop}
            onSelectStop={setSelectedStop}
          />

          <NextShuttleHero
            departureInfo={departureInfo}
            stopDetails={stopDetails}
          />

          <UpcomingList
            departureInfo={departureInfo}
          />
        </main>

        <footer className="app-footer">
          <div className="footer-links">
            <button
              type="button"
              className="text-link-btn"
              onClick={() => setIsScheduleOpen(true)}
            >
              📅 View Full Weekday & Weekend Schedule
            </button>
          </div>
          <p className="footer-credits">
            Glenwood Hampton Court Shuttle • 333 E 102nd St ↔ 86th & Lex
          </p>
        </footer>
      </div>

      <FullScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        activeStopId={selectedStop}
        currentDayType={departureInfo.currentDayType}
        nextDepartureTimeStr={departureInfo.nextDeparture.timeStr}
      />
    </div>
  );
}

export default App;
