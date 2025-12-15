import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RutesService, Ruta } from '../../services/rutes.service';
import { RefugiMapComponent } from '../refugi-map/refugi-map.component';
import { MeteoService } from '../../services/meteo.service';
import { RouterModule } from '@angular/router';
import { UserItemStatusService, UserItemStatus } from '../../services/user-item-status.service';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';

@Component({
  standalone: true,
  selector: 'app-ruta-detall',
  imports: [CommonModule, RefugiMapComponent, RouterModule, ImgUrlPipe],
  templateUrl: './ruta-detall.component.html',
  styleUrls: ['./ruta-detall.component.scss']
})
export class RutaDetallComponent implements OnInit {
  ruta!: Ruta;
  previsio: PrevisioHora[] = [];
  previsioFiltrada: PrevisioHora[] = [];
  puntsRuta: any[] = [];
  userStatuses: UserItemStatus[] = [];
  hoveredPuntId: number | null = null;

  @ViewChild('carrusel') carruselRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private rutesService: RutesService,
    private meteoService: MeteoService,
    private userItemStatusService: UserItemStatusService

  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.userItemStatusService.getUserStatuses().subscribe((statuses) => {
      this.userStatuses = statuses;
    });

    if (id) {
      this.rutesService.getRutaById(+id).subscribe({
        next: (data) => {
          this.ruta = data;

          const [lat, lon] = this.ruta.coordenades.split(',').map(Number);
          this.meteoService.getForecast(lat, lon).subscribe({
            next: (resposta) => {
              this.previsio = resposta.previsio;
              this.previsioFiltrada = this.filtrarMatinsITardes(this.previsio);
            },
            error: (err) => console.error('Error previsió:', err)
          });

          this.rutesService.getPuntsRuta(+id).subscribe({
            next: (punts) => {
              this.puntsRuta = punts;
            },
            error: (err) => console.error('Error carregant punts de ruta:', err)
          });
        },
        error: (err) => console.error('Error carregant ruta:', err),
      });
    }
  }

  filtrarMatinsITardes(data: PrevisioHora[]): PrevisioHora[] {
    const perDia: { [data: string]: PrevisioHora[] } = {};
    for (const entrada of data) {
      if (!entrada.data.includes(' ')) continue;
      const [dia] = entrada.data.split(' ');
      if (!perDia[dia]) perDia[dia] = [];
      perDia[dia].push(entrada);
    }

    const diesOrdenats = Object.keys(perDia).sort();
    const ultimDia = diesOrdenats[diesOrdenats.length - 1];
    const resultats: PrevisioHora[] = [];

    diesOrdenats.forEach(dia => {
      const entrades = perDia[dia];
      if (dia === ultimDia) {
        const preferida = this.mesProperaAHora(entrades, '09:00:00') || this.mesProperaAHora(entrades, '15:00:00');
        if (preferida) resultats.push(preferida);
      } else {
        const mati = this.mesProperaAHora(entrades, '09:00:00');
        const tarda = this.mesProperaAHora(entrades, '15:00:00');
        if (mati) resultats.push(mati);
        if (tarda) resultats.push(tarda);
      }
    });

    return resultats.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }

  mesProperaAHora(entrades: PrevisioHora[], horaObjectiu: string): PrevisioHora | null {
    const [hObj, mObj] = horaObjectiu.split(':').map(Number);
    const targetMinutes = hObj * 60 + mObj;

    let millor: PrevisioHora | null = null;
    let millorDiferencia = Infinity;

    for (const entrada of entrades) {
      if (!entrada.data.includes(' ')) continue;
      const [, hora] = entrada.data.split(' ');
      const [h, m] = hora.split(':').map(Number);
      const minuts = h * 60 + m;
      const diff = Math.abs(minuts - targetMinutes);

      if (diff < millorDiferencia) {
        millor = entrada;
        millorDiferencia = diff;
      }
    }

    return millor;
  }

  scrollCarrusel(direccio: number) {
    const el = this.carruselRef.nativeElement;
    const ampladaCard = el.querySelector('.previsio-card')?.offsetWidth || 200;
    el.scrollBy({ left: direccio * (ampladaCard + 16), behavior: 'smooth' });
  }

  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  obtenirRutaEnllac(punt: any): string[] {
    const tipusRuta = punt.tipus.toLowerCase();
    const id = punt.tipus_id;
    return ['/', tipusRuta, id];
  }

  toggleStatus(puntId: number, tipusPlural: string, status: 'wishlist' | 'done') {
    const tipus = this.getSingularTipus(tipusPlural);
    const isActive = this.isActive(puntId, tipus, status);
    const action = isActive ? 'remove' : 'add';

    this.userItemStatusService
      .toggleStatus(puntId, tipus, status, action)
      .subscribe(() => {
        if (action === 'add') {
          this.userStatuses.push({
            item_id: puntId,
            item_type: tipus,
            status,
            user_id: 0,
            id: 0,
            created_at: '',
          });
        } else {
          this.userStatuses = this.userStatuses.filter(
            (s) => !(s.item_id === puntId && s.item_type === tipus && s.status === status)
          );
        }
      });
  }

  isActive(puntId: number, tipusPlural: string, status: 'wishlist' | 'done') {
    const tipus = this.getSingularTipus(tipusPlural);
    return this.userStatuses.some(
      (s) => s.item_id === puntId && s.item_type === tipus && s.status === status
    );
  }

  isWishlisted(puntId: number, tipusPlural: string): boolean {
    return this.isActive(puntId, tipusPlural, 'wishlist');
  }

  getSingularTipus(plural: string): string {
    const map: Record<string, string> = {
      'refugis': 'refugi',
      'estanys': 'estany',
      'pics': 'pic'
    };
    return map[plural.toLowerCase()] || plural.toLowerCase();
  }
}

interface PrevisioHora {
  data: string;
  temperatura: number;
  pluja: number;
  vent: number;
  icon: string;
  descripcio: string;
}
