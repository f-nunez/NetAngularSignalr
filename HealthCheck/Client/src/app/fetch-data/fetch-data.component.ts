import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IWeatherForecast } from '../shared/models/weatherForecast';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.scss']
})
export class FetchDataComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  weatherForecasts?: IWeatherForecast[];

  constructor(private http: HttpClient) {
    this.http.get<IWeatherForecast[]>(this.baseApiUrl + 'weatherforecast')
      .subscribe({
        next: result => this.weatherForecasts = result,
        error: error => console.log(error)
      });
  }

  ngOnInit(): void {
  }

}
