
import React from 'react';
import { EventData } from '../types';

interface EventCardProps {
  event: EventData;
  onGetTickets: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onGetTickets }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-indigo-700 rounded-full shadow-sm">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            {event.dateTime}
          </p>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {event.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {event.venueName}
          </p>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow">
          {event.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-400">
            via {event.sourceWebsite}
          </span>
          <button 
            onClick={onGetTickets}
            className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors shadow-sm"
          >
            GET TICKETS
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
