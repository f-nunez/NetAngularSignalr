import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HealthCheckService } from '../core/services/health-check.service';
import { IResult } from '../shared/models/result';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {
  baseApiUrl: string = environment.baseApiUrl;
  result: Observable<IResult | null>;

  constructor(private healthCheckService: HealthCheckService) {
    this.result = this.healthCheckService.result;
  }

  ngOnInit(): void {
    this.healthCheckService.startConnection();
    this.healthCheckService.addDataListeners();
  }

  onRefresh() {
    this.healthCheckService.sendClientUpdate();
  }

}
