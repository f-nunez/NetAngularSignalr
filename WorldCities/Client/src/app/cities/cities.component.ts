import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICity } from '../shared/models/city';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  cities!: ICity[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<ICity[]>(this.baseApiUrl + 'cities').subscribe({
      next: response => this.cities = response,
      error: error => console.log(error)
    })
  }

}
