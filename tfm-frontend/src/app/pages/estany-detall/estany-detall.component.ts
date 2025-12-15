import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RefugiMapComponent } from '../refugi-map/refugi-map.component';
import { RouterModule } from '@angular/router';
import { Estany, EstanysService } from '../../services/estanys.service';
import { MeteoService } from '../../services/meteo.service';
import { Ruta } from '../../services/rutes.service';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';

@Component({
  selector: 'app-estany-detall',
  standalone: true,
  imports: [CommonModule, RefugiMapComponent, RouterModule, ImgUrlPipe],
  templateUrl: './estany-detall.component.html',
  styleUrls: ['./estany-detall.component.scss']
})
export class EstanyDetallComponent implements OnInit {
  estany!: Estany;
  previsio: PrevisioHora[] = [];
  previsioFiltrada: PrevisioHora[] = [];
  rutes: Ruta[] = [];
  userStatuses: any[] = [];
  hoveredRuta: number | null = null;

  @ViewChild('carrusel') carruselRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private estanysService: EstanysService,
    private meteoService: MeteoService,
    private userItemStatusService: UserItemStatusService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.estanysService.getEstanyById(+id).subscribe((data) => {
        this.estany = data;
        const [lat, lon] = this.estany.coordenades.split(',').map(Number);

        this.meteoService.getForecast(lat, lon).subscribe({
          next: (resposta) => {
            this.previsio = resposta.previsio;
            this.previsioFiltrada = this.filtrarMatinsITardes(this.previsio);
          },
          error: (err) => console.error('Error previsió:', err)
        });
      });

      this.estanysService.getRutesPerEstany(+id).subscribe({
        next: (rutes) => this.rutes = rutes,
        error: (err) => console.error('Error carregant rutes de l\'estany:', err)
      });

      this.userItemStatusService.getUserStatuses().subscribe((statuses) => {
        this.userStatuses = statuses;
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

    diesOrdenats.forEach((dia) => {
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

  toggleStatus(estanyId: number, status: 'wishlist' | 'done') {
    const isActive = this.isActive(estanyId, status);
    const action = isActive ? 'remove' : 'add';

    this.userItemStatusService.toggleStatus(estanyId, 'estany', status, action).subscribe(() => {
      if (action === 'add') {
        this.userStatuses.push({ item_id: estanyId, item_type: 'estany', status });
      } else {
        this.userStatuses = this.userStatuses.filter(
          (s) => !(s.item_id === estanyId && s.item_type === 'estany' && s.status === status)
        );
      }
    });
  }

  isActive(estanyId: number, status: 'wishlist' | 'done') {
    return this.userStatuses.some(
      (s) => s.item_id === estanyId && s.item_type === 'estany' && s.status === status
    );
  }

  isWishlisted(estanyId: number): boolean {
    return this.isActive(estanyId, 'wishlist');
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