import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aldeamo } from 'src/app/Models/appointment-info.model';
import { Appointment } from 'src/app/Models/assign-appointment.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignAppointmentService {
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
  getEpsList(): Observable<any> {
    return this.http.get(this.api+'clients/getEnable.json', this.httpHeaders);
  }
  getStudiesList(clientId: number, rateId: number): Observable<any> {
    return this.http.post(this.api+'studies/studiesList.json', {clientId, rateId}, this.httpHeaders);
  }
  getRatesByclient(id: number): Observable<any> {
    return this.http.post(this.api+'RatesClients/getByClient.json', {id}, this.httpHeaders);
  }
  getAppointmentNotOrderList(): Observable<any> {
    return this.http.get(this.api+'Appointments/appointmentNotOrderList.json', this.httpHeaders);
  }
  saveAppointment(appointment: Appointment): Observable<any> {
    return this.http.post(this.api+'Appointments/saveAppointment.json', appointment, this.httpHeaders);
  }
  saveAppointmentDates(appointmentDates: any): Observable<any> {
    return this.http.post(this.api+'AppointmentDates/saveAppointmentDates.json', appointmentDates, this.httpHeaders);
  }
  saveAppointmentSupplies(id: number): Observable<any> {
    return this.http.post(this.api+'AppointmentsSupplies/add.json', {id}, this.httpHeaders);
  } 
  saveOrder(order: any): Observable<any> {
    return this.http.post(this.api+'Orders/saveOrder.json', order, this.httpHeaders);
  }
  saveOrderAppointment(appointments_ids: Array<any>, order_details_id: number) {
    return this.http.post(this.api+'Orders/saveOrderAppointment.json', {appointments_ids, order_details_id}, this.httpHeaders);
  }
  sendSmsAldeamo(data: Aldeamo): Observable<any> {
    return this.http.post(this.api+'Appointments/sendSMSAppoinment.json', {data}, this.httpHeaders);
  }
  deleteAppointment(id: number) {
    return this.http.post(this.api+'Appointments/deleteAppointment.json', {id}, this.httpHeaders);
  }
}
