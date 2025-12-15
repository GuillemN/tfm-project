import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ViaFerrada {
  id_via_ferrada: number;
  nom: string;
  dificultat: string;
  desnivell: number;
  temps_tornada: string;
  temps_anada: string;
  temps_via: string;
  coordenades: string;
  imatge: string;
  Parroquia: string;
  estat: string;
  Descripcio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViesFerradesService {
  private apiUrl = `${environment.apiUrl}/vies-ferrades`;

  constructor(private http: HttpClient) { }

  getViesFerrades(): Observable<ViaFerrada[]> {
    return this.http.get<ViaFerrada[]>(this.apiUrl);
  }

  getViaFerradaById(id: number): Observable<ViaFerrada> {
    return this.http.get<ViaFerrada>(`${this.apiUrl}/${id}`);
  }
}
