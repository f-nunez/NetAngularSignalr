import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IResult } from '../shared/models/result';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  result?: IResult;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<IResult>(this.baseApiUrl + 'health').subscribe({
      next: response => this.result = response,
      error: error => console.log(error)
    });
  }

}
