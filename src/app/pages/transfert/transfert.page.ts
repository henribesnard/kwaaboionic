import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { TransfertService } from 'src/app/_services/transfert.service';
const StellarSdk = require('stellar-sdk');

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.page.html',
  styleUrls: ['./transfert.page.scss'],
})
export class TransfertPage implements OnInit {

  form: any = {
    destinationCompteId: null,
    amount: null,
    commentaire: null
  };

  constructor(private router: Router,
              private userService: UserService,
              private transfertservice: TransfertService) { }

  payementsPage()
  {
this.router.navigate(['payments']);
  }

  async ngOnInit() {
  }

  onSubmit(): void {
  }

}
