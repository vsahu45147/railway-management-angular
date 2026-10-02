import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Passenger, Train } from '../../models/railway.models';
import { RailwayService } from '../../services/railway.service';

@Component({
  selector: 'app-booking',
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class Booking {
  private readonly railway = inject(RailwayService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  train?: Train;
  journeyDate = '';
  passengers: Passenger[] = [this.blankPassenger()];
  message = '';
  submitted = false;
  pnr = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.train = this.railway.getTrain(id);
  }

  blankPassenger(): Passenger { return { name: '', age: 18, gender: 'Male', seatClass: 'SL' }; }

  addPassenger(): void {
    if (this.passengers.length < 6) this.passengers.push(this.blankPassenger());
  }

  removePassenger(index: number): void {
    if (this.passengers.length > 1) this.passengers.splice(index, 1);
  }

  get totalFare(): number {
    const classMultiplier: Record<string, number> = { '1A': 2.6, '2A': 1.8, '3A': 1.35, 'SL': 1, 'CC': 1.1, 'EC': 1.75, '2S': .65 };
    return this.passengers.reduce((sum, passenger) => sum + (this.train?.fare ?? 0) * (classMultiplier[passenger.seatClass] ?? 1), 0);
  }

  submit(): void {
    if (!this.train) return;
    this.message = '';
    if (!this.journeyDate) { this.message = 'Please select a journey date.'; return; }
    if (this.journeyDate < new Date().toISOString().slice(0,10)) { this.message = 'Journey date cannot be in the past.'; return; }
    if (this.passengers.some(p => !p.name.trim() || p.age < 1 || p.age > 120)) { this.message = 'Enter valid passenger names and ages.'; return; }
    if (this.passengers.length > this.train.seats) { this.message = 'Not enough seats are available on this train.'; return; }

    const booking = this.railway.bookTicket({
      trainId: this.train.id,
      trainNumber: this.train.number,
      trainName: this.train.name,
      source: this.train.source,
      destination: this.train.destination,
      journeyDate: this.journeyDate,
      passengers: this.passengers.map(p => ({ ...p })),
      totalFare: this.totalFare
    });
    this.pnr = booking.pnr;
    this.submitted = true;
  }

  backToTrains(): void { this.router.navigateByUrl('/trains'); }
}
