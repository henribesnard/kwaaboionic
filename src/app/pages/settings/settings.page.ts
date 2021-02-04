import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }
   notificationsPage()
  {
  this.router.navigate(['notifications']);
  }
  changepasswordPage()
  {
  this.router.navigate(['changepassword']);
  }
  faqsPage()
  {
  this.router.navigate(['faqs']);
  }
  feedbackPage()
  {
  this.router.navigate(['feedback']);
  }
  dashboardPage()
  {
	  this.router.navigate(['dashboard']);
  }
  profilePage()
  {
	  this.router.navigate(['profile']);
  }
  logout()
  {
    this.authService.logout();
  }
  ngOnInit() {
  }

}
