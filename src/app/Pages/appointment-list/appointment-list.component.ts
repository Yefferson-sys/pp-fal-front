import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { Aldeamo, dateAddMinutes } from 'src/app/Global/appointment.functions';
import { Appointment } from 'src/app/Models/appointment-list.model';
import { People } from 'src/app/Models/user-profile.model';
import { AppointmentListService } from 'src/app/Services/Appointment-List/appointment-list.service';
import { AssignAppointmentService } from 'src/app/Services/Assign-Appointment/assign-appointment.service';
import { EditAppointmentService } from 'src/app/Services/Edit-Appointment/edit-appointment.service';
import { UserProfileService } from 'src/app/Services/User-Profile/user-profile.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  offset: number = 1;
  keys: any = {appointment: 'appointment', response: 'response', success: 'success', appointments: 'appointments', people: 'people'};
  appointments: Array<Appointment>;
  cancelInfo: any;
  people: People = {first_name: ''};
  optionsModal: any = {
    header: "CONFIRMAR CANCELACIÓN DE CITA",
    body: "Motivo de Cancelación de la cita:",
  }
  type: string = "CANCELAR";
  constructor(
    private appointmentListSvc: AppointmentListService,
    private toastSvc: ToastService,
    private assignAppointmentSvc: AssignAppointmentService,
    private userProfileSvc: UserProfileService,
    private editAppointmentSvc: EditAppointmentService
  ) { }

  ngOnInit(): void {
    this.getPeople();
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
  /** -> Función encarga de obtener la información de cita.
   *  -> Yefferson Caleño
   *  -> 15-03-2021
   * @param id 
   */
   private getAppointmentById(id: number) {
    this.editAppointmentSvc.getAppointmentById(id).subscribe(
      success => {
        this.sendSmsAldeamo(success[this.keys.appointment][0]);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de enviar mensajes de texto a paciente
   *  -> Yefferson Caleño
   *  -> 15-03-2021
   * @param appointment 
   */
   private sendSmsAldeamo(appointment: any) {
    let data = Aldeamo('CANCELA', this.people, appointment);
    this.assignAppointmentSvc.sendSmsAldeamo(data).subscribe(
      success => {
        console.log(JSON.parse(success[this.keys.response]));
      },
      error => {
        console.error(error);
      }
    )
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
          this.getAppointmentById(this.cancelInfo.appointments_id);
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
              case 4:
                  if(e.medical_office.id != 30) appointments.push(e);
                break;
            }
          })
          this.appointments = appointments;
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encarga de obtener la información del usuario.
   *  -> Yefferson Caleño
   *  -> 03-03-2021
   */
   private getPeople() {
    this.userProfileSvc.getPeople(localStorage.getItem('identification')).subscribe(
      success => {
        this.people = success[this.keys.people];
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
}
