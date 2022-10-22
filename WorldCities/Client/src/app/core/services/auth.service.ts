import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ILoginRequest } from 'src/app/shared/models/loginRequest';
import { ILoginResult } from 'src/app/shared/models/loginResult';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl: string = environment.baseApiUrl;
  private tokenKey: string = "token";
  private _authStatus = new Subject<boolean>();
  authStatus = this._authStatus.asObservable();

  constructor(protected http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  init(): void {
    if (this.isAuthenticated()) {
      this.setAuthStatus(true);
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  login(item: ILoginRequest): Observable<ILoginResult> {
    const url: string = this.baseApiUrl + 'account/login';
    return this.http.post<ILoginResult>(url, item)
      .pipe(tap(loginResult => {
        if (loginResult.success && loginResult.token) {
          localStorage.setItem(this.tokenKey, loginResult.token);
          this.setAuthStatus(true);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
  }

  private setAuthStatus(isAuthenticated: boolean) {
    this._authStatus.next(isAuthenticated);
  }

}
