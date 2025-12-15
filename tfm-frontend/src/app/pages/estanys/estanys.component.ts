
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltreComponent } from '../../components/filtre/filtre.component';
import { CampFiltre } from '../../components/filtre/filtre-config';
import { EstanysService, Estany } from '../../services/estanys.service';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { RouterModule } from '@angular/router';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { ItemStatusBaseComponent } from '../../components/item-status-base/item-status-base.component';
import { CardComponent } from '../../components/card/card.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  selector: 'app-estanys',
  standalone: true,
  imports: [CommonModule, RouterModule, FiltreComponent, ImgUrlPipe, CardComponent, LoadingComponent],
  templateUrl: './estanys.component.html',
  styleUrls: ['./estanys.component.scss']
})
export class EstanysComponent extends ItemStatusBaseComponent implements OnInit {
  estanys: Estany[] = [];
  estanysOriginals: Estany[] = [];
  filtreCamps: CampFiltre[] = [
    {
      clau: 'parroquia',
      etiqueta: 'Parròquia',
      tipus: 'select',
      opcions: [
        'Canillo', 'Encamp', 'Ordino', 'La Massana',
        'Andorra la Vella', 'Sant Julià de Lòria', 'Escaldes-Engordany'
      ]
    },
    { clau: 'altitud', etiqueta: 'Altitud mínima', tipus: 'number' }
  ];
  hoveredEstany: number | null = null;
  rutes: any;
  isLoading: boolean = true;

  constructor(
    private estanysService: EstanysService,
    userItemStatusService: UserItemStatusService
  ) {
    super(userItemStatusService);
  }

  ngOnInit(): void {
    this.estanysService.getEstanys().subscribe({
      next: (data) => {
        this.estanysOriginals = data;
        this.estanys = [...data];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  aplicarFiltre(filtres: any) {
    this.estanys = this.estanysOriginals.filter((estany) => {
      if (filtres.parroquia && estany.parroquia !== filtres.parroquia) return false;
      if (filtres.altitud && estany.altitud < +filtres.altitud) return false;
      return true;
    });
  }
}
