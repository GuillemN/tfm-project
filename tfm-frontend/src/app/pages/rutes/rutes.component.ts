import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RutesService, Ruta } from '../../services/rutes.service';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { CampFiltre } from '../../components/filtre/filtre-config';
import { FiltreComponent } from '../../components/filtre/filtre.component';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { ItemStatusBaseComponent } from '../../components/item-status-base/item-status-base.component';
import { CardComponent } from '../../components/card/card.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  standalone: true,
  selector: 'app-rutes',
  imports: [CommonModule, RouterModule, FiltreComponent, ImgUrlPipe, CardComponent, LoadingComponent],
  templateUrl: './rutes.component.html',
  styleUrls: ['./rutes.component.scss'],
})
export class RutesComponent extends ItemStatusBaseComponent implements OnInit {
  rutes: Ruta[] = [];
  rutesOriginals: Ruta[] = [];
  hoveredRuta: number | null = null;
  isLoading: boolean = true;

  filtreCamps: CampFiltre[] = [
    { clau: 'desnivell', etiqueta: 'Desnivell mínim (m)', tipus: 'number' },
    { clau: 'distancia', etiqueta: 'Distància mínima (km)', tipus: 'number' },
    {
      clau: 'dificultat',
      etiqueta: 'Dificultat',
      tipus: 'select',
      opcions: ['Fàcil', 'Moderada', 'Difícil']
    }
  ];

  constructor(
    private rutesService: RutesService,
    userItemStatusService: UserItemStatusService
  ) {
    super(userItemStatusService);
  }

  ngOnInit(): void {
    // Carrega totes les rutes
    this.rutesService.getRutes().subscribe({
      next: (data) => {
        this.rutesOriginals = data;
        this.rutes = [...data];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  aplicarFiltre(filtres: any) {
    this.rutes = this.rutesOriginals.filter((ruta) => {
      if (filtres.desnivell && ruta.desnivell < +filtres.desnivell) return false;
      if (filtres.distancia && ruta.distancia_km < +filtres.distancia) return false;
      if (filtres.dificultat && ruta.dificultat !== filtres.dificultat) return false;
      return true;
    });
  }
}
