import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


const API_URL = 'http://localhost:8080/api/test/';
const USER_URL = 'http://localhost:8080/api/users/';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(USER_URL + 'users');
  }

  getUserById(id: string): Observable<any>{
    return this.http.get(USER_URL + 'user/' + id);
  }

  deleteUser(id: any): Observable<any>{
    return  this.http.delete(USER_URL + 'user/' + id);
  }

  updateUser(id: any, data: any): Observable<any>{
    return this.http.put('${USER_URL}/user/${id}', data);
  }

  getStellarDetails(idCompte: any): Observable<any>{
   return this.http.get(USER_URL + 'stellar/' + idCompte);
  }

}
