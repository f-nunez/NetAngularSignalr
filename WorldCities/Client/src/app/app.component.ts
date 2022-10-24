import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'angular-connection-service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Client';
  hasInternetAccess: boolean = false;
  hasNetworkConnection: boolean = false;

  constructor(
    private authService: AuthService,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe({
      next: (currentState: any) => {
        this.hasInternetAccess = currentState.hasInternetAccess;
        this.hasNetworkConnection = currentState.hasNetworkConnection;
      }
    });
  }

  ngOnInit(): void {
    this.authService.init();
  }

  isOnline(): boolean {
    return this.hasInternetAccess && this.hasNetworkConnection;
  }

}
