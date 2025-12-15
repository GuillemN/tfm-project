import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Ruta {
  id: number;
  nom: string;
  descripcio: string;
  dificultat: string;
  desnivell: number;
  distancia_km: number;
  temps_estimacio: string;
  imatge: string;
  json: any;
  coordenades: string;
}

@Injectable({ providedIn: 'root' })
export class RutesService {
  private apiUrl = `${environment.apiUrl}/rutes`;

  constructor(private http: HttpClient) { }

  getRutes(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.apiUrl);
  }
  getRutaById(id: number): Observable<Ruta> {
    return this.http.get<Ruta>(`${this.apiUrl}/${id}`);
  }
  getPuntsRuta(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/punts`);
  }

}
