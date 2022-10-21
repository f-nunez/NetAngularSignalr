import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../core/services/base-api.service';
import { IApiResult } from '../shared/models/apiResult';
import { ICity } from '../shared/models/city';
import { ICountry } from '../shared/models/country';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseApiService<ICity> {

  constructor(http: HttpClient) {
    super(http);
  }

  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<IApiResult<ICity>> {
    const url: string = this.getUrl('cities');
    let params: HttpParams = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set('filterColumn', filterColumn)
        .set('filterQuery', filterQuery);
    }

    return this.http.get<IApiResult<ICity>>(url, { params });
  }

  get(id: number): Observable<ICity> {
    const url: string = this.getUrl('cities' + id);
    return this.http.get<ICity>(url);
  }

  put(item: ICity): Observable<ICity> {
    const url: string = this.getUrl('cities/' + item.id);
    return this.http.put<ICity>(url, item);
  }

  post(item: ICity): Observable<ICity> {
    const url: string = this.getUrl('cities');
    return this.http.post<ICity>(url, item);
  }

  existsCity(item: ICity): Observable<boolean> {
    const url: string = this.getUrl("cities/existscity");
    return this.http.post<boolean>(url, item);
  }

  getCountries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null): Observable<IApiResult<ICountry>> {
    const url: string = this.getUrl("countries");
    let params: HttpParams = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterColumn && filterQuery) {
      params = params
        .set("filterColumn", filterColumn)
        .set("filterQuery", filterQuery);
    }

    return this.http.get<IApiResult<ICountry>>(url, { params });
  }

}
