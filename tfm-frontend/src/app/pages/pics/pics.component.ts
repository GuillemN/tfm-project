import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampFiltre } from '../../components/filtre/filtre-config';
import { FiltreComponent } from '../../components/filtre/filtre.component';
import { RouterModule } from '@angular/router';
import { PicsService, Pic } from '../../services/pics.service';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { ItemStatusBaseComponent } from '../../components/item-status-base/item-status-base.component';
import { CardComponent } from '../../components/card/card.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  standalone: true,
  selector: 'app-pics',
  imports: [CommonModule, FiltreComponent, RouterModule, ImgUrlPipe, CardComponent, LoadingComponent],
  templateUrl: './pics.component.html',
  styleUrls: ['./pics.component.scss'],
})
export class PicsComponent extends ItemStatusBaseComponent implements OnInit {
  pics: Pic[] = [];
  picsOriginals: Pic[] = [];

  hoveredPic: number | null = null;

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
      clau: 'alçada',
      etiqueta: 'Altitud mínima',
      tipus: 'number',
    }
  ];


  isLoading: boolean = true;

  constructor(
    private picsService: PicsService,
    userItemStatusService: UserItemStatusService
  ) {
    super(userItemStatusService);
  }

  ngOnInit(): void {
    this.picsService.getPics().subscribe({
      next: (data) => {
        this.picsOriginals = data;
        this.pics = [...data];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  aplicarFiltre(filtres: any) {
    this.pics = this.picsOriginals.filter((pic) => {
      if (filtres.alçada && pic.altitud < +filtres.alçada) {
        return false;
      }

      if (filtres.parroquia && pic.parroquia !== filtres.parroquia) {
        return false;
      }

      return true;
    });
  }
}
