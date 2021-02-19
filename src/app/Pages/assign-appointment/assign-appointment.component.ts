import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-appointment',
  templateUrl: './assign-appointment.component.html',
  styleUrls: ['./assign-appointment.component.scss']
})
export class AssignAppointmentComponent implements OnInit {
  type: string = "ASIGNAR";
  constructor() { }

  ngOnInit(): void {
    
  }
}
