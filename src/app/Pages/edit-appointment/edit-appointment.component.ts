import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { Aldeamo, appointmentsShedule, dateAddDays, dateAddMinutes } from 'src/app/Global/appointment.functions';
import { AppointmentsData, AppointmentShedule, Center, MedicalOffices } from 'src/app/Models/appointment-info.model';
import { Appointment, Eps, Rateclient, Studio } from 'src/app/Models/assign-appointment.model';
import { OptionsModal } from 'src/app/Models/dynamic-modal.model';
import { People } from 'src/app/Models/user-profile.model';
import { AppointmentInfoService } from 'src/app/Services/Appointment-Info/appointment-info.service';
import { AssignAppointmentService } from 'src/app/Services/Assign-Appointment/assign-appointment.service';
import { EditAppointmentService } from 'src/app/Services/Edit-Appointment/edit-appointment.service';
import { UserProfileService } from 'src/app/Services/User-Profile/user-profile.service';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss']
})
export class EditAppointmentComponent implements OnInit {
  keys: any = {response: 'response', data: 'data', medicalOffices: 'medicaOffices', studio: 'studio', rates: 'rates', clients: 'clients', success: 'success', people: 'people', appointment: 'appointment', center: 'center'};
  type: string = "REASIGNAR";
  dateMax: string;
  optionsModal: OptionsModal; 
  medicalOfficesId: Array<any> = [];
  center: Center = {name: ''};
  epsSelected: Eps = {name: ''};
  studio: Studio;
  rates: Array<Rateclient>;
  people: People = {first_name: ''};
  medicalOffices: Array<MedicalOffices>;
  appointmentShedule: Array<AppointmentShedule>;
  appointment: Appointment;
  availableDates: Array<AppointmentsData>;
  constructor(
    private toastSvc: ToastService,
    private userProfileSvc: UserProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private editAppointmentSvc: EditAppointmentService,
    private assignAppointmentSvc: AssignAppointmentService,
    private appointmentInfosvc: AppointmentInfoService
  ) { 
    this.getPeople();
    this.getAppointmentById(parseInt(this.route.snapshot.paramMap.get('id')));
  }

  ngOnInit(): void {
  }

