import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
    this.http.get<ICity[]>(this.baseApiUrl + 'cities').subscribe({
      next: response => {
        this.cities = new MatTableDataSource<ICity>(response);
        this.cities.paginator = this.paginator;
      },
      error: error => console.log(error)
    })
  }

}
