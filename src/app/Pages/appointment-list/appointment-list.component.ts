import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { dateAddMinutes } from 'src/app/Global/appointment.functions';
import { Appointment } from 'src/app/Models/appointment-list.model';
import { AppointmentListService } from 'src/app/Services/Appointment-List/appointment-list.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  offset: number = 1;
  keys: any = {success: 'success', appointments: 'appointments'};
  appointments: Array<Appointment>;
  cancelInfo: any;
  optionsModal: any = {
    header: "CONFIRMAR CANCELACIÓN DE CITA",
    body: "Motivo de Cancelación de la cita:",
  }
  type: string = "CANCELAR";
  constructor(
    private appointmentListSvc: AppointmentListService,
    private toastSvc: ToastService
  ) { }

  ngOnInit(): void {
    this.appointmentsList(localStorage.getItem('identification'), this.offset);
  }
  onPreviousList() {
    if(this.offset != 1) {
      this.offset --;
      this.appointmentsList(localStorage.getItem('identification'), this.offset);
    }
  }
  onNextList() {
    if(this.appointments.length > 0) {
      this.offset ++;
      this.appointmentsList(localStorage.getItem('identification'), this.offset);
    }
  }
  onConfirm(event: any) {
    const options = {opacity: 1,enableHtml: true};
    switch (event) {
      case "CANCELAR":
          if(document.getElementById('description')['value']) {
            this.toastSvc.clear();
            this.toastSvc.info('Un momento por favor ...', '!Cancelando cita!' , options);
            this.cancelAppointment();
          } else {
            this.toastSvc.warning('<b>Debes indicar porque deseas cancelar la cita</b>', '¡Información incompleta!', options);
          }
        break;
    }
  }
  onCancelAppointment(appointment: Appointment) {
    this.cancelInfo = {
      appointment_states_id: 4,
      appointments_id: appointment._matchingData.OrderAppointments.appointments_id,
      date_time_end: dateAddMinutes(new Date(appointment._matchingData.AppointmentDates.dateTimeEnd), 0),
      date_time_ini: dateAddMinutes(new Date(appointment._matchingData.AppointmentDates.dateTimeIni), 0),
      medical_offices_id: appointment.medical_offices_id,
      type_study: appointment.study.type_study
    }
  }
  /***************************************************************************************** */
  private cancelAppointment() {
    this.appointmentListSvc.cancelAppointment(this.cancelInfo).subscribe(
      success => {
        if(success[this.keys.success]) this.cancelReasons(this.cancelInfo.appointments_id);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  private cancelReasons(appointmentId: number) {
    const options = {opacity: 1,enableHtml: true};
    let cancelInfo = {
      appointment_dates_id: appointmentId,
      content: document.getElementById('description')['value'],
      userCancel: "paciente"
    }
    this.appointmentListSvc.cancelReasons(cancelInfo).subscribe(
      success => {
        if(success[this.keys.success]) {
          this.toastSvc.clear();
          this.toastSvc.success('Tú cita se ha cancelado exitosamente', '¡Cancelación exitosa!', options);
          this.appointmentsList(localStorage.getItem('identification'), this.offset);
        };
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> función encargada de listar todas las citas del paciente.
   *  -> Yefferson Caleño
   *  -> 10-03-2021
   * @param identification 
   */
  private appointmentsList(identification: string, offset: number) {
    this.appointments = null;
    this.appointmentListSvc.getAppointmentsList(identification, offset).subscribe(
      success => {
        if(success[this.keys.success]) {
          let appointments: Array<Appointment> = [];
          success[this.keys.appointments].forEach(e => {
            switch (e._matchingData.AppointmentStates.id) {
              case 1:
              case 2:
                  appointments.push(e);
                break;
            }
          })
          this.appointments = appointments;
          console.log(this.appointments);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
}
