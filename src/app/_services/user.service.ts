import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// const USER_URL = 'http://localhost:8080/api/users/';
const USER_URL = 'https://kwaabo-user-api.herokuapp.com/api/users/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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
