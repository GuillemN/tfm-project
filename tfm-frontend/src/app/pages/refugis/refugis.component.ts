import { Component, OnInit } from '@angular/core';
import { RefugisService, Refugi } from '../../services/refugis.service';
import { CommonModule } from '@angular/common';
import { CampFiltre } from '../../components/filtre/filtre-config';
import { FiltreComponent } from '../../components/filtre/filtre.component';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { RouterModule } from '@angular/router';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { ItemStatusBaseComponent } from '../../components/item-status-base/item-status-base.component';
import { CardComponent } from '../../components/card/card.component';
import { LoadingComponent } from '../../components/loading/loading.component';

@Component({
  standalone: true,
  selector: 'app-refugis',
  imports: [CommonModule, RouterModule, FiltreComponent, ImgUrlPipe, CardComponent, LoadingComponent],
  templateUrl: './refugis.component.html',
  styleUrls: ['./refugis.component.scss'],
})
export class RefugisComponent extends ItemStatusBaseComponent implements OnInit {
  refugis: Refugi[] = [];
  refugisOriginals: Refugi[] = [];

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
    { clau: 'altura', etiqueta: 'Altitud mínima', tipus: 'number' },
    {
      clau: 'lliure',
      etiqueta: 'Disponibilitat',
      tipus: 'checkbox',
      opcions: ['Lliure', 'Guardat']
    },
  ];

  hoveredRefugi: number | null = null;
  isLoading: boolean = true;

  constructor(
    private refugisService: RefugisService,
    userItemStatusService: UserItemStatusService
  ) {
    super(userItemStatusService);
  }

  ngOnInit(): void {
    // Carreguem els refugis
    this.refugisService.getRefugis().subscribe({
      next: (data) => {
        this.refugisOriginals = data;
        this.refugis = [...data];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  aplicarFiltre(filtres: any) {
    this.refugis = this.refugisOriginals.filter((refugi) => {
      // Filtre per parròquia
      if (filtres.parroquia && refugi.parroquies !== filtres.parroquia) {
        return false;
      }

      // Filtre per altura mínima
      if (filtres.altura && refugi.Altura < +filtres.altura) {
        return false;
      }

      // Filtre lliure
      if (
        Array.isArray(filtres.lliure) &&
        filtres.lliure.length > 0 &&
        !filtres.lliure.includes(+refugi.lliure)
      ) {
        return false;
      }

      return true;
    });
  }
}
