import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
const StellarSdk = require('stellar-sdk');
import { each as loEach, get } from 'lodash-es';
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  account: any;

  constructor(private barcodeScanner: BarcodeScanner, private router: Router, private authService: AuthService) { }

  dashboardPage() {
    this.router.navigate(['dashboard']);
  }
  notificationsPage() {
    this.router.navigate(['notifications']);
  }
  profilePage() {
    this.router.navigate(['profile']);
  }
  transfertPage() {
    this.router.navigate(['transfert']);
  }
  ngOnInit() {

  }
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      // success. barcodeData is the data returned by scanner
    }).catch(err => {
      // error
    });
  }

  // RETIRER UN ASSET
  async withdrawAsset() {
    const assetCode = 'KWB';
    const assetIssuer = 'GAOYWB623PRJZBH3ZNB2SNGYRGYM2EUWX57BPQPIZJ4JPXBWFEDWW36X';

    const keypair = StellarSdk.Keypair.fromSecret(this.authService.getUser().stellarsecret);
    server.loadAccount(keypair.publicKey())
      .then(account => {
        this.account = account;
        console.log(this.account);
      });
    const homeDomain = 'http://localhost:8000/';
    const tomlURL = new URL(homeDomain);
    tomlURL.pathname = '/.well-known/stellar.toml';

    const toml =
      tomlURL.protocol === 'http:'
        ? await StellarSdk.StellarTomlResolver.resolve(tomlURL.host, { allowHttp: true })
        : await StellarSdk.StellarTomlResolver.resolve(tomlURL.host);
    console.log(tomlURL.toString(), toml);
    const challengeJson = await fetch(
      `${toml.WEB_AUTH_ENDPOINT}?account=${keypair.publicKey()}`
    ).then((r) => r.json());
    const txn = new StellarSdk.Transaction(
      challengeJson.transaction,
      challengeJson.network_passphrase
    );
    txn.sign(keypair);
    const signedChallenge = txn.toXDR();
    const tokenJson = await fetch(`${toml.WEB_AUTH_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({ transaction: signedChallenge }),
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json());
    const auth = tokenJson.token;

    const formData = new FormData();
    loEach(
      {
        asset_code: assetCode,
        account: keypair.publicKey(),
        lang: 'en',
      },
      (value, key) => formData.append(key, value)
    );
    const interactive = await fetch(
      `${toml.TRANSFER_SERVER_SEP0024}/transactions/withdraw/interactive`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    ).then((r) => r.json());
    const urlBuilder = new URL(interactive.url);
    const popup = open(urlBuilder.toString(), 'popup', 'width=500,height=800');
    if (!popup) {
      throw new Error('Popups are blocked. You\'ll need to enable popups for this demo to work');
    }
    let currentStatus = 'incomplete';
    const transactionUrl = new URL(
      `${toml.TRANSFER_SERVER_SEP0024}/transaction?id=${interactive.id}`
    );
    while (!popup.closed && !['completed', 'error'].includes(currentStatus)) {
      const response = await fetch(transactionUrl.toString(), {
        headers: { Authorization: `Bearer ${auth}` },
      });
      const transactionJson = await response.json();
      if (transactionJson.transaction.status !== currentStatus) {
        currentStatus = transactionJson.transaction.status;
        popup.location.href = transactionJson.transaction.more_info_url;
        console.log(`Transaction ${interactive.id} is in ${transactionJson.transaction.status} status`);
        switch (currentStatus) {
          case 'pending_user_transfer_start': {
            console.log('The anchor is waiting for you to send the funds for withdrawal');
            console.log('Fetching account sequence number', keypair.publicKey());
            const { sequence } = await server
              .accounts()
              .accountId(keypair.publicKey())
              .call();

            console.log('Fetching account sequence number', sequence);
            const account = new StellarSdk.Account(keypair.publicKey(), sequence);
            const txn = new StellarSdk.TransactionBuilder(account, {
              fee: StellarSdk.BASE_FEE,
              networkPassphrase: StellarSdk.Networks.TESTNET,
            })
              .addOperation(
                StellarSdk.Operation.payment({
                  destination:
                    transactionJson.transaction.withdraw_anchor_account,
                  asset: new StellarSdk.Asset(assetCode, assetIssuer),
                  amount: transactionJson.transaction.amount_in,
                })
              )
              .addMemo(StellarSdk.Memo.text('memo'))
              .setTimeout(0)
              .build();
            txn.sign(keypair);
            console.log('Submitting withdrawal transaction to Stellar', txn);
            const horizonResponse = await server.submitTransaction(txn);
            console.log('Submitting withdrawal transaction to Stellar', horizonResponse);
            break;
          }
          case 'pending_anchor': {
            console.log('The anchor is processing the transaction');
            break;
          }
          case 'pending_stellar': {
            console.log('The Stellar network is processing the transaction')
            break;
          }
          case 'pending_external': {
            console.log('The transaction is being processed by an external system');
            break;
          }
          case 'pending_user': {
            console.log('The anchor is waiting for you to take the action described in the popup');
            break;
          }
          case 'error': {
            console.log('There was a problem processing your transaction');
            break;
          }
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(currentStatus);
    }
    console.log((`Transaction status: ${currentStatus}`));
    if (!['completed', 'error'].includes(currentStatus) && popup.closed) {
      console.log('The popup was closed before the transaction reached a terminal status, ' +
        'if your balance is not updated soon, the transaction may have failed.')
    }
  }
  // Deposer un ASSET
  async depositAsset() {
    const assetCode = 'KWB';
    // const assetIssuer = 'GAOYWB623PRJZBH3ZNB2SNGYRGYM2EUWX57BPQPIZJ4JPXBWFEDWW36X';
    const keypair = StellarSdk.Keypair.fromSecret(this.authService.getUser().stellarsecret);
    server.loadAccount(keypair.publicKey())
      .then(account => {
        this.account = account;
        console.log(this.account);
      });
    const homeDomain = 'http://localhost:8000/';
    const tomlURL = new URL(homeDomain);
    tomlURL.pathname = '/.well-known/stellar.toml';

    const toml =
      tomlURL.protocol === 'http:'
        ? await StellarSdk.StellarTomlResolver.resolve(tomlURL.host, { allowHttp: true })
        : await StellarSdk.StellarTomlResolver.resolve(tomlURL.host);
    const infoURL = `${toml.TRANSFER_SERVER_SEP0024}/info`;
    const info = await fetch(infoURL).then((r) => r.json());
    const authParams = { account: keypair.publicKey() };
    const getChallengeURL = new URL(toml.WEB_AUTH_ENDPOINT);
    getChallengeURL.searchParams.set('account', keypair.publicKey());
    const challengeResponse = await fetch(
      getChallengeURL.toString()
    ).then((r) => r.json());

    const transaction: any = new StellarSdk.Transaction(
      challengeResponse.transaction,
      challengeResponse.network_passphrase
    );
    transaction.sign(keypair);
    const jwtParams = { account: keypair.publicKey() };

    const signedChallenge = transaction.toXDR();
    const tokenResponse = await fetch(`${toml.WEB_AUTH_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({ transaction: signedChallenge }),
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json());
    const auth = tokenResponse.token;
    const formData = new FormData();
    const postDepositParams = {
      asset_code: assetCode,
      account: keypair.publicKey(),
      lang: 'en',
      claimable_balance_supported: true,
    };
    Object.keys(postDepositParams).forEach((key) => {
      formData.append(key, postDepositParams[key]);
    });
    let response = await fetch(
      `${toml.TRANSFER_SERVER_SEP0024}/transactions/deposit/interactive`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      }
    );
    const interactiveJson = await response.json();
    const popupUrl = new URL(interactiveJson.url);
    const popup = open(popupUrl.toString(), 'popup', 'width=500,height=800');
    if (!popup) {
      throw new Error('Popups are blocked. You’ll need to enable popups for this demo to work');
    }

    let currentStatus = 'incomplete';
    const transactionUrl = new URL(
      `${toml.TRANSFER_SERVER_SEP0024}/transaction?id=${interactiveJson.id}`
    );
    while (!popup.closed && !['completed', 'error'].includes(currentStatus)) {
      response = await fetch(transactionUrl.toString(), {
        headers: { Authorization: `Bearer ${auth}` },
      });
      let transactionJson = await response.json();
      if (transactionJson.transaction.status !== currentStatus) {
        currentStatus = transactionJson.transaction.status;
        popup.location.href = transactionJson.transaction.more_info_url;
        switch (currentStatus) {
          case 'pending_user_transfer_start': {
            break;
          }
          case 'pending_external': {
            break;
          }
          case 'pending_trust': {
            break;
          }
          case 'pending_user': {
            break;
          }
          case 'error': {
            break;
          }
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

}
