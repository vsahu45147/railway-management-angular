import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Booking, Station, Train } from '../models/railway.models';

@Injectable({ providedIn: 'root' })
export class RailwayService {
  private readonly trainKey = 'railway-trains';
  private readonly bookingKey = 'railway-bookings';

  private defaultTrains: Train[] = [
    {
      id: 1, number: '12801', name: 'Puri - New Delhi Purushottam SF',
      source: 'Bhubaneswar', destination: 'New Delhi', departure: '06:20', arrival: '12:35',
      duration: '30h 15m', classes: ['SL', '3A', '2A'], fare: 720, days: ['Mon', 'Wed', 'Fri'], seats: 126, status: 'Running'
    },
    {
      id: 2, number: '12864', name: 'SMVB Howrah SF Express',
      source: 'Bengaluru', destination: 'Bhubaneswar', departure: '10:15', arrival: '16:20',
      duration: '30h 05m', classes: ['SL', '3A', '2A', '1A'], fare: 845, days: ['Tue', 'Thu', 'Sat'], seats: 84, status: 'Running'
    },
    {
      id: 3, number: '12838', name: 'Puri Shatabdi Express',
      source: 'Puri', destination: 'Howrah', departure: '14:10', arrival: '20:15',
      duration: '6h 05m', classes: ['CC', 'EC'], fare: 590, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], seats: 72, status: 'Running'
    },
    {
      id: 4, number: '12073', name: 'Bhubaneswar Jan Shatabdi',
      source: 'Howrah', destination: 'Bhubaneswar', departure: '05:35', arrival: '13:50',
      duration: '8h 15m', classes: ['CC', '2S'], fare: 410, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], seats: 58, status: 'Delayed'
    },
    {
      id: 5, number: '18477', name: 'Kalinga Utkal Express',
      source: 'Puri', destination: 'Haridwar', departure: '20:45', arrival: '05:25',
      duration: '32h 40m', classes: ['SL', '3A', '2A'], fare: 775, days: ['Tue', 'Fri', 'Sun'], seats: 97, status: 'Running'
    },
    {
      id: 6, number: '12898', name: 'Bhubaneswar - Puducherry Express',
      source: 'Bhubaneswar', destination: 'Puducherry', departure: '23:40', arrival: '06:10',
      duration: '30h 30m', classes: ['SL', '3A', '2A'], fare: 805, days: ['Mon', 'Thu', 'Sat'], seats: 64, status: 'Running'
    }
  ];

  private readonly defaultStations: Station[] = [
    { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', platforms: 6, zone: 'East Coast' },
    { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', platforms: 5, zone: 'East Coast' },
    { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', platforms: 23, zone: 'Eastern' },
    { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', platforms: 16, zone: 'Northern' },
    { code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka', platforms: 10, zone: 'South Western' },
    { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', platforms: 6, zone: 'North Western' },
    { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', platforms: 17, zone: 'Southern' },
    { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana', platforms: 6, zone: 'South Central' }
  ];

  readonly trains$ = new BehaviorSubject<Train[]>(this.loadTrains());
  readonly bookings$ = new BehaviorSubject<Booking[]>(this.loadBookings());

  private loadTrains(): Train[] {
    const raw = localStorage.getItem(this.trainKey);
    if (!raw) {
      localStorage.setItem(this.trainKey, JSON.stringify(this.defaultTrains));
      return [...this.defaultTrains];
    }
    try { return JSON.parse(raw) as Train[]; } catch { return [...this.defaultTrains]; }
  }

  private loadBookings(): Booking[] {
    const raw = localStorage.getItem(this.bookingKey);
    if (!raw) return [];
    try { return JSON.parse(raw) as Booking[]; } catch { return []; }
  }

  get stations(): Station[] { return this.defaultStations; }

  getTrain(id: number): Train | undefined {
    return this.trains$.value.find(train => train.id === id);
  }

  searchTrains(source: string, destination: string, date: string, seatClass: string): Train[] {
    const s = source.trim().toLowerCase();
    const d = destination.trim().toLowerCase();
    const day = date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' }) : '';

    return this.trains$.value.filter(train =>
      (!s || train.source.toLowerCase().includes(s)) &&
      (!d || train.destination.toLowerCase().includes(d)) &&
      (!seatClass || train.classes.includes(seatClass)) &&
      (!day || train.days.includes(day)) &&
      train.status !== 'Cancelled'
    );
  }

  addTrain(train: Omit<Train, 'id'>): void {
    const nextId = Math.max(0, ...this.trains$.value.map(t => t.id)) + 1;
    const updated = [{ id: nextId, ...train }, ...this.trains$.value];
    this.saveTrains(updated);
  }

  deleteTrain(id: number): void {
    this.saveTrains(this.trains$.value.filter(train => train.id !== id));
  }

  bookTicket(input: Omit<Booking, 'id' | 'pnr' | 'bookingDate' | 'status'>): Booking {
    const booking: Booking = {
      ...input,
      id: Date.now(),
      pnr: this.generatePnr(),
      bookingDate: new Date().toISOString().slice(0, 10),
      status: 'Confirmed'
    };

    this.saveBookings([booking, ...this.bookings$.value]);

    const train = this.getTrain(input.trainId);
    if (train) {
      const remainingSeats = Math.max(0, train.seats - input.passengers.length);
      const updated = this.trains$.value.map(t => t.id === train.id ? { ...t, seats: remainingSeats } : t);
      this.saveTrains(updated);
    }

    return booking;
  }

  cancelBooking(id: number): void {
    const booking = this.bookings$.value.find(item => item.id === id);
    if (!booking || booking.status === 'Cancelled') return;

    const updatedBookings = this.bookings$.value.map(item =>
      item.id === id ? { ...item, status: 'Cancelled' as const } : item
    );
    this.saveBookings(updatedBookings);

    const train = this.getTrain(booking.trainId);
    if (train) {
      const updatedTrains = this.trains$.value.map(t =>
        t.id === train.id ? { ...t, seats: t.seats + booking.passengers.length } : t
      );
      this.saveTrains(updatedTrains);
    }
  }

  clearDemoData(): void {
    localStorage.removeItem(this.trainKey);
    localStorage.removeItem(this.bookingKey);
    this.trains$.next([...this.defaultTrains]);
    this.bookings$.next([]);
  }

  private saveTrains(trains: Train[]): void {
    localStorage.setItem(this.trainKey, JSON.stringify(trains));
    this.trains$.next(trains);
  }

  private saveBookings(bookings: Booking[]): void {
    localStorage.setItem(this.bookingKey, JSON.stringify(bookings));
    this.bookings$.next(bookings);
  }

  private generatePnr(): string {
    const stamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    return `${stamp}${random}`;
  }
}
