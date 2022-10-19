import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { ICity } from '../shared/models/city';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  cities!: MatTableDataSource<ICity>;
  displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const pageEvent: PageEvent = new PageEvent();
    pageEvent.pageIndex = 0;
    pageEvent.pageSize = 10;
    this.getData(pageEvent);
  }

  getData(pageEvent: PageEvent) {
    let params = new HttpParams()
      .set('pageIndex', pageEvent.pageIndex.toString())
      .set('pageSize', pageEvent.pageSize.toString());

    this.http.get<any>(this.baseApiUrl + 'cities', { params })
      .subscribe({
        next: response => {
          this.cities = new MatTableDataSource<ICity>(response.data);
          this.paginator.length = response.totalCount;
          this.paginator.pageIndex = response.pageIndex;
          this.paginator.pageSize = response.pageSize;
        },
        error: error => console.log(error)
      });
  }

}
