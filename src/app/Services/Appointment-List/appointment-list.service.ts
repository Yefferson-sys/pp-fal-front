import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentListService {
  httpHeaders: any;
  api: string = environment.apiUrl;
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

  getAppointmentsList(identification: string, offset: number): Observable<any> {
    return this.http.post(this.api+'Appointments/getAppointmentsByIdentification.json', {identification, offset}, this.httpHeaders);
  }
  getInstructivedoc(id: number): Observable<any> {
    return this.http.post(this.api+'Instructives/getInstructiveDocuement.json', {id}, this.httpHeaders);
  }
  cancelAppointment(data: any): Observable<any> {
    return this.http.post(this.api+'AppointmentDates/cancelAppointmentDates.json', data, this.httpHeaders);
  }
  cancelReasons(data: any): Observable<any> {
    return this.http.post(this.api+'CancelReasons/cancelReasons.json', data, this.httpHeaders);
  }
}
