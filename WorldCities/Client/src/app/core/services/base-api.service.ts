import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResult } from 'src/app/shared/models/apiResult';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService<T> {

  constructor(protected http: HttpClient) { }

  abstract getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<IApiResult<T>>;

  abstract get(id: number): Observable<T>;

  abstract put(item: T): Observable<T>;

  abstract post(item: T): Observable<T>;

  protected getUrl(url: string) {
    return `${environment.baseApiUrl}${url}`;
  }
}
