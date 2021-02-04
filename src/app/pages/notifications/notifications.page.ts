import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  constructor(private router: Router) { }
  dashboardPage()
  {
   this.router.navigate(['dashboard'])
  }
   notificationsPage()
  {
  this.router.navigate(['notifications'])
  }
  profilePage()
  {
	  this.router.navigate(['profile'])
  }
  
  ngOnInit() {
  }

}
