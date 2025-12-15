import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruta } from './rutes.service';
import { environment } from '../../environments/environment';

export interface Pic {
  id_pic: number;
  nom: string;
  altitud: number;
  descripcio: string;
  coordenades: string;
  imatge: string;
  parroquia: string;
}

@Injectable({ providedIn: 'root' })
export class PicsService {
  private apiUrl = `${environment.apiUrl}/pics`;

  constructor(private http: HttpClient) { }

  getPics(): Observable<Pic[]> {
    return this.http.get<Pic[]>(this.apiUrl);
  }

  getPicById(id: number): Observable<Pic> {
    return this.http.get<Pic>(`${this.apiUrl}/${id}`);
  }

  getRutesPerPic(id: number): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.apiUrl}/${id}/rutes`);
  }
}
