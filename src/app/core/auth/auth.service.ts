import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { User, LoginRequest, LoginResponse } from './models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor() {
    const user = this.storage.getUser<User>();
    if (user && this.storage.getToken()) {
      this._currentUser.set(user);
      this._isAuthenticated.set(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.storage.setToken(response.token);
          this.storage.setRefreshToken(response.refreshToken);
          this.storage.setUser(response.user);
          this._currentUser.set(response.user);
          this._isAuthenticated.set(true);
        })
      );
  }

  logout(): void {
    this.storage.clear();
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  hasRole(roles: string[]): boolean {
    const user = this._currentUser();
    return user ? roles.includes(user.role) : false;
  }
}
