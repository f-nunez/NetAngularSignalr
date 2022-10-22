import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  private destroySubject = new Subject();
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.authStatus
      .pipe(takeUntil(this.destroySubject))
      .subscribe({
        next: response => {
          this.isLoggedIn = response;
        },
        error: error => {
          console.log(error);
        }
      });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
