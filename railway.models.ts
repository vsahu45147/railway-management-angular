export interface Train {
  id: number;
  number: string;
  name: string;
  source: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: string[];
  fare: number;
  days: string[];
  seats: number;
  status: 'Running' | 'Delayed' | 'Cancelled';
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatClass: string;
}

export interface Booking {
  id: number;
  pnr: string;
  trainId: number;
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  journeyDate: string;
  passengers: Passenger[];
  totalFare: number;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
}

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  platforms: number;
  zone: string;
}
