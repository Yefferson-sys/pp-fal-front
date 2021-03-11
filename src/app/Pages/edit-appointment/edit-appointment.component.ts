import { Component, OnInit } from '@angular/core';
import { AppointmentShedule, Center, MedicalOffices } from 'src/app/Models/appointment-info.model';
import { Eps, Studio } from 'src/app/Models/assign-appointment.model';
import { OptionsModal } from 'src/app/Models/dynamic-modal.model';
import { People } from 'src/app/Models/user-profile.model';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.component.html',
  styleUrls: ['./edit-appointment.component.scss']
})
export class EditAppointmentComponent implements OnInit {
  type: string = "REASIGNAR";
  optionsModal: OptionsModal; 
  medicalOfficesId: Array<any> = [];
  center: Center = {name: ''};
  epsSelected: Eps = {name: ''};
  studio: Studio;
  people: People = {first_name: ''};
  medicalOffices: Array<MedicalOffices>;
  appointmentShedule: Array<AppointmentShedule>;
  constructor() { }

  ngOnInit(): void {
  }

  onAppointment(event) {
    
  }

}
