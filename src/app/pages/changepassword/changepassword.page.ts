import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {
  constructor(private router: Router) { }
  dashboardPage() {
    this.router.navigate(['dashboard']);
  }
  notificationsPage() {
    this.router.navigate(['notifications']);
  }
  settingsPage() {
    this.router.navigate(['settings']);
  }
  profilePage() {
    this.router.navigate(['profile']);
  }
  ngOnInit() {
  }

}
