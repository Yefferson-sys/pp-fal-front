import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DatepickerModule, WavesModule } from 'ng-uikit-pro-standard';

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
    AppointmentListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DatepickerModule, 
    WavesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
