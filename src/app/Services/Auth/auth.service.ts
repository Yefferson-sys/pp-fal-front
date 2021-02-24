import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from 'src/app/Models/auth.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api: string = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }

  getAuth(auth: Auth) {
    return this.http.post(this.api+'WsUsers/userAuthenticate.json', auth);
  }

  getRegister(identification: string) {
    return this.http.post(this.api+'WsUsers/getEmailRegister.json', {identification});
  }

  getPassword(identification: string) {
    return this.http.post(this.api+'WsUsers/recoveryPassword.json', {identification});
  }
}
