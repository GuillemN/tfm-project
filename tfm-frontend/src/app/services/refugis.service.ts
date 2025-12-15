import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruta } from './rutes.service';
import { environment } from '../../environments/environment';

export interface Refugi {
  id_refugi: number;
  nom: string;
  coordenades: string;
  capacitat: number;
  contacte: string;
  imatge: string;
  parroquies: string;
  descripcio: string;
  lliure: number;
  Altura: number;
}

@Injectable({
  providedIn: 'root'
})
export class RefugisService {
  private apiUrl = `${environment.apiUrl}/refugis`;

  constructor(private http: HttpClient) { }

  getRefugis(): Observable<Refugi[]> {
    return this.http.get<Refugi[]>(this.apiUrl);
  }
  getRefugimap(id: number): Observable<Refugi> {
    return this.http.get<Refugi>(`${this.apiUrl}/${id}`);
  }
  getRefugiById(id: number): Observable<Refugi> {
    return this.http.get<Refugi>(`${this.apiUrl}/${id}`);
  }
  getRutesPerRefugi(id: number): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(`${this.apiUrl}/${id}/rutes`);
  }
}
