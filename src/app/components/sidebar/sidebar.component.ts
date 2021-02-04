import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
public url1 = '';
currentUser: any;

  constructor(private router: Router, private authservice: AuthService) { }
   dashboardPage()
  {
  this.router.navigate(['dashboard']);
  }
  paymentsPage()
  {
  this.router.navigate(['payments']);
  }
  historyPage()
  {
  this.router.navigate(['history']);
  }
  settingsPage()
  {
  this.router.navigate(['settings']);
  }
  profilePage()
  {
  this.router.navigate(['profile']);
  }
  logout()
  {
    this.authservice.logout();
  }
  ngOnInit() {
   this.currentUser = this.authservice.getUser();
	  this.url1 = this.router.url;
  }

}
