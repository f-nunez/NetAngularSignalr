import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { BaseFormComponent } from '../shared/components/base-form/base-form.component';
import { ILoginRequest } from '../shared/models/loginRequest';
import { ILoginResult } from '../shared/models/loginResult';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  title?: string;
  loginResult?: ILoginResult;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    let loginRequest = <ILoginRequest>{};
    loginRequest.email = this.form.controls['email'].value;
    loginRequest.password = this.form.controls['password'].value;

    this.authService
      .login(loginRequest)
      .subscribe({
        next: response => {
          console.log(response);
          this.loginResult = response;
          if (response.success) {
            this.router.navigate(["/"]);
          }
        },
        error: error => {
          console.log(error);
          if (error.status == 401) {
            this.loginResult = error.error;
          }
        }
      });
  }

}
