import { Component, Input, OnInit } from '@angular/core';
import {  IMyOptions } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-appointment-info',
  templateUrl: './appointment-info.component.html',
  styleUrls: ['./appointment-info.component.scss']
})
export class AppointmentInfoComponent implements OnInit {
  @Input() type: string;
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
  optionsModal: any = {
    header: "CONFIRMAR REASIGNACIÓN DE CITA",
    body: "¿Está seguro que desea reasignar cita?",
  }
  constructor() { }

  ngOnInit(): void {
    let date = new Date();
    this.model = this.formatDate(date);
    console.log(this.model)
  }

  private formatDate(date) {
    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + (d.getDate() + 2 ), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
