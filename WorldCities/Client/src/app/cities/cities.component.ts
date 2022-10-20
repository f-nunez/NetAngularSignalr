import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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
  displayedColumns: string[] = ['id', 'name', 'lat', 'lon', 'countryName'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterTextChanged: Subject<string> = new Subject<string>();
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  defaultSortColumn: string = 'name';
  defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = 'name';
  filterQuery?: string;

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

    if (this.filterQuery) {
      params = params
        .set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", this.filterQuery);
    }

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

  loadData(query?: string) {
    const pageEvent: PageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  onFilterTextChanged(filterText: string) {
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }

    this.filterTextChanged.next(filterText);
  }

}
