import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginRequest } from 'src/app/shared/models/loginRequest';
import { ILoginResult } from 'src/app/shared/models/loginResult';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseApiUrl: string = environment.baseApiUrl;
  tokenKey: string = "token";

  constructor(protected http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  login(item: ILoginRequest): Observable<ILoginResult> {
    const url: string = this.baseApiUrl + 'account/login';
    return this.http.post<ILoginResult>(url, item);
  }

}
