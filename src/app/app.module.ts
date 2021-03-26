import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { DatepickerModule, ToastModule, WavesModule } from 'ng-uikit-pro-standard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; 
import { NgxPaginationModule } from 'ngx-pagination';

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
import { DownloadResultsComponent } from './Pages/download-results/download-results.component';

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
    StaticModalsComponent,
    DownloadResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    DatepickerModule,
    ToastModule.forRoot(), 
    WavesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
