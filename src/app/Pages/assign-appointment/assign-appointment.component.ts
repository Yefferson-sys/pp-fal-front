import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { Aldeamo, appointmentsShedule, dateAddDays, dateAddMinutes, diffDate, subtractDate } from 'src/app/Global/appointment.functions';
import { AppointmentShedule, AppointmentsData, MedicalOffices, Center } from 'src/app/Models/appointment-info.model';
import { Appointment, Eps, Rateclient, Studio } from 'src/app/Models/assign-appointment.model';
import { OptionsModal } from 'src/app/Models/dynamic-modal.model';
import { Patient, People } from 'src/app/Models/user-profile.model';
import { AppointmentInfoService } from 'src/app/Services/Appointment-Info/appointment-info.service';
import { AssignAppointmentService } from 'src/app/Services/Assign-Appointment/assign-appointment.service';
import { EditAppointmentService } from 'src/app/Services/Edit-Appointment/edit-appointment.service';
import { UserProfileService } from 'src/app/Services/User-Profile/user-profile.service';

@Component({
  selector: 'app-assign-appointment',
  templateUrl: './assign-appointment.component.html',
  styleUrls: ['./assign-appointment.component.scss']
})
export class AssignAppointmentComponent implements OnInit {
  /************************************************************************************** 
   * -> Declaración de variables */
  activeCups: boolean = true;
  activateFields: boolean = true;
  type: string;
  dateMax: string;
  optionsModal: OptionsModal;
  keys: any = {message: 'message', response: 'response', center: 'center', order: 'order', patient: 'patient',appointmentList: 'appointmentList', result: 'result', clients: 'clients', people: 'people', services: 'services', studies: 'studies', success: 'success', rates: 'rates', medicalOffices: 'medicaOffices', data: 'data'};
  people: People = {first_name: ''};
  centers: Array<Center>;
  center: Center = {name: ''};
  selectCenter: string = '';
  eps: Array<Eps>;
  epsSelected: Eps = {name: ''};
  selectEps: string = '';
  CUPS: string = '';
  studies: Array<Studio>;
  studio: Studio;
  rates: Array<Rateclient>;
  medicalOffices: Array<MedicalOffices>;
  appointmentShedule: Array<AppointmentShedule>;
  availableDates: Array<AppointmentsData>;
  appointments: Array<Appointment>;
  patient: Patient;
  medicalOfficesId: Array<any> = [];
  dateSelected: string;
  orderInfo: any;
  fileName: string;
  files: FileList;
  /**************************************************************************************** */
  /** -> Instanción de funciones, módulos y servicios para utilizar dentro de la clase */
  constructor(
    private userProfileSvc: UserProfileService,
    private toastSvc: ToastService,
    private assignAppointmentSvc: AssignAppointmentService,
    private appointmentInfosvc: AppointmentInfoService,
    private editAppointmentSvc: EditAppointmentService,
    private router: Router
  ) { 
    this.getEpsList(); 
  }
  /***************************************************************************************** */
  /** -> Función inicial  */
  ngOnInit(): void {
    this.getPeople();
    this.getCenters();
    this.getAppointmentNotOrderList();
  }
  /***************************************************************************************** */
  /** -> Evento encargado de escuchar la selección de la eps (cliente).
   *  -> Yefferson Caleño
   *  -> 02-03-2021
   * @param event 
   */
  onSelectEps(event: any) {
    const options = {opacity: 1, enableHtml: true};
    this.epsSelected = this.eps[this.selectEps]; 
    this.toastSvc.info('Buscando información asociada a eps <b>'+this.epsSelected.name+'</b>...', '¡Un momento por favor!', options);
    this.getRatesByclient(this.epsSelected.id);
  }
  /***************************************************************************************** */
  /** -> Evento encargado de escuchar la selección de la sede.
   *  -> Yefferson Caleño
   *  -> 08-03-2021
   * @param event 
   */
  onSelectCenter(event: any) {
    this.center = this.centers[this.selectCenter];
  }
  /***************************************************************************************** */
  /** -> evento encargado de verificar los campos obligatorios para abrir modal.
   *  -> Yefferson Caleño
   *  -> 02-03-2021
   */
  onVerify() {
    const options = {opacity: 1, enableHtml: true};
    const verify = this.verify();
    if(verify) this.toastSvc.warning('Te falta diligenciar el campo <b>'+verify+'</b>', '¡Información incompleta!', options);
  }
  /***************************************************************************************** */
  /** -> Evento encargado de escuchar click en campo de estudio.
   *  -> Yefferson Caleño
   *  -> 02-03-2021
   */
  onClickCups() {
    this.CUPS = '';
  }
  /***************************************************************************************** */
  /** -> Evento encargado de escuchar la selección del estudio.
   *  -> Yefferson Caleño
   *  -> 02-03-2021
   * @param id 
   */
  onSelectCups(id: number) {
    this.studies.every(e => {
      if( parseInt(e.id) == id ) {
        this.studio = e;
        return false;
      }
      return true;
    })
    console.log(this.studio);
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.clear();
    switch (this.studio.cup) {
      case "877802":
      case "895100":  
          this.studio = null;
          this.onClickCups();
          this.toastSvc.warning('<b>Con los resultados de BUN y Creatinina</b>', '¡Este estudio deberá ser solicitado de manera presencial!', options);
        break;
      default:
          this.CUPS = this.studio.cup + ' ' + this.studio.name;
          this.getMedicalOfficesByStudio();
        break;
    }
  }
  /***************************************************************************************** */
  /** -> Evento encargado de recibir información de componente hijo
   *  -> Yefferson Caleño 
   *  -> 04-03-2021
   * @param event 
   */
  onAppointment(event: AppointmentShedule) {
    this.onClickCups();
    this.activeCups = false;
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.clear();
    this.toastSvc.info('guardando información de cita', '¡Un momento por favor!', options);
    let date = new Date();
    let appointment = {
      expected_date: dateAddDays(date, 0),
      medical_offices_id: event.consulting_room_id,
      observations: 'Asignación mediante portal personas',
      order_details_id: 12,
      studies_id: parseInt(this.studio.id),
      studies_value: 0,
      type: '1',
      clients_id: this.epsSelected.id
    }
    this.saveAppointment(event, appointment);
  }
  /***************************************************************************************** */
  /** -> Evento encargado de eliminar presolicitud de cita
   *  -> Yefferson Caleño
   *  -> 09-03-2021
   * @param appointment 
   */
  onDeleteAppointment(appointment: Appointment) {
    let conf = window.prompt('Por favor, digita ELIMINAR en mayúscula', '...');
    this.toastSvc.clear();
    if(conf == 'ELIMINAR') {
      this.onClickCups();
      this.deleteAppointment(appointment);
    }
  }
  /***************************************************************************************** */
  /** -> Evento encargado de organizar datos para guardado de orden.
   *  -> Yefferson Caleño
   *  -> 05-03-2021
   */
  onSaveOrder() {
    const options = {opacity: 1, enableHtml: true}
    if(this.files) {
      this.toastSvc.info('guardando solicitud', '¡Un momento por favor!', options);
      let saveOrder = {
        calculated_age: diffDate(this.people.birthdate, new Date(), 'Years').toFixed(2),
        centers_id: this.appointments[0].centers_id,             
        cie_ten_codes_id: 11803,    // default
        clients_id: this.appointments[0].clients_id,
        consultation_endings_id: 1, // default
        copayment: 0,               // default
        cost_centers_id: this.appointments[0].cost_center_id,
        discount: 0,                // default  
        donation: 0,                // default
        external_causes_id: 1,      // default
        external_specialists_id: 1, // default
        form_payment_id: 1,         // default
        id: 0,                      // default
        observations: "Orden guardada por paciente mediante portal personas",
        order_states_id: 1,         // default
        particular_payout: "",      // default
        patients_id: this.patient.id,
        rates_id: this.rates[0].rate.id,
        service_type_id: 5,         // default
        signature: "",              // default
        subtotal: 0,                // default
        total: 0,                   // default
        total_cancel: null,         // total a cancelar ??
        users_id: this.appointments[0].users_id,                
        validator: "portal personas"
      }
      this.saveOrder(saveOrder);
    } else {
      this.toastSvc.clear();
      this.toastSvc.warning('El campo <b>Adjuntar orden</b> no puede estar vacío.', '¡Información incompleta!', options);
    }
  }
  /***************************************************************************************** */
  /** -> Evento encargado de detectar confirmación de modal
   *  -> Yefferson Caleño
   *  -> 08-03-2021
   * @param event 
   */
  onConfirm(event: any) {
    switch (event) {
      case 'IR A HOME':
          this.router.navigate(['home']);
        break;
    }
  }
  /***************************************************************************************** */
  /** -> Evento encargado de detectar apertura de modal de información de cita
   *  -> Yefferson Caleño
   *  -> 08-03-2021
   * @param event 
   */
  onAssign() {
    this.type = "ASIGNAR";
  }
  /***************************************************************************************** */
  onNewAppointment() {
    if(this.appointments.length > 0) {
      let conf = window.prompt('Por favor, digita ELIMINAR en mayúscula', '...');
      if(conf == 'ELIMINAR') {
        this.onClickCups();
        this.deleteAppointments();
      }
    }
  }
  /***************************************************************************************** */
  onSelectOrder(event: any) {
    this.fileName = event.target.files[0].name;
    this.files = event.target.files;
  }
  /***************************************************************************************** */
  onOpenCups(file: string) {
    window.open(file, '_blank');
  }
  /***************************************************************************************** */
  private saveOrderDoc(orderId: number, order_consec: string) {
    if(this.files) {
      const options = {opacity: 1,enableHtml: true};
      this.toastSvc.info('Guardando documento ...', '¡Un momento por favor!', options);
      if(orderId && orderId != 0) {
        this.assignAppointmentSvc.saveOrderDoc({orderId}, this.files).subscribe(
          success => {
            this.toastSvc.clear();
            this.toastSvc.success("Tu número de solicitud es <b>"+order_consec+"</b>", "¡Guardado exitoso!", options);
            this.setVariables();
            setTimeout(()=> {this.router.navigate(['appointment-list'])}, 500);
          },
          error => {
            console.error(error);
          }
        )
      }
    }
  }
  /***************************************************************************************** */
  private deleteAppointments() {
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.info('Eliminando información de citas', '¡Un momento por favor!', options);
    
  }
  /***************************************************************************************** */
  private deleteAppointment(appointment: Appointment) {
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.info('Eliminando información de cita', '¡Un momento por favor!', options);
    this.assignAppointmentSvc.deleteAppointment(appointment.appointment_id).subscribe(
      success => {
        if(success[this.keys.success]) {
          this.toastSvc.clear();
          this.toastSvc.success("La cita se ha eliminado correctamente", "¡Eliminación exitosa!", options);
          this.getAppointmentNotOrderList();
        };
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada del guardado de la orden
   *  -> Yefferson Caleño
   *  -> 06-03-2021
   * @param order 
   */
  private saveOrder(order: any) {
    this.assignAppointmentSvc.saveOrder(order).subscribe(
      success => {
        const options = {opacity: 1, enableHtml: true};
        if(success[this.keys.success]) {
          this.saveOrderAppointment(success[this.keys.order]['id'], success[this.keys.order]['order_consec']);
        }  else {
          this.toastSvc.error("La orden no se ha guardado correctamente", "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de asociar las citas a la orden.
   *  -> Yefferson Caleño
   *  -> 06-03-2021
   * @param orderId 
   * @param order_consec 
   */
  private saveOrderAppointment(orderId: number, order_consec: string) {
    let appointmentsId: Array<any> = [];
    this.appointments.forEach((e)=> {
      appointmentsId.push(e.appointment_id);
    })
    this.assignAppointmentSvc.saveOrderAppointment(appointmentsId, orderId).subscribe(
      success => {
        const options = {opacity: 1, enableHtml: true};
        if(success[this.keys.success]) {
          this.sendSmsAldeamo();
          this.saveOrderDoc(orderId, order_consec);
        } else {
          this.toastSvc.error("La(s) citas no se han asociado a la orden correctamente", "¡Algo ha salido mal!", options);
        }
      }, 
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de enviar mensajes de texto a paciente
   *  -> Yefferson Caleño
   *  -> 09-03-2021
   */
  private sendSmsAldeamo() {
    let appointments: Array<Appointment> = this.appointments;
    appointments.forEach(e => {
      let data = Aldeamo('NUEVA', this.people, e), message = data.message;
      if(data.allowSendSMS == 1) { 
        data.message = data.message.split('informa NUEVA').join('recuerda');
        this.assignAppointmentSvc.sendSmsAldeamo(data).subscribe(
          success => {
            console.log(JSON.parse(success[this.keys.response]));
          },
          error => {
            console.error(error);
          }
        )
      }
      data.allowSendSMS = 0;
      data.message = message;
      data.dateSchedule = dateAddMinutes(new Date(), 0);
      this.assignAppointmentSvc.sendSmsAldeamo(data).subscribe(
        success => {
          console.log(JSON.parse(success[this.keys.response]));
        },
        error => {
          console.error(error);
        }
      )
    })
  }
  /***************************************************************************************** */
  /** -> Función encargada de listar las citas que no tienen orden asociadas (sin guardar).
   *  -> Yefferson Caleño
   *  -> 05-03-2021
   */
  private getAppointmentNotOrderList() {
    this.assignAppointmentSvc.getAppointmentNotOrderList().subscribe(
      success => {
        this.appointments = success[this.keys.appointmentList].reverse();
        if (this.appointments.length > 0) {
          this.activateFields = false;
          this.getRatesByclient(this.appointments[0].clients_id);
          this.getCenterById(this.appointments[0].centers_id);
          this.getclientById(this.appointments[0].clients_id);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de guardado de cita.
   *  -> Yefferson Caleño
   *  -> 05-03-2021
   * @param event 
   * @param appointment 
   */
  private saveAppointment(event: AppointmentShedule, appointment: any) {
    this.assignAppointmentSvc.saveAppointment(appointment).subscribe(
      success => {
        const options = {opacity: 1, enableHtml: true};
        if(success[this.keys.success]) {
          let appointmentDates = {
            appointment_states_id: 1,
            appointments_id: success['appointment']['id'],
            date_time_end: dateAddMinutes(new Date(event.date), this.studio.average_time),
            date_time_ini: event.date,
            medical_offices_id: event.consulting_room_id
          }
          this.toastSvc.clear();
          this.toastSvc.info('guardando fechas de cita', '¡Un momento por favor!', options);
          this.saveAppointmentDates(success['appointment']['id'], appointmentDates);
        } else {
          this.toastSvc.error("<b>"+success[this.keys.message]+"</b>", "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de guardado de fecha de cita.
   *  -> Yefferson Caleño
   *  -> 05-03-2021
   * @param appointmentId
   */
  private saveAppointmentDates(appointmentId, appointmentDates) {
    this.assignAppointmentSvc.saveAppointmentDates(appointmentDates).subscribe(
      success => {
        console.log(success);
        const options = {opacity: 1, enableHtml: true};
        if(success[this.keys.success]) {
          this.toastSvc.clear();
          this.toastSvc.info('guardando productos o servicios adicionales realacionados', '¡Un momento por favor!', options);
          this.saveAppointmentSupplies(appointmentId, appointmentDates.date_time_ini.split(' ')[0]);
        } else {
          this.toastSvc.error("La fecha de la cita no se ha guardado correctamente", "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de guardado de guardar los productos o servicios adicionales realacionados..
   *  -> Yefferson Caleño 
   *  -> 05-03-2021
   * @param appointmentId 
   * @param onlyDate 
   */
  private saveAppointmentSupplies(appointmentId: number, onlyDate: string) {
    this.assignAppointmentSvc.saveAppointmentSupplies(appointmentId).subscribe(
      success => {
        console.log(success);
        const options = {opacity: 1, enableHtml: true};
        if(success[this.keys.success]) {
          this.toastSvc.clear();
          this.toastSvc.success("La cita se ha guardado correctamente", "¡Guardado exitoso!", options);
          this.getAppointmentNotOrderList();
          this.activeCups = true;
          this.dateSelected = onlyDate;
        } else {
          this.toastSvc.error("Los productos o servicios adicionales realacionados no se ha guardado correctamente", "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener los consultorios mediante el id del estudio seleccionado
   *  -> Yefferson Caleño
   *  -> 02-03-2021
   */
  private getMedicalOfficesByStudio() {
    this.appointmentInfosvc.getMedicalOfficesByStudio(this.studio?.id).subscribe(
      success => {
        console.log(success[this.keys.medicalOffices]);
        this.medicalOffices = success[this.keys.medicalOffices];
        if(this.medicalOfficesId.length == 0) {
          this.medicalOffices.forEach((e)=> {
            this.medicalOfficesId.push(e.MedicalOffices.id);
          })  
        }
        let date = new Date(), onlyDate = (this.dateSelected)? this.dateSelected: dateAddDays(date, 3);
        this.getAvailableDateGroups(onlyDate, this.medicalOfficesId);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener y asignar el rango de fecha disponible para cada consultorio
   *  -> Yefferson Caleño
   *  -> 04-03-2021
   * @param onlyDate 
   * @param medicalOfficesId 
   */
  private getAvailableDateGroups(onlyDate, medicalOfficesId) {
    this.dateMax = onlyDate;
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
        console.log(onlyDate)
        this.appointmentShedule = appointmentsShedule(onlyDate, this.medicalOffices, this.studio.average_time);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener las tarifas por cliente.
   *  -> Yefferson Caleño
   *  -> 02-03-2021
   * @param id 
   */
  private getRatesByclient(id: number) {
    this.assignAppointmentSvc.getRatesByclient(id).subscribe(
      success => {
        if(success[this.keys.success]) {
          this.rates = success[this.keys.rates];
          this.getStudiesList(id, this.rates[0].rate.id);
        }
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encargada de obtener el listado de estudios asociados al cliente y tarifa seleccionado.
   *  -> Yefferson Caleño
   *  -> 03-03-2021
   * @param clientId 
   * @param rateId 
   */
  private getStudiesList(clientId: number, rateId: number) {
    this.studies = null;
    this.assignAppointmentSvc.getStudiesList(clientId, rateId).subscribe(
      success => {
        console.log(success[this.keys.studies]);
        this.studies = success[this.keys.studies];
        this.toastSvc.clear();
        const options = {opacity: 1, enableHtml: true};
        this.toastSvc.clear();
        if(this.appointments.length == 0) this.toastSvc.success("<b>Ya puedes ingresar el código CUPS</b>", "¡Busqueda exitosa!", options) 
        else this.toastSvc.success("<b>Ya puedes continuar con tu solicitud</b>", "¡Busqueda exitosa!", options); 
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función cargada de verificar el llenado de los campos de entidad y estudio. 
   *  -> Yefferson Caleño.
   *  -> 02-03-2021
   */
  private verify() {
    if(this.epsSelected.name == '') {
      return 'Entidad';
    }
    if(this.center.name == '') {
      return 'Sede';
    }
    if(!this.studio) {
      return 'Código CUPS';
    }
    return false;
  }
  /***************************************************************************************** */
  /** -> Función encarga de obtener el listado de eps(clientes).
   *  -> Yefferson Caleño
   *  -> 03-03-2021
   */
  private getEpsList() {
    this.assignAppointmentSvc.getEpsList().subscribe(
      success => {
        if(success[this.keys.success]) {
          this.eps = success[this.keys.clients];
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
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.info('<b>Buscando información</b> ...', '¡Un momento por favor!', options); 
    this.userProfileSvc.getPeople(localStorage.getItem('identification')).subscribe(
      success => {
        this.people = success[this.keys.people];
        this.getPatient(this.people.id);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función encarga de obtener la información del usuario.
   *  -> Yefferson Caleño
   *  -> 06-03-2021
   * @param peopleId 
   */
  private getPatient(peopleId: number) {
    this.userProfileSvc.getPatient(peopleId).subscribe(
      success => {
        if(success[this.keys.success]) this.patient = success[this.keys.patient];
      }, 
      error => {
        console.error(error);
        
      }
    )
  }
  /***************************************************************************************** */
  /** -> Función engargada de obtener la información de las sedes.
   *  -> Yefferson Caleño
   *  -> 08-03-2021
   */
  private getCenters() {
    this.appointmentInfosvc.getCenters().subscribe(
      success => {
        if(success[this.keys.success]) this.centers = success[this.keys.center];
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
  /** -> Función encargada de setear variables generales.
   *  -> Yefferson Caleño
   *  -> 08-03-2021
   */
  private setVariables() {
    this.activeCups = true;
    this.activateFields = true;
    this.type = "ASIGNAR";
    this.optionsModal = null;
    this.people = {first_name: ''};
    this.centers = null;
    this.center = {name: ''};
    this.selectCenter = '';
    this.eps = null;
    this.epsSelected = {name: ''};
    this.selectEps = '';
    this.CUPS = '';
    this.studies = null;
    this.studio = null;
    this.rates = null;
    this.medicalOffices = null;
    this.appointmentShedule = null;
    this.availableDates = null;
    this.appointments = null;
    this.patient = null;
    this.fileName = null;
    this.files = null;
  }
  /***************************************************************************************** */
}
