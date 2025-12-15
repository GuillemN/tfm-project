import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampFiltre } from '../../components/filtre/filtre-config';
import { FiltreComponent } from '../../components/filtre/filtre.component';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { RouterModule } from '@angular/router';
import { ViesFerradesService, ViaFerrada } from '../../services/vies-ferrades.service';
import { ItemStatusBaseComponent } from '../../components/item-status-base/item-status-base.component';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { CardComponent } from '../../components/card/card.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  standalone: true,
  selector: 'app-vies-ferrades',
  imports: [CommonModule, FiltreComponent, RouterModule, ImgUrlPipe, CardComponent, LoadingComponent],
  templateUrl: './vies-ferrades.component.html',
  styleUrls: ['./vies-ferrades.component.scss'],
})
export class ViesFerradesComponent extends ItemStatusBaseComponent implements OnInit {
  viesFerrades: ViaFerrada[] = [];
  viesOriginals: ViaFerrada[] = [];
  filtreCamps: CampFiltre[] = [
    {
      clau: 'parroquia',
      etiqueta: 'Parròquia',
      tipus: 'select',
      opcions: [
        'Canillo',
        'Encamp',
        'Ordino',
        'La Massana',
        'Andorra la Vella',
        'Sant Julià de Lòria',
        'Escaldes-Engordany',
      ],
    },
    {
      clau: 'dificultat',
      etiqueta: 'Dificultat',
      tipus: 'select',
      opcions: [
        'K1',
        'K2',
        'K3',
        'K4',
      ],
    },
  ];
  hoveredVia: number | null = null;
  isLoading: boolean = true;

  constructor(
    private viesFerradesService: ViesFerradesService,
    userItemStatusService: UserItemStatusService
  ) {
    super(userItemStatusService);
  }

  ngOnInit(): void {
    this.viesFerradesService.getViesFerrades().subscribe({
      next: (data) => {
        this.viesOriginals = data;
        this.viesFerrades = [...data];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  aplicarFiltre(filtres: any) {
    this.viesFerrades = this.viesOriginals.filter((via) => {
      if (filtres.parroquia && via.Parroquia !== filtres.parroquia) {
        return false;
      }
      if (filtres.dificultat && !via.dificultat.toLowerCase().includes(filtres.dificultat.toLowerCase())) {
        return false;
      }
      return true;
    });
  }
}
