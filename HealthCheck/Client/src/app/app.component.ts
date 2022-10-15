import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IWeatherForecast } from './shared/models/weatherForecast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  baseApiUrl: string = environment.baseApiUrl;
  weatherForecasts?: IWeatherForecast[];
  title = 'Client';

  constructor(private http: HttpClient) {
    this.http.get<IWeatherForecast[]>(this.baseApiUrl + 'weatherforecast')
      .subscribe({
        next: result => this.weatherForecasts = result,
        error: error => console.log(error)
      });
  }
}
