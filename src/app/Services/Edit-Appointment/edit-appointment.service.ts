import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditAppointmentService {
  api: string = environment.apiUrl;
  httpHeaders: any;
  constructor(
    private http: HttpClient
  ) { 
    this.httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authgl': 'glbearer '+localStorage.getItem('token')
      })
    }
  }
  getAppointmentById(id: number): Observable<any> {
    return this.http.post(this.api+'Appointments/appointmentById.json', {id}, this.httpHeaders);
  } 
  getCenterById(id: number): Observable<any> {
    return this.http.post(this.api+'Centers/getSelectedCenters.json', {id}, this.httpHeaders);
  }
  getClientById(id: number): Observable<any> {
    return this.http.post(this.api+'clients/getClientSelected.json', {id}, this.httpHeaders);
  }
  getStudioById(clientId: number, rateId: number, studioId: number): Observable<any> {
    return this.http.post(this.api+'studies/studioById.json', {clientId, rateId, studioId}, this.httpHeaders);
  }
  updateAppointment(data: any): Observable<any> {
    return this.http.post(this.api+'Appointments/updateAppointment.json', data, this.httpHeaders);
  }
  updateAppointmentDates(eventsToUpdate: Array<any>, medicalOfficeId: number): Observable<any> {
    return this.http.post(this.api+'AppointmentDates/updateAppointmentDates.json', {eventsToUpdate, medicalOfficeId}, this.httpHeaders);
  }
}
