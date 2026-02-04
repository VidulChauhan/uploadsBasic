
import React, { useState, useMemo } from 'react';
import { EventData, EventStatus, User } from '../types';
import { CITIES } from '../constants';

interface DashboardProps {
  user: User;
  events: EventData[];
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  runManualSync: (city: string) => Promise<void>;
  isSyncing: boolean;
  activeCity: string;
  setActiveCity: (city: string) => void;
}

const UnifiedDashboard: React.FC<DashboardProps> = ({
  user, events, setEvents, onLogout, isDarkMode, toggleDarkMode,
  runManualSync, isSyncing, activeCity, setActiveCity
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredEvents = useMemo(() => {
    let result = events.filter(e => e.city === activeCity);
    
    // Status Filter
    if (filter !== 'all') {
      result = result.filter(e => e.status === filter);
    }

    // Time Filter logic
    if (timeFilter !== 'all') {
      const now = new Date();
      const limitDate = new Date();
      
      if (timeFilter === '3m') limitDate.setMonth(now.getMonth() + 3);
      else if (timeFilter === '6m') limitDate.setMonth(now.getMonth() + 6);
      else if (timeFilter === '12m') limitDate.setMonth(now.getMonth() + 12);

      result = result.filter(e => {
        const eDate = new Date(e.isoDate);
        // Include events that are happening between now and the selected limit
        return eDate >= now && eDate <= limitDate;
      });
    }

    return result.sort((a, b) => new Date(b.lastScrapedAt).getTime() - new Date(a.lastScrapedAt).getTime());
  }, [events, activeCity, filter, timeFilter]);

  const timeOptions = [
    { label: 'All Upcoming', value: 'all' },
    { label: 'Next 3 Months', value: '3m' },
    { label: 'Next 6 Months', value: '6m' },
    { label: 'Next 12 Months', value: '12m' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-deep font-sans overflow-hidden transition-colors duration-500">
      {/* Sidebar - Integrated Flex Layout */}
      <aside 
        className={`
          flex-shrink-0 z-[60] lg:relative fixed inset-y-0 left-0 apple-glass border-r border-slate-200 dark:border-white/10 
          transition-all duration-500 ease-in-out overflow-hidden
          ${sidebarOpen ? 'w-72 opacity-100 shadow-2xl lg:shadow-none' : 'w-0 opacity-0 border-transparent'}
        `}
      >
        <div className="flex flex-col h-full p-6 w-72 relative">
          {/* Internal Hide Sidebar Button (Inside Sidebar) */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-brand-600 transition-colors lg:hidden"
            title="Hide Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-10 px-2 shrink-0">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight dark:text-white whitespace-nowrap">Events Hub</span>
          </div>

          {/* Navigation */}
          <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-grow pb-8">
            {/* Location Section */}
            <section>
              <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 whitespace-nowrap">Locations</p>
              <div className="space-y-1">
                {CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${activeCity === city ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20 translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                  >
                    <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {city}
                  </button>
                ))}
              </div>
            </section>

            {/* Time Filter Section */}
            <section>
              <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 whitespace-nowrap">Time Horizon</p>
              <div className="space-y-1">
                {timeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setTimeFilter(option.value)}
                    className={`w-full flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${timeFilter === option.value ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                  >
                    <svg className="w-4 h-4 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {option.label}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Sidebar Actions */}
          <div className="mt-auto space-y-4 shrink-0 pt-6 border-t border-slate-100 dark:border-white/5">
            {/* Sync Button */}
            <button 
              onClick={() => runManualSync(activeCity)}
              disabled={isSyncing}
              className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 font-bold text-sm transition-all active:scale-95 whitespace-nowrap ${isSyncing ? 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed' : 'bg-brand-600 text-white hover:shadow-2xl hover:shadow-brand-500/30 hover:-translate-y-0.5'}`}
            >
              {isSyncing ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
              <span>{isSyncing ? 'Syncing...' : 'Force Sync AI'}</span>
            </button>

            {/* Dark Mode & User Profile */}
            <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-3xl space-y-4">
              <button 
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between px-2 py-1 text-slate-600 dark:text-slate-400 transition hover:text-brand-600"
              >
                <span className="text-xs font-bold uppercase tracking-wider">Appearance</span>
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                )}
              </button>
              
              <div className="flex items-center space-x-3 border-t border-slate-200 dark:border-white/10 pt-4">
                <img src={user.picture} alt="" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-bold dark:text-white truncate">{user.name}</p>
                  <button onClick={onLogout} className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:opacity-70 transition">Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 apple-glass border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-6 min-w-0 overflow-hidden">
            {/* Toggle Button: Always visible if sidebar is closed, or just for opening */}
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-400 hover:scale-105 transition active:scale-95 shadow-sm shrink-0"
                title="Show Sidebar"
              >
                <svg className="w-5 h-5 transition-transform duration-500 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Also show a small toggle in the header for desktop convenience even when open */}
            {sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="hidden lg:flex p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-slate-400 hover:scale-105 transition active:scale-95 shadow-sm shrink-0"
                title="Hide Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}

            <h2 className="text-2xl font-black tracking-tight dark:text-white truncate">
              {activeCity} <span className="text-slate-400 dark:text-slate-500 font-medium">Discovery</span>
            </h2>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-200/50 dark:bg-white/10 p-1 rounded-xl flex">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-800'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Feed */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              {['all', EventStatus.NEW, EventStatus.UPDATED, EventStatus.INACTIVE].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/30' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-brand-500 hover:bg-slate-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Events Content */}
            {filteredEvents.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-4"}>
                {filteredEvents.map(event => (
                  <div key={event.id} className={`group bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col flex-grow'}`}>
                    <div className={`${viewMode === 'list' ? 'w-48 h-32 rounded-2xl flex-shrink-0' : 'h-64 w-full'} overflow-hidden relative`}>
                      <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-black uppercase text-brand-700 rounded-lg shadow-sm">{event.category}</span>
                        {event.status === EventStatus.NEW && <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded-lg shadow-sm">New</span>}
                        {event.status === EventStatus.UPDATED && <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase rounded-lg shadow-sm">Updated</span>}
                      </div>
                    </div>
                    
                    <div className={`p-8 ${viewMode === 'list' ? 'flex-grow flex justify-between items-center py-2' : 'flex flex-col flex-grow'}`}>
                      <div>
                        <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-1">{event.dateTime}</p>
                        <h3 className="text-xl font-bold dark:text-white mb-2 leading-tight group-hover:text-brand-500 transition-colors line-clamp-2">{event.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          {event.venueName}
                        </p>
                      </div>

                      <div className={`flex items-center justify-between ${viewMode === 'list' ? 'ml-8 min-w-[150px]' : 'mt-auto pt-6 border-t border-slate-100 dark:border-white/5'}`}>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Source</span>
                          <span className="text-xs font-semibold dark:text-white opacity-60 truncate max-w-[120px]">{event.sourceWebsite}</span>
                        </div>
                        
                        <a 
                          href={event.originalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-slate-100 dark:bg-white/5 dark:text-white text-slate-900 text-[10px] font-black uppercase rounded-xl hover:bg-brand-600 hover:text-white transition-all active:scale-95"
                        >
                          Details
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 bg-slate-200 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold dark:text-white mb-2">No events matching criteria</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Try changing your filters or click "Force Sync AI" to discover more upcoming events.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UnifiedDashboard;
