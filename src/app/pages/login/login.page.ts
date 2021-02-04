import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  token: string;

  constructor(private router: Router,  private authService: AuthService ) { }
  registerPage()
  {
  this.router.navigate(['register']);
  }
  forgotpasswordPage()
  {
  this.router.navigate(['forgotpassword']);
  }
  dashboardPage()
  {
  this.router.navigate(['dashboard']);
  }
  ngOnInit() {
    if (this.authService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.authService.getUser().roles;
      this.token = this.authService.getToken();
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe(
      data => {
        this.authService.saveToken(data.token);
        this.authService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.authService.getUser().roles;
        this.router.navigate(['dashboard']);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

}
