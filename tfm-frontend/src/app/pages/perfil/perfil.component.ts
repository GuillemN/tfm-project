import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserItemStatusService } from '../../services/user-item-status.service';
import { RouterModule, Router } from '@angular/router';
import { ImgUrlPipe } from '../../pipes/img-url.pipe';
import { CardComponent } from '../../components/card/card.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { forkJoin } from 'rxjs';

type ItemArrayKey =
  | 'doneRefugis'
  | 'wishlistRefugis'
  | 'donePics'
  | 'wishlistPics'
  | 'doneEstanys'
  | 'wishlistEstanys'
  | 'doneRutes'
  | 'wishlistRutes'
  | 'doneViesFerrades'
  | 'wishlistViesFerrades';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, ImgUrlPipe, CardComponent, LoadingComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  doneRefugis: any[] = [];
  wishlistRefugis: any[] = [];
  donePics: any[] = [];
  wishlistPics: any[] = [];
  doneEstanys: any[] = [];
  wishlistEstanys: any[] = [];
  doneRutes: any[] = [];
  wishlistRutes: any[] = [];
  doneViesFerrades: any[] = [];
  wishlistViesFerrades: any[] = [];

  seccions: { titol: string; items: any[]; type: string; status: 'done' | 'wishlist' }[] = [];

  hoveredItem: number | null = null;
  isLoading: boolean = true;

  constructor(
    private userItemStatusService: UserItemStatusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    forkJoin({
      doneRefugis: this.userItemStatusService.getRefugisByStatus('done'),
      wishlistRefugis: this.userItemStatusService.getRefugisByStatus('wishlist'),
      donePics: this.userItemStatusService.getPicsByStatus('done'),
      wishlistPics: this.userItemStatusService.getPicsByStatus('wishlist'),
      doneEstanys: this.userItemStatusService.getEstanysByStatus('done'),
      wishlistEstanys: this.userItemStatusService.getEstanysByStatus('wishlist'),
      doneRutes: this.userItemStatusService.getRutesByStatus('done'),
      wishlistRutes: this.userItemStatusService.getRutesByStatus('wishlist'),
      doneViesFerrades: this.userItemStatusService.getViesFerradesByStatus('done'),
      wishlistViesFerrades: this.userItemStatusService.getViesFerradesByStatus('wishlist')
    }).subscribe({
      next: (data) => {
        this.doneRefugis = data.doneRefugis;
        this.wishlistRefugis = data.wishlistRefugis;
        this.donePics = data.donePics;
        this.wishlistPics = data.wishlistPics;
        this.doneEstanys = data.doneEstanys;
        this.wishlistEstanys = data.wishlistEstanys;
        this.doneRutes = data.doneRutes;
        this.wishlistRutes = data.wishlistRutes;
        this.doneViesFerrades = data.doneViesFerrades;
        this.wishlistViesFerrades = data.wishlistViesFerrades;

        this.updateSeccions();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error carregant dades del perfil:', err);
        this.isLoading = false;
      }
    });
  }

  updateSeccions() {
    this.seccions = [
      { titol: 'Refugis que he fet', items: this.doneRefugis, type: 'refugi', status: 'done' },
      { titol: 'Refugis que m’agradaria fer', items: this.wishlistRefugis, type: 'refugi', status: 'wishlist' },
      { titol: 'Pics que he fet', items: this.donePics, type: 'pic', status: 'done' },
      { titol: 'Pics que m’agradaria fer', items: this.wishlistPics, type: 'pic', status: 'wishlist' },
      { titol: 'Estanys que he visitat', items: this.doneEstanys, type: 'estany', status: 'done' },
      { titol: 'Estanys que vull visitar', items: this.wishlistEstanys, type: 'estany', status: 'wishlist' },
      { titol: 'Rutes completades', items: this.doneRutes, type: 'ruta', status: 'done' },
      { titol: 'Rutes pendents', items: this.wishlistRutes, type: 'ruta', status: 'wishlist' },
      { titol: 'Vies Ferrades fetes', items: this.doneViesFerrades, type: 'via-ferrada', status: 'done' },
      { titol: 'Vies Ferrades desitjades', items: this.wishlistViesFerrades, type: 'via-ferrada', status: 'wishlist' }
    ];
  }

  toggleStatus(itemId: number, itemType: string, status: 'done' | 'wishlist') {
    this.userItemStatusService.toggleStatus(itemId, itemType, status, 'remove').subscribe(() => {
      const key = this.getArrayKey(itemType, status);
      this[key] = (this[key] as any[]).filter(item =>
        this.getItemId(item, itemType) !== itemId
      );
      this.updateSeccions();
    });
  }

  isWishlisted(itemId: number, itemType: string): boolean {
    const key = this.getArrayKey(itemType, 'wishlist');
    const list = this[key] as any[];
    return list?.some(item => this.getItemId(item, itemType) === itemId);
  }

  private getArrayKey(type: string, status: 'done' | 'wishlist'): ItemArrayKey {
    const map: Record<string, string> = {
      refugi: 'Refugis',
      pic: 'Pics',
      estany: 'Estanys',
      ruta: 'Rutes',
      'via-ferrada': 'ViesFerrades'
    };
    return (status + map[type]) as ItemArrayKey;
  }

  getFolderName(type: string): string {
    switch (type) {
      case 'ruta': return 'rutes';
      case 'refugi': return 'refugis';
      case 'pic': return 'pics';
      case 'estany': return 'estanys';
      case 'via-ferrada': return 'vies-ferrades';
      default: return type + 's';
    }
  }

  getItemId(item: any, type: string): number {
    if (type === 'ruta') return item.id;
    if (type === 'via-ferrada') return item.id_via_ferrada;
    return item[`id_${type}`] ?? item.id;
  }

  handleToggleClick(itemId: number, itemType: string, status: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleStatus(itemId, itemType, status as 'done' | 'wishlist');
  }
}
