import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {  IMyOptions } from 'ng-uikit-pro-standard';
import { appointmentsShedule, dateAddDays } from 'src/app/Global/appointment.functions';
import { AppointmentsData, AppointmentShedule, Center, MedicalOffices } from 'src/app/Models/appointment-info.model';
import { Eps, Studio } from 'src/app/Models/assign-appointment.model';
import { OptionsModal } from 'src/app/Models/dynamic-modal.model';
import { People } from 'src/app/Models/user-profile.model';
import { AppointmentInfoService } from 'src/app/Services/Appointment-Info/appointment-info.service';

@Component({
  selector: 'app-appointment-info',
  templateUrl: './appointment-info.component.html',
  styleUrls: ['./appointment-info.component.scss']
})
export class AppointmentInfoComponent implements OnInit {
  /************************************************************************************** */
  /** -> Recepción de parámetros de componente padre */
  @Input() type: string;
  @Input() eps: Eps;
  @Input() studio: Studio;
  @Input() people: People;
  @Input() medicalOffices: Array<MedicalOffices>;
  @Input() appointmentShedule: Array<AppointmentShedule>;
  @Input() center: Center;
  @Input() optionsModal: OptionsModal;
  @Input() dateMax: string;
  @Input() medicalOfficesId: Array<any>;
  /************************************************************************************** */
  /** -> Envio de parámetros a componente padre */
  @Output() appointment = new EventEmitter<AppointmentShedule>();
  /************************************************************************************** */
  /** -> Declaración de variables */
  keys: any = {medicalOffices: 'medicaOffices', data: 'data'}
  model: string;
  myDatePickerOptions: IMyOptions = {
    dayLabels: {
      su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'
    },
    dayLabelsFull: {
      su: "Domingo", mo: "Lunes", tu: "Martes", we: "Miercoles", th: "Jueves", fr: "Viernes", sa: "Sábado"
    },
    monthLabels: { 
      1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' 
    },
    monthLabelsFull: { 
      1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre" 
    },
    disableUntil: { 
      year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+2 
    },
    todayBtnTxt: "Hoy",
    clearBtnTxt: "Limpiar",
    closeBtnTxt: "Cerrar",
    markDates: [
      {
        dates: [{year: 2021, month: 2, day: 20}, {year: 2016, month: 12, day: 16}],
        color: '#004198'
      },
      {
        dates: [{year: 2021, month: 2, day: 19}, {year: 2017, month: 11, day: 6}],
        color: 'green'
      }
    ], 
  };
  shedule: AppointmentShedule;
  /************************************************************************************** */
  /** -> Instanción de funciones, módulos y servicios para utilizar dentro de la clase */
  constructor(
    private appointmentInfosvc: AppointmentInfoService
  ) { }
  /************************************************************************************** */
  /** -> Función inicial  */
  ngOnInit(): void {
    let date = new Date();
    this.model =  dateAddDays(date, 3);
    this.myDatePickerOptions.disableSince = {
      year: 2021, month: 3, day: 24
    }
    //this.getAppointmentsByDay(this.model);
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.dateMax?.currentValue) {
      this.myDatePickerOptions.disableSince = {
        year: new Date(changes.dateMax.currentValue).getFullYear(), month: new Date(changes.dateMax.currentValue).getMonth()+1, day: new Date(changes.dateMax.currentValue).getDate()
      }
    }
  }
  /************************************************************************************** */
  /** -> Evento encargado de detección de cambio de fecha en datepicker.
   *  -> Yefferson Caleño 
   *  -> 03-03-2021
   * @param event 
   */
  onDateChange(event: any) {
    this.appointmentShedule = null;
    this.appointmentsShedule(event.actualDateFormatted);
  }
  onInputFocusBlur(event: any) {
    
  }
  /************************************************************************************** */
  /** -> Evento encargado de detección de confirmación de cita.
   *  -> Yefferson Caleño
   *  -> 04-03-2021
   * @param event 
   */
  onConfirm(event: any) {
    if(event == "ASIGNAR") {
      this.appointment.emit(this.shedule);
    }
  }
  onDenied(event: any) {
    console.log(event)
    setTimeout(() => {
      document.getElementById('assignApp').click();
    }, 100); 
  }
  /************************************************************************************** */
  /** -> Evento encargado de detección de selección de horario de cita.
   *  -> Yefferson Caleño
   *  -> 04-03-2021
   * @param shedule 
   */
  onAssignAppoinment(shedule: AppointmentShedule) {
    this.shedule = shedule
    if(this.type == 'ASIGNAR') {
      this.optionsModal = {
        header: "CONFIRMAR ASIGNACIÓN DE CITA",
        body: "¿Está seguro que desea asignar cita?",
      }
    } else {
      this.optionsModal = {
        header: "CONFIRMAR REASIGNACIÓN DE CITA",
        body: "¿Está seguro que desea reasignar cita?",
      }
    }
  }
  /************************************************************************************** */
  private getAppointmentsByDay(date: string) {
    this.appointmentInfosvc.getAppointmentsByDay(date).subscribe(
      success => {
        console.log(success);
       
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
   */
  private appointmentsShedule(onlyDate) {
    this.appointmentInfosvc.getAvailableDateGroups(onlyDate, this.medicalOfficesId).subscribe(
      success => {
        let availableDates: Array<AppointmentsData> = success[this.keys.data];
        availableDates.forEach((e, i) => {
          this.medicalOffices[i].MedicalOffices.availableDates = e.dates;
          this.medicalOffices[i].MedicalOffices.appointments = e.appointments;
          this.medicalOffices[i].MedicalOffices.medicalRestriction = e.medicalRestriction;
        })
        this.appointmentShedule = appointmentsShedule(onlyDate, this.medicalOffices, this.studio.average_time);
      },
      error => {
        console.error(error);
      }
    )
  }
  /***************************************************************************************** */
  
  /************************************************************************************** */
}
