import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(private router: Router) { }
   dashboardPage()
  {
   this.router.navigate(['dashboard'])
  }
   notificationsPage()
  {
  this.router.navigate(['notifications'])
  }
settingsPage()
  {
	   this.router.navigate(['settings'])
  }
  profilePage()
  {
	  this.router.navigate(['profile'])
  }
  ngOnInit() {
  }

}
