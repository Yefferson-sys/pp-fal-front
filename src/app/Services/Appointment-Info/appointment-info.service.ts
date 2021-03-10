import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentInfoService {
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

  getAppointmentsByDay(date: string): Observable<any> {
    return this.http.post(this.api+'AppointmentStates/getAppointmentsByDay.json', {date}, this.httpHeaders);
  }

  getMedicalOfficesByStudio(studyId: string): Observable<any> {
    return this.http.post(this.api+'Appointments/getMedicalOfficesByService.json', {studyId}, this.httpHeaders);
  }

  getAvailableDateGroups(date: any, idGroup: any): Observable<any> {
    return this.http.post(this.api+'Appointments/getAvailableDateGroups.json', {date, idGroup}, this.httpHeaders);
  }

  getCenters(): Observable<any> {
    return this.http.get(this.api+'Centers/get.json', this.httpHeaders);
  }
}

