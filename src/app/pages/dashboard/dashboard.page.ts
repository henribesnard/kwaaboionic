import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { AuthService } from 'src/app/_services/auth.service';
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  currentUser: any;
  currentUserId: any;
  balance: string;
  compte: any;
  stellarsecret: string;
  @ViewChild('lineCanvas', { static: true }) lineCanvas;
  lineChart: any;
  public menustatus: any;
  payements: any;
  constructor(private router: Router,
              private authService: AuthService) { }
  menuopen() {
    alert('function changecolor');
    this.menustatus = 'open';
  }
  notificationsPage() {
    this.router.navigate(['notifications']);
  }
  profilePage() {
    this.router.navigate(['profile']);
  }
  async ngOnInit() {
    this.linechart();
    this.currentUser = this.authService.getUser();
    this.currentUserId = this.authService.getUser().id;
    this.stellarsecret = this.currentUser.stellarsecret;

    const keypair = StellarSdk.Keypair.fromSecret(this.stellarsecret);
    server.loadAccount(keypair.publicKey())
      .then(account => {
         this.compte = account.balances;
         this.compte.forEach(element => {
           if (element.asset_code === 'KWB'){
             this.balance = element.balance;
           }
         });
      });
  }
  linechart() {

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: [' ', '1sem', '2sem', '3sem', '4sem', '5sem', ' '],
        datasets: [{
          borderWidth: 2,
          borderColor: '#28A745',
          pointBorderWidth: 0,
          pointHoverRadius: 0,
          lineTension: 0,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 0,
          pointRadius: 0,
          pointHitRadius: 0,
          data: [65, 50, 80, 90, 56, 85, 50],
          fill: false
        },
        {

          borderColor: 'rgba(0,0,0,0.5)',
          borderWidth: 1,
          borderDash: [3, 5],
          pointBorderWidth: 0,
          pointHoverRadius: 0,
          lineTension: 0,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 0,
          pointRadius: 0,
          pointHitRadius: 0,
          data: [40, 60, 70, 64, 89, 50, 69],
          fill: false
        }

        ]
      },
      options: {
        responsive: true,
        animation: {

          duration: 1000,

          easing: 'linear'

        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false
            },
            ticks: {

            }
          }],
          yAxes: [{

            display: false
          }]
        }
      }
    });

  }
}
