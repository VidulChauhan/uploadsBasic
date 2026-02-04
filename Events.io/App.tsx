
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UnifiedDashboard from './components/Dashboard';
import { User, EventData, EventStatus } from './types';
import { STORAGE_KEYS, SYNC_INTERVAL_MS } from './constants';
import { scrapeEvents } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeCity, setActiveCity] = useState('Sydney');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Track current city in a ref for the interval closure
  const cityRef = useRef(activeCity);
  useEffect(() => { cityRef.current = activeCity; }, [activeCity]);

  // Initialize Auth & Theme
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedEvents) setEvents(JSON.parse(storedEvents));
    
    const initialTheme = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(initialTheme);
    if (initialTheme) document.documentElement.classList.add('dark');
    
    setLoading(false);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  // Automated Scraper Sync Logic
  const runSync = useCallback(async (targetCity?: string) => {
    const cityToScrape = targetCity || cityRef.current;
    console.log(`[Sync Engine] Starting sync for ${cityToScrape}...`);
    setIsSyncing(true);
    
    try {
      const scraped = await scrapeEvents(cityToScrape);
      if (scraped.length === 0) {
        console.warn(`[Sync Engine] No events found for ${cityToScrape}`);
        setIsSyncing(false);
        return;
      }

      setEvents(prev => {
        const existing = [...prev];
        const newItems: EventData[] = [];
        const seenInScrape = new Set<string>();

        scraped.forEach(item => {
          // Use originalUrl as a unique identifier for events across scrapes
          const idx = existing.findIndex(e => e.originalUrl === item.originalUrl);
          seenInScrape.add(item.originalUrl);

          if (idx > -1) {
            const old = existing[idx];
            // Check if core details changed to mark as UPDATED
            const hasChanged = old.dateTime !== item.dateTime || 
                               old.venueName !== item.venueName || 
                               old.title !== item.title;

            existing[idx] = { 
              ...old, 
              ...item, 
              id: old.id, // preserve original ID
              status: hasChanged 
                ? (old.status === EventStatus.IMPORTED ? EventStatus.IMPORTED : EventStatus.UPDATED) 
                : old.status,
              lastScrapedAt: new Date().toISOString()
            };
          } else {
            newItems.push(item);
          }
        });

        // Mark missing events for the current city as INACTIVE
        const final = existing.map(e => {
          if (e.city === cityToScrape && !seenInScrape.has(e.originalUrl)) {
            // Only mark as inactive if it was previously NEW or UPDATED (not imported)
            return (e.status === EventStatus.NEW || e.status === EventStatus.UPDATED) 
              ? { ...e, status: EventStatus.INACTIVE } 
              : e;
          }
          return e;
        });

        const result = [...newItems, ...final];
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(result));
        console.log(`[Sync Engine] Completed. Found ${newItems.length} new, Updated existing.`);
        return result;
      });
    } catch (err) {
      console.error("[Sync Engine Error]:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Set up 5-minute interval for the current city
  useEffect(() => {
    if (user) {
      runSync(activeCity);
      const interval = setInterval(() => {
        runSync(cityRef.current);
      }, SYNC_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, [user, runSync]); // Note: interval depends on user state

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <UnifiedDashboard 
                user={user} 
                events={events} 
                setEvents={setEvents}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                runManualSync={runSync}
                isSyncing={isSyncing}
                activeCity={activeCity}
                setActiveCity={setActiveCity}
              />
            ) : <Navigate to="/login" />
          } 
        />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
