import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './Components/auth/auth.component';
import { AppointmentListComponent } from './Pages/appointment-list/appointment-list.component';
import { AssignAppointmentComponent } from './Pages/assign-appointment/assign-appointment.component';
import { HomeComponent } from './Pages/home/home.component';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
