import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { DatepickerModule, ToastModule, WavesModule } from 'ng-uikit-pro-standard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/blocks/header/header.component';
import { FooterComponent } from './Components/blocks/footer/footer.component';
import { NgInitComponent } from './Pages/ng-init/ng-init.component';
import { AuthComponent } from './Components/auth/auth.component';
import { HomeComponent } from './Pages/home/home.component';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { AssignAppointmentComponent } from './Pages/assign-appointment/assign-appointment.component';
import { AppointmentListComponent } from './Pages/appointment-list/appointment-list.component';
import { EditAppointmentComponent } from './Pages/edit-appointment/edit-appointment.component';
import { AppointmentInfoComponent } from './Components/shareds/appointment-info/appointment-info.component';
import { DynamicModalComponent } from './Components/shareds/dynamic-modal/dynamic-modal.component';
import { StaticModalsComponent } from './Components/shareds/static-modals/static-modals.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NgInitComponent,
    AuthComponent,
    HomeComponent,
    UserProfileComponent,
    AssignAppointmentComponent,
    AppointmentListComponent,
    EditAppointmentComponent,
    AppointmentInfoComponent,
    DynamicModalComponent,
    StaticModalsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DatepickerModule,
    ToastModule.forRoot(), 
    WavesModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
