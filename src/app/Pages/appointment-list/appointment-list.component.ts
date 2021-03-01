import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  optionsModal: any = {
    header: "CONFIRMAR CANCELACIÓN DE CITA",
    body: "Motivo de Cancelación de la cita:",
  }
  type: string = "CANCELAR";
  constructor() { }

  ngOnInit(): void {
  }

}
