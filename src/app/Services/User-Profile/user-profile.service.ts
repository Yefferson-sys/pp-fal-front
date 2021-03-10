import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { People } from 'src/app/Models/user-profile.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  api: string = environment.apiUrl;
  httpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'authgl': 'glbearer '+localStorage.getItem('token')
    })  
  }
  constructor(
    private http: HttpClient
  ) { }
  getData(): Observable<any> {
    return this.http.get(this.api+'General/getAllData.json', this.httpHeaders);
  }
  getPeople(id: string): Observable<any> {
    return this.http.post(this.api+'WsUsers/getPeople.json', {id}, this.httpHeaders);
  }
  getPatient(peopleId: number): Observable<any>  {
    return this.http.post(this.api+'WsUsers/getPatient.json', {peopleId}, this.httpHeaders);
  }
  getPhoto(id: string): Observable<any> {
    return this.http.post(this.api+'Orders/getPhotoPeople.json', {id}, this.httpHeaders);
  }
  getDocument(peopleId: string): Observable<any> {
    return this.http.post(this.api+'Orders/getPatientID.json', {peopleId}, this.httpHeaders);
  }
  updateDocument(data: any, file: File): Observable<any> {
    let payload = new FormData();
    let httpHeaders = {
      headers: new HttpHeaders({
        'authgl': 'glbearer '+localStorage.getItem('token')
      })
    }
    payload.append('file', file);
    payload.append('data', JSON.stringify(data));
    return this.http.post(this.api+'Orders/saveIdPeople.json', payload, httpHeaders);
  }
  updatePeopleInfo(people: People): Observable<any> {
    return this.http.post(this.api+'people/edit.json', people, this.httpHeaders);
  }
  updateUserInfo(people: People): Observable<any> {
    return this.http.post(this.api+'WsUsers/updateUserInfo.json', people, this.httpHeaders);
  }
  updatePhoto(data: any, file: File) {
    let payload = new FormData();
    let httpHeaders = {
      headers: new HttpHeaders({
        'authgl': 'glbearer '+localStorage.getItem('token')
      })
    }
    payload.append('file', file);
    payload.append('data', JSON.stringify(data));
    return this.http.post(this.api+'Orders/savePhotoPeople.json', payload, httpHeaders);
  }
  deleteDocument(peopleId: number, resourceId: number): Observable<any> {
    return this.http.post(this.api+'Orders/dropIDPatient.json', {peopleId, resourceId}, this.httpHeaders);
  }
}
