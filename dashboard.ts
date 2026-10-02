import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RailwayService } from '../../services/railway.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private readonly railway = inject(RailwayService);
  private readonly router = inject(Router);

  trains = toSignal(this.railway.trains$, { initialValue: [] });
  bookings = toSignal(this.railway.bookings$, { initialValue: [] });

  readonly quickSearch = {
    source: '',
    destination: '',
    date: '',
    seatClass: ''
  };

  searchTrains(): void { this.router.navigate(['/trains'], { queryParams: this.quickSearch }); }

  stats = () => [
    { icon: '🚆', value: this.trains().length, label: 'Active Trains', tone: 'blue' },
    { icon: '🎫', value: this.bookings().filter(b => b.status === 'Confirmed').length, label: 'Confirmed Bookings', tone: 'green' },
    { icon: '⌖', value: this.railway.stations.length, label: 'Stations', tone: 'purple' },
    { icon: '🪑', value: this.trains().reduce((sum, t) => sum + t.seats, 0), label: 'Available Seats', tone: 'orange' }
  ];
}
