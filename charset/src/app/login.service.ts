import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { 
  }

  getDados() : Observable<any> {
    return this._http.get('http://192.168.30.212:5000/propostas');
  }
}
