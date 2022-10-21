import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICountry } from '../shared/models/country';
import { CountryService } from './country.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  countries!: MatTableDataSource<ICountry>;
  displayedColumns: string[] = ['id', 'name', 'iso2', 'iso3', 'totCities'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterTextChanged: Subject<string> = new Subject<string>();
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  defaultSortColumn: string = "name";
  defaultSortOrder: "asc" | "desc" = "asc";
  defaultFilterColumn: string = "name";
  filterQuery?: string;

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {
    this.loadData();
  }

  getData(pageEvent: PageEvent) {
    let sortColumn = (this.sort)
      ? this.sort.active
      : this.defaultSortColumn;

    let sortOrder = (this.sort)
      ? this.sort.direction
      : this.defaultSortOrder;

    let filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      : null;

    let filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;

    this.countryService.getData(
      pageEvent.pageIndex,
      pageEvent.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery)
      .subscribe({
        next: response => {
          this.paginator.length = response.totalCount;
          this.paginator.pageIndex = response.pageIndex;
          this.paginator.pageSize = response.pageSize;
          this.countries = new MatTableDataSource<ICountry>(response.data);
        },
        error: error => console.log(error)
      });
  }

  loadData(query?: string) {
    let pageEvent = new PageEvent();
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
