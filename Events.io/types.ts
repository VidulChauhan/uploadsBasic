
export enum EventStatus {
  NEW = 'new',
  UPDATED = 'updated',
  INACTIVE = 'inactive',
  IMPORTED = 'imported'
}

export interface EventData {
  id: string;
  title: string;
  dateTime: string;
  isoDate: string;
  venueName: string;
  address: string;
  city: string;
  description: string;
  category: string;
  imageUrl: string;
  sourceWebsite: string;
  originalUrl: string;
  lastScrapedAt: string;
  status: EventStatus;
  importedAt?: string;
  importedBy?: string;
  importNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface TicketLead {
  email: string;
  consent: boolean;
  eventId: string;
  timestamp: string;
}
