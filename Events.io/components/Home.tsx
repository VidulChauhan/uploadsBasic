
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EventData, EventStatus } from '../types';
import { STORAGE_KEYS } from '../constants';
import EventCard from './EventCard';
import TicketModal from './TicketModal';

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (stored) {
      const allEvents: EventData[] = JSON.parse(stored);
      // Public ONLY sees IMPORTED events
      const displayable = allEvents.filter(e => e.status === EventStatus.IMPORTED);
      setEvents(displayable);
    }
  }, []);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Sydney Events Hub</h1>
          <p className="mt-2 text-slate-600 text-lg">Curated experiences in Australia's harbor city.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search verified events..." 
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-3.5 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onGetTickets={() => setSelectedEvent(event)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No events published yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            The platform is in curation mode. Admins need to import events from the dashboard to display them here.
          </p>
          <div className="mt-6">
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Go to Admin Dashboard →</Link>
          </div>
        </div>
      )}

      {selectedEvent && (
        <TicketModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

export default Home;
