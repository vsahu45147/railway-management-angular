import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RailwayService } from '../../services/railway.service';

@Component({
  selector: 'app-bookings',
  imports: [DatePipe, DecimalPipe, FormsModule, RouterLink],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class Bookings {
  private readonly railway = inject(RailwayService);
  readonly bookings = toSignal(this.railway.bookings$, { initialValue: [] });
  query = '';
  status = '';

  get filtered() {
    const q = this.query.trim().toLowerCase();
    return this.bookings().filter(b =>
      (!q || [b.pnr, b.trainNumber, b.trainName, b.source, b.destination].some(value => value.toLowerCase().includes(q))) &&
      (!this.status || b.status === this.status)
    );
  }

  cancel(id: number): void {
    if (confirm('Cancel this booking?')) this.railway.cancelBooking(id);
  }
}
