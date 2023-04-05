import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  signin(email: string, password: any): Observable<any> {
    const body = { email: email, password: password };
    return this.http.post(environment.url + '/signin', body)
  }

  register(email: string, password: any): Observable<any> {
    const body = { email: email, password: password };
    return this.http.post(environment.url + '/users/createuser', body)
  }
}
