import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-refugi-map',
  standalone: true,
  imports: [],
  templateUrl: './refugi-map.component.html',
  styleUrls: ['./refugi-map.component.scss']
})
export class RefugiMapComponent implements OnChanges, AfterViewInit {
  @Input() coordenades!: string;
  @Input() nom!: string;
  @Input() altura!: number;
  @ViewChild('map', { static: false }) mapElementRef!: ElementRef;
  @Input() geojson!: any;


  private map!: L.Map;
  private marker!: L.Marker;
  private mapaPreparat = false;

  ngAfterViewInit(): void {
    this.mapaPreparat = true;
    this.inicialitzarMapa();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coordenades'] || changes['nom'] || changes['altura'] || changes['geojson']) {
      this.inicialitzarMapa();
    }
  }

  private inicialitzarMapa(): void {
    if (!this.mapaPreparat || !this.mapElementRef) return;
  
    const [lat, lon] = this.coordenades
      ? this.coordenades.split(',').map(Number)
      : [42.5, 1.6]; 
  
    if (!this.map) {
      this.map = L.map(this.mapElementRef.nativeElement, {
        scrollWheelZoom: false
      }).setView([lat, lon], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
  
      // Si reps geojson, dibuixa la línia
      if (this.geojson) {
        const geoLayer = L.geoJSON(this.geojson).addTo(this.map);
        this.map.fitBounds(geoLayer.getBounds());
      }
  
      // Si reps coordenades i no és només geojson
      if (this.coordenades) {
        this.marker = L.marker([lat, lon]).addTo(this.map);
        this.marker.bindPopup(`<b>${this.nom}</b><br>Altitud: ${this.altura} m`).openPopup();
      }
  
      setTimeout(() => this.map.invalidateSize(), 100);
    }
  }
}
