import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private user: User | null = null;
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.user = response.user;
      })
    );
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  register(data: { nom: string; email: string; contrasenya: string; contrasenya_confirmation: string }) {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/register`,
      data
    ).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.user = null;
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser() {
    const token = localStorage.getItem(this.tokenKey);
    return this.http.get<User>(`${this.apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
