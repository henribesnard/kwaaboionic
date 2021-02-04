import { Component, OnInit } from '@angular/core';
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {

  constructor() { }

  async ngOnInit() {
    const homeDomain = 'http://localhost:8000/';
    const tomlURL = new URL(homeDomain);
    tomlURL.pathname = '/.well-known/stellar.toml';
    const toml =
      tomlURL.protocol === 'http:'
      ? await StellarSdk.StellarTomlResolver.resolve(tomlURL.host, { allowHttp: true })
      : await StellarSdk.StellarTomlResolver.resolve(tomlURL.host);
    const infoURL = `${toml.TRANSFER_SERVER_SEP0024}/info`;
    const info = await fetch(infoURL).then((r) => r.json());
    const authParams = { account: 'public key' };
    const getChallengeURL = new URL(toml.WEB_AUTH_ENDPOINT);
    getChallengeURL.searchParams.set('account', 'public key');
    const challengeResponse = await fetch(
      getChallengeURL.toString()
    ).then((r) => r.json());
    const transaction: any = new StellarSdk.Transaction(
      challengeResponse.transaction,
      challengeResponse.network_passphrase
    );
    const keypair = StellarSdk.Keypair.fromSecret('secret key');
    transaction.sign(keypair);
    const jwtParams = { account: 'public key' };
    const signedChallenge = transaction.toXDR();
    const tokenResponse = await fetch(`${toml.WEB_AUTH_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify({ transaction: signedChallenge }),
      headers: { 'Content-Type': 'application/json' },
    }).then((r) => r.json());
    const auth = tokenResponse.token;
    const formData = new FormData();
    const postDepositParams = {
      asset_code: 'KWB',
      account: 'public key',
      lang: 'en',
      claimable_balance_supported: true,
    };
    Object.keys(postDepositParams).forEach((key) => {
      formData.append(key, postDepositParams[key])
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

  }

}
