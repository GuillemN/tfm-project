import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RefugiMapComponent } from '../refugi-map/refugi-map.component';
import { ViesFerradesService, ViaFerrada } from '../../services/vies-ferrades.service';
import { MeteoService } from '../../services/meteo.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vies-ferrades-detall',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RefugiMapComponent, RouterModule],
  templateUrl: './vies-ferrades-detall.component.html',
  styleUrls: ['./vies-ferrades-detall.component.scss']
})
export class ViesFerradesDetallComponent implements OnInit {
  via!: ViaFerrada;
  previsio: PrevisioHora[] = [];
  previsioFiltrada: PrevisioHora[] = [];

  @ViewChild('carrusel') carruselRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private viesFerradesService: ViesFerradesService,
    private meteoService: MeteoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.viesFerradesService.getViaFerradaById(+id).subscribe((data) => {
        this.via = data;
        const [lat, lon] = this.via.coordenades.split(',').map(Number);

        this.meteoService.getForecast(lat, lon).subscribe({
          next: (resposta) => {
            this.previsio = resposta.previsio;
            this.previsioFiltrada = this.filtrarMatinsITardes(this.previsio);
          },
          error: (err) => console.error('Error previsió:', err)
        });
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

  private mesProperaAHora(entrades: PrevisioHora[], horaObjectiu: string): PrevisioHora | null {
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
}

interface PrevisioHora {
  data: string;
  temperatura: number;
  pluja: number;
  vent: number;
  icon: string;
  descripcio: string;
}
