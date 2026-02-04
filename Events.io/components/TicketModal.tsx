
import React, { useState } from 'react';
import { EventData, TicketLead } from '../types';
import { STORAGE_KEYS } from '../constants';

interface TicketModalProps {
  event: EventData;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ event, onClose }) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setSubmitting(true);
    
    // Save lead
    const newLead: TicketLead = {
      email,
      consent,
      eventId: event.id,
      timestamp: new Date().toISOString()
    };
    
    const existingLeads: TicketLead[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify([...existingLeads, newLead]));

    // Redirect
    setTimeout(() => {
      window.open(event.originalUrl, '_blank');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold leading-6 text-slate-900">Get Tickets</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              You're almost there! Enter your email to receive a copy of your ticket link and stay updated on similar events for <span className="font-semibold text-slate-900">{event.title}</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="consent" className="text-slate-500">
                    I agree to receive event reminders and marketing emails. 
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Redirecting...
                  </>
                ) : 'Continue to Tickets'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
