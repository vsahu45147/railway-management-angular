import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Trains } from './pages/trains/trains';
import { Booking } from './pages/booking/booking';
import { Bookings } from './pages/bookings/bookings';
import { Stations } from './pages/stations/stations';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'trains', component: Trains },
  { path: 'book/:id', component: Booking },
  { path: 'bookings', component: Bookings },
  { path: 'stations', component: Stations },
  { path: '**', redirectTo: '' }
];
