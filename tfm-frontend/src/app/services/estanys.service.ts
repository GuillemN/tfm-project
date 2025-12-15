import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruta } from './rutes.service';
import { environment } from '../../environments/environment';

export interface Estany {
  id_estany: number;
  nom: string;
  altitud: number;
  imatge: string;
  coordenades: string;
  parroquia: string;
  superficie: number;
  artificial: number;
  descripcio: string;

}

@Injectable({
  providedIn: 'root'
})
export class EstanysService {
  private apiUrl = `${environment.apiUrl}/estanys`;

  constructor(private http: HttpClient) { }

  getEstanys(): Observable<Estany[]> {
    return this.http.get<Estany[]>(this.apiUrl);
  }

  getEstanyById(id: number): Observable<Estany> {
    return this.http.get<Estany>(`${this.apiUrl}/${id}`);
  }

  getRutesPerEstany(id: number): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.apiUrl}/${id}/rutes`);
  }
}