  onAppointment(event: AppointmentShedule) {
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.info('<b>Reasignando cita ...</b>', '¡Un momento por favor!', options); 
    let reasignInfo: any = {
       expected_date: dateAddDays(new Date(), 0),
       id: this.appointment.appointment_id,
       medical_offices_id: event.consulting_room_id,
       observations: "Asignación mediante portal personas",
       order_details_id: 12,
       studies_value: 10,
       type: 1 // Si cita es pedida presencial(1) o por telefono(2).
    }
    this.updateAppointment(event, reasignInfo);
  }
  /***************************************************************************************** */
  /** -> Función encargada de enviar mensajes de texto a paciente
   *  -> Yefferson Caleño
   *  -> 15-03-2021
   * @param appointment 
   */
   private sendSmsAldeamo(appointment: any) {
    let data = Aldeamo('REASIGNA', this.people, appointment);
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
  private updateAppointmentDates(reasignDateInfo: Array<any>, medicalOfficesId: number) {
    const options = {opacity: 1, enableHtml: true};
    this.editAppointmentSvc.updateAppointmentDates(reasignDateInfo, medicalOfficesId).subscribe(
      success => {
        if(success[this.keys.success]) {
          let appointment: any = {
            centers_id: this.appointment.centers_id,
            cost_center: this.appointment.cost_center,
            date_time_ini: reasignDateInfo[0].start              
          };
          this.sendSmsAldeamo(appointment);
          this.toastSvc.clear();
          this.toastSvc.success("La cita se ha editado correctamente", "¡Edición exitosa!", options);
          setTimeout(() => {
            this.router.navigate(['appointment-list']);
          }, 2000);
        } else {
          this.toastSvc.error("La cita no se ha editado correctamente", "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  private updateAppointment(event: AppointmentShedule, reasignInfo: any) {
    this.editAppointmentSvc.updateAppointment(reasignInfo).subscribe(
      success => {
        if(success[this.keys.success]) {
          let reasignDateInfo: Array<any> = [{
              checkForEdition: true,
              end: dateAddMinutes(new Date(event.date), this.studio.average_time),
              id: this.appointment.appointment_dates_id,
              medicalOfficeId: event.consulting_room_id,
              start: event.date,
              type_study: this.studio.type_study
          }];
          this.updateAppointmentDates(reasignDateInfo, this.appointment.medical_offices_id);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener y asignar el rango de fecha disponible para cada consultorio
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   * @param onlyDate 
   * @param medicalOfficesId 
   */
   private getAvailableDateGroups(onlyDate, medicalOfficesId) {
    this.dateMax = onlyDate;
    const options = {opacity: 1, enableHtml: true};
    this.appointmentInfosvc.getAvailableDateGroups(onlyDate, medicalOfficesId).subscribe(
      success => {
        this.availableDates = success[this.keys.data];
        this.availableDates.forEach((e, i) => {
          if(e.dates.medicalOfficeId != 30 && new Date(this.dateMax) < new Date(e.dates.dateEnd)) {
            this.dateMax = e.dates.dateEnd;
          }
          this.medicalOffices[i].MedicalOffices.availableDates = e.dates;
          this.medicalOffices[i].MedicalOffices.appointments = e.appointments;
          this.medicalOffices[i].MedicalOffices.medicalRestriction = e.medicalRestriction;
        })
        this.appointmentShedule = appointmentsShedule(onlyDate, this.medicalOffices, this.studio.average_time);
        this.toastSvc.clear();
        this.toastSvc.success("<b>Ya puedes continuar con el proceso.</b>", "¡Busqueda exitosa!", options); 
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener los consultorios mediante el id del estudio seleccionado
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   */
   private getMedicalOfficesByStudio() {
    this.appointmentInfosvc.getMedicalOfficesByStudio(this.studio?.id).subscribe(
      success => {
        this.medicalOffices = success[this.keys.medicalOffices];
        if(this.medicalOfficesId.length == 0) {
          this.medicalOffices.forEach((e)=> {
            this.medicalOfficesId.push(e.MedicalOffices.id);
          })  
        }
        let date = new Date(), onlyDate = dateAddDays(date, 3);
        this.getAvailableDateGroups(onlyDate, this.medicalOfficesId);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener información de estudio asociado a cita.
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   * @param clientId 
   * @param rateId 
   */
   private getStudioById(clientId: number, rateId: number, id: number) {
    this.studio = null;
    this.editAppointmentSvc.getStudioById(clientId, rateId, id).subscribe(
      success => {
        this.studio = success[this.keys.studio][0];
        this.getMedicalOfficesByStudio();
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener las tarifas por cliente.
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   * @param clientId 
   */
  private getRatesByclient(clientId: number) {
    this.assignAppointmentSvc.getRatesByclient(clientId).subscribe(
      success => {
        if(success[this.keys.success]) {
          this.rates = success[this.keys.rates];
          this.getStudioById(clientId, this.rates[0].rate.id, this.appointment.studies_id);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  
  /***************************************************************************************** */
  /** -> Función encarga de obtener la información de cliente.
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   * @param id 
   */
  private getclientById(id: number) {
    this.editAppointmentSvc.getClientById(id).subscribe(
      success => {
        if(success[this.keys.success]) {
          this.epsSelected = success[this.keys.clients][0];
          this.getRatesByclient(id);
        };
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encarga de obtener la información de sede.
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   * @param id 
   */
  private getCenterById(id: number) {
    this.editAppointmentSvc.getCenterById(id).subscribe(
      success => {
        if(success[this.keys.success]) this.center = success[this.keys.center];
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encarga de obtener la información de cita.
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   * @param id 
   */
  private getAppointmentById(id: number) {
    this.editAppointmentSvc.getAppointmentById(id).subscribe(
      success => {
        this.appointment = success[this.keys.appointment][0];
        this.getCenterById(<number>this.appointment.centers_id);
        this.getclientById(<number>this.appointment.clients_id);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encarga de obtener la información del usuario.
   *  -> Yefferson Caleño
   *  -> 11-03-2021
   */
   private getPeople() {
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.info('<b>Buscando información</b> ...', '¡Un momento por favor!', options); 
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
