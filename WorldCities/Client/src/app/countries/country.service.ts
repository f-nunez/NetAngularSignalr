import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../core/services/base-api.service';
import { IApiResult } from '../shared/models/apiResult';
import { ICountry } from '../shared/models/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseApiService<ICountry> {

  constructor(http: HttpClient) {
    super(http);
  }

  getData(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string | null,
    filterQuery: string | null
  ): Observable<IApiResult<ICountry>> {
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

  get(id: number): Observable<ICountry> {
    const url: string = this.getUrl("countries/" + id);
    return this.http.get<ICountry>(url);
  }

  put(item: ICountry): Observable<ICountry> {
    const url: string = this.getUrl("countries/" + item.id);
    return this.http.put<ICountry>(url, item);
  }

  post(item: ICountry): Observable<ICountry> {
    const url: string = this.getUrl("countries");
    return this.http.post<ICountry>(url, item);
  }

  existsField(countryId: number, fieldName: string, fieldValue: string): Observable<boolean> {
    let params: HttpParams = new HttpParams()
      .set("countryId", countryId)
      .set("fieldName", fieldName)
      .set("fieldValue", fieldValue);

    const url: string = this.getUrl("countries/existsfield");
    return this.http.post<boolean>(url, null, { params });
  }
}