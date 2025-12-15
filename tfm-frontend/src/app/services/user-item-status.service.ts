import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Refugi } from './refugis.service';
import { environment } from '../../environments/environment';

export interface UserItemStatus {
  id: number;
  user_id: number;
  item_id: number;
  item_type: string;
  status: 'wishlist' | 'done';
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserItemStatusService {
  private apiUrl = `${environment.apiUrl}/user-item-status`;

  constructor(private http: HttpClient) { }

  toggleStatus(
    itemId: number,
    itemType: string,
    status: 'wishlist' | 'done',
    action: 'add' | 'remove'
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle`, {
      item_id: itemId,
      item_type: itemType,
      status,
      action,
    });
  }

  getUserStatuses(): Observable<UserItemStatus[]> {
    return this.http.get<UserItemStatus[]>(this.apiUrl);
  }
  getRefugisByStatus(status: 'done' | 'wishlist') {
    return this.http.get<Refugi[]>(`${environment.apiUrl}/user/refugis/${status}`);
  }
  getPicsByStatus(status: 'done' | 'wishlist') {
    return this.http.get<any[]>(`${environment.apiUrl}/user/pics/${status}`);
  }

  getEstanysByStatus(status: 'done' | 'wishlist') {
    return this.http.get<any[]>(`${environment.apiUrl}/user/estanys/${status}`);
  }

  getRutesByStatus(status: 'done' | 'wishlist') {
    return this.http.get<any[]>(`${environment.apiUrl}/user/rutes/${status}`);
  }

  getViesFerradesByStatus(status: 'done' | 'wishlist') {
    return this.http.get<any[]>(`${environment.apiUrl}/user/vies-ferrades/${status}`);
  }
}
