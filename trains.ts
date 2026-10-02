import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Train } from '../../models/railway.models';
import { RailwayService } from '../../services/railway.service';

@Component({
  selector: 'app-trains',
  imports: [FormsModule, RouterLink],
  templateUrl: './trains.html',
  styleUrl: './trains.scss'
})
export class Trains {
  private readonly railway = inject(RailwayService);
  readonly trains = this.railway.trains$;
  showForm = false;
  search = { source: '', destination: '', date: '', seatClass: '' };
  message = '';

  form = {
    number: '', name: '', source: '', destination: '', departure: '', arrival: '', duration: '',
    fare: 0, seats: 50, classesText: 'SL, 3A', daysText: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun', status: 'Running' as const
  };

  get filtered(): Train[] { return this.applyFilters(this.trains.value); }

  applyFilters(source: Train[] = this.trains.value): Train[] {
    const s = this.search.source.trim().toLowerCase();
    const d = this.search.destination.trim().toLowerCase();
    const day = this.search.date ? new Date(`${this.search.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' }) : '';
    return source.filter(t =>
      (!s || t.source.toLowerCase().includes(s)) &&
      (!d || t.destination.toLowerCase().includes(d)) &&
      (!this.search.seatClass || t.classes.includes(this.search.seatClass)) &&
      (!day || t.days.includes(day)) && t.status !== 'Cancelled'
    );
  }

  searchTrains(): void { /* getter recomputes the result */ }

  reset(): void {
    this.search = { source: '', destination: '', date: '', seatClass: '' };
  }

  addTrain(): void {
    if (!this.form.number || !this.form.name || !this.form.source || !this.form.destination || !this.form.departure || !this.form.arrival) {
      this.message = 'Please complete the required train fields.';
      return;
    }
    this.railway.addTrain({
      number: this.form.number,
      name: this.form.name,
      source: this.form.source,
      destination: this.form.destination,
      departure: this.form.departure,
      arrival: this.form.arrival,
      duration: this.form.duration || '—',
      fare: Number(this.form.fare),
      seats: Number(this.form.seats),
      classes: this.form.classesText.split(',').map(x => x.trim()).filter(Boolean),
      days: this.form.daysText.split(',').map(x => x.trim()).filter(Boolean),
      status: this.form.status
    });
    this.showForm = false;
    this.message = 'Train added successfully.';
    this.form = { number:'',name:'',source:'',destination:'',departure:'',arrival:'',duration:'',fare:0,seats:50,classesText:'SL, 3A',daysText:'Mon, Tue, Wed, Thu, Fri, Sat, Sun',status:'Running' };
  }

  deleteTrain(id: number): void {
    if (confirm('Delete this train from the demo system?')) {
      this.railway.deleteTrain(id);
      this.message = 'Train deleted.';
    }
  }
}
