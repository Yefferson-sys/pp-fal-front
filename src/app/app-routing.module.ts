import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './Components/auth/auth.component';
import { AppointmentListComponent } from './Pages/appointment-list/appointment-list.component';
import { AssignAppointmentComponent } from './Pages/assign-appointment/assign-appointment.component';
import { DownloadResultsComponent } from './Pages/download-results/download-results.component';
import { EditAppointmentComponent } from './Pages/edit-appointment/edit-appointment.component';
import { HomeComponent } from './Pages/home/home.component';
import { NgInitComponent } from './Pages/ng-init/ng-init.component';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    path: 'ng-init',
    component: NgInitComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'assign-appointment',
    component: AssignAppointmentComponent
  },
  {
    path: 'appointment-list',
    component: AppointmentListComponent
  },
  {
    path: 'edit-appointment/:id',
    component: EditAppointmentComponent
  },
  {
    path: 'download-results',
    component: DownloadResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
