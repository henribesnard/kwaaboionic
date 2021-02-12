import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
const AUTH_API = 'https://kwaabo-user-api.herokuapp.com/api/auth/';
// const AUTH_API = 'http://localhost:8080/api/auth/';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    decodedToken: { [key: string]: string };
    public currentUser: Observable<any>;
    isTokenExpire = true;
  constructor(private http: HttpClient,
              private router: Router) {}
// SAUVEGARGE DU TOKEN DU USER
public saveToken(token: string ): void {
localStorage.removeItem(TOKEN_KEY);
localStorage.setItem(TOKEN_KEY, token);
}

// OBTENIR LE TOKEN DU USER
public getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// SAUVEGARDE DU USER
public saveUser(user: any): void {
  localStorage.removeItem(USER_KEY);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// OBTENIR UN USER
public  getUser(){
  const user = localStorage.getItem(USER_KEY);
  if (user) {
    return JSON.parse( user);
  }

  return {};
}
// DECODE LE TOKEN OBTENU
public decodeToken() {
  if (this.getToken()) {
    this.decodedToken = jwt_decode(this.getToken());
  }
}
// OBTENIR LE TOKEN DECODE
public getDecodedToken(){
  return jwt_decode(this.getToken());
}

// OBTENIR LE TEMPS D'EXPIRATION DU TOKEN
public getExpiryTime(){
  this.decodeToken();
  return this.decodedToken ? this.decodedToken.exp : null;
}

// VERIFIER L'EXPIRATION DU TOKEN
isTokenExpired() {
  const expiryTime: number =  Number(this.getExpiryTime());
  if (((1000 * expiryTime) - (new Date()).getTime()) < 5000) {
    this.isTokenExpire = true;
  } else {
    this.isTokenExpire = false;
  }
}


// CONNEXION DU USER
login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
}

// DECONNEXION DU USER
logout() {
  localStorage.clear();
  this.router.navigate(['login']);
  this.isTokenExpire = true;
}

// ENREGISTREMENT USER
register(nom: string, prenom: string, email: string, mot_de_passe: string, stellarid: string, stellarsecret: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      nom,
      prenom,
      email,
      mot_de_passe,
      stellarid,
      stellarsecret
    }, httpOptions)
    ;
}

}
