import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pic, PicsService } from '../../services/pics.service';
import { MeteoService } from '../../services/meteo.service';
import { Ruta } from '../../services/rutes.service';
import { RouterModule } from '@angular/router';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { RefugiMapComponent } from '../refugi-map/refugi-map.component';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';

@Component({
  selector: 'app-pic-detall',
  standalone: true,
  imports: [CommonModule, RouterModule, RefugiMapComponent, ImgUrlPipe],
  templateUrl: './pic-detall.component.html',
  styleUrls: ['./pic-detall.component.scss']
})
export class PicDetallComponent implements OnInit {
  pic!: Pic;
  previsio: PrevisioHora[] = [];
  previsioFiltrada: PrevisioHora[] = [];
  rutesDelPic: Ruta[] = [];
  userStatuses: any[] = [];
  hoveredRuta: number | null = null;



  @ViewChild('carrusel') carruselRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private picsService: PicsService,
    private meteoService: MeteoService,
    private userItemStatusService: UserItemStatusService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.picsService.getPicById(+id).subscribe((data) => {
        this.pic = data;
        const [lat, lon] = this.pic.coordenades.split(',').map(Number);

        this.meteoService.getForecast(lat, lon).subscribe({
          next: (resposta) => {
            this.previsio = resposta.previsio;
            this.previsioFiltrada = this.filtrarMatinsITardes(this.previsio);
          },
          error: (err) => console.error('Error previsió:', err)
        });
      });

      this.picsService.getRutesPerPic(+id).subscribe({
        next: (rutes) => this.rutesDelPic = rutes,
        error: (err) => console.error('Error carregant rutes del pic:', err)
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
  toggleStatus(rutaId: number, status: 'wishlist' | 'done') {
    const isActive = this.isActive(rutaId, status);
    const action = isActive ? 'remove' : 'add';

    this.userItemStatusService.toggleStatus(rutaId, 'ruta', status, action).subscribe(() => {
      if (action === 'add') {
        this.userStatuses.push({ item_id: rutaId, item_type: 'ruta', status });
      } else {
        this.userStatuses = this.userStatuses.filter(
          (s) => !(s.item_id === rutaId && s.item_type === 'ruta' && s.status === status)
        );
      }
    });
  }

  isActive(rutaId: number, status: 'wishlist' | 'done') {
    return this.userStatuses.some(
      (s) => s.item_id === rutaId && s.item_type === 'ruta' && s.status === status
    );
  }

  isWishlisted(rutaId: number): boolean {
    return this.isActive(rutaId, 'wishlist');
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
