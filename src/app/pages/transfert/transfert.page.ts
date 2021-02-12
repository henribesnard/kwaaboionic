import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransfertService } from 'src/app/_services/transfert.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
const StellarSdk = require('stellar-sdk');

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.page.html',
  styleUrls: ['./transfert.page.scss'],
})
export class TransfertPage implements OnInit {
  currentUser: any;
  destinationID: any;
  id = '22438699';

  form: any = {
    destinationCompteId: null,
    amount: null,
    commentaire: null
  };

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private transfertservice: TransfertService) { }

  payementsPage() {
    this.router.navigate(['payments']);
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    console.log(this.currentUser);

    this.userService.getStellarDetails(this.id).subscribe(data => {
      this.destinationID = data.stellarid;
      console.log(this.destinationID);
    });
  }

  onSubmit(): void {
  }

}
