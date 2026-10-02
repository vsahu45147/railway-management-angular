import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RailwayService } from '../../services/railway.service';

@Component({
  selector: 'app-stations',
  imports: [FormsModule],
  templateUrl: './stations.html',
  styleUrl: './stations.scss'
})
export class Stations {
  private readonly railway = inject(RailwayService);
  query = '';

  get filtered() {
    const q = this.query.trim().toLowerCase();
    return this.railway.stations.filter(s =>
      !q || [s.code, s.name, s.city, s.state, s.zone].some(v => v.toLowerCase().includes(q))
    );
  }
}
