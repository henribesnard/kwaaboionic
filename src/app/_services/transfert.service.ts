import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'https://kwaabo-user-api.herokuapp.com/api/payement/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  constructor(private http: HttpClient) { }
  payement(montant: string, frais: string, destinateurId: string, beneficiaireId: string, commentaire: string): Observable<any> {
    return this.http.post(API_URL + 'ajoutpayement', {
      montant,
      frais,
      destinateurId,
      beneficiaireId,
      commentaire
    }, httpOptions)
    ;
  }
}
