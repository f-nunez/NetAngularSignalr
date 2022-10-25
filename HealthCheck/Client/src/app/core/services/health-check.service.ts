import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { IResult } from 'src/app/shared/models/result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private baseApiUrl: string = environment.baseApiUrl;
  private hubConnection!: signalR.HubConnection;
  private _result: Subject<IResult> = new Subject<IResult>();
  result: Observable<IResult> = this._result.asObservable();

  constructor(private http: HttpClient) { }

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.baseApiUrl + 'health-hub', { withCredentials: false })
      .build();

    console.log("Starting connection...");

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((error: any) => console.log(error));

    this.updateData();
  }

  addDataListeners() {
    this.hubConnection.on('Update', (message) => {
      console.log(`Update issued by server for the following reason: ${message}`);
      this.updateData();
    });

    this.hubConnection.on('ClientUpdate', (message) => {
      console.log(`Update issued by client for the following reason: ${message}`);
      this.updateData();
    });
  }

  sendClientUpdate() {
    this.hubConnection.invoke('ClientUpdate', 'client test')
      .catch(err => console.error(err));
  }

  updateData() {
    console.log('Fetching data');
    this.http.get<IResult>(this.baseApiUrl + 'health')
      .subscribe({
        next: response => {
          this._result.next(response);
        },
        error: error => console.log(error)
      });
  }
}
