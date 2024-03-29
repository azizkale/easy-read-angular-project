import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LugatService {
  constructor(private http: HttpClient) {}

  findWordMeaning(word: string): Observable<any> {
    return this.http.get(environment.url + `/getmeaning?word=${word}`);
  }
}
