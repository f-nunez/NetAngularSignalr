import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  @ViewChild(MatSort) sort!: MatSort;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  defaultSortColumn: string = 'name';
  defaultSortOrder: "asc" | "desc" = "asc";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  getData(pageEvent: PageEvent) {
    let params = new HttpParams()
      .set('pageIndex', pageEvent.pageIndex.toString())
      .set('pageSize', pageEvent.pageSize.toString())
      .set('sortColumn', this.sort
        ? this.sort.active
        : this.defaultSortColumn)
      .set('sortOrder', this.sort
        ? this.sort.direction
        : this.defaultSortOrder);

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

  loadData() {
    const pageEvent: PageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.getData(pageEvent);
  }

}
