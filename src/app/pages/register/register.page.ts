import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form: any = {
    nom: null,
    prenom: null,
    email: null,
    mot_de_passe: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) { }
  loginPage() {
    this.router.navigate(['login']);
  }
  ngOnInit() {
  }
  onSubmit(): void {
    const { nom, prenom, email, mot_de_passe } = this.form;
    const pair = StellarSdk.Keypair.random();
    const stellarid = pair.publicKey();
    const stellarsecret = pair.secret();
    this.authService.register(nom, prenom, email, mot_de_passe, pair.publicKey(), pair.secret()).subscribe(
      async data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        // AJOUTER DES XML AU COMPTE
        (async function main() {
          try {
            const response = await fetch(
              `https://friendbot.stellar.org?addr=${encodeURIComponent(
                stellarid,
              )}`,
            );
            const responseJSON = await response.json();
            console.log('Le compte est bien créé sur Stellar:)\n', responseJSON);
            // CHANGE TRUST TO KWB
            const keypair = StellarSdk.Keypair.fromSecret(stellarsecret);
            const account = await server.loadAccount(keypair.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(account, {
              fee: StellarSdk.BASE_FEE,
              networkPassphrase: StellarSdk.Networks.TESTNET,
            })
              .addOperation(
                StellarSdk.Operation.changeTrust({
                  asset: new StellarSdk.Asset('KWB', 'GAOYWB623PRJZBH3ZNB2SNGYRGYM2EUWX57BPQPIZJ4JPXBWFEDWW36X'),
                })
              )
              .setTimeout(0)
              .build();
            transaction.sign(keypair);
            server.submitTransaction(transaction);
            console.log('Change trust OK');
          } catch (e) {
            console.error('ERROR!', e);
          }
        })();
        this.router.navigate(['/login']);
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

}
