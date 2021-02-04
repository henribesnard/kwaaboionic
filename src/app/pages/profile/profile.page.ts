import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser: any;

  constructor(private router: Router, private authService: AuthService) { }
  dashboardPage()
  {
	this.router.navigate(['dashboard']);
  }
   notificationsPage()
  {
  this.router.navigate(['notifications']);
  }
  ngOnInit() {
    this.currentUser = this.authService.getUser();
  }

}
