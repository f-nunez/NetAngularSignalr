import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConnectionService } from 'angular-connection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Client';
  hasInternetAccess: boolean = true;
  hasNetworkConnection: boolean = true;

  constructor(private connectionService: ConnectionService) {
    this.connectionService.monitor().subscribe({
      next: (currentState: any) => {
        this.hasInternetAccess = currentState.hasInternetAccess;
        this.hasNetworkConnection = currentState.hasNetworkConnection;
      }
    });
  }

  isOnline(): boolean {
    return this.hasInternetAccess && this.hasNetworkConnection;
  }
}
