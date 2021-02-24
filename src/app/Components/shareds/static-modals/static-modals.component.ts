import { Component, OnInit } from '@angular/core';
import { AlertOptions } from 'src/app/Models/auth.model';
import { AuthService } from 'src/app/Services/Auth/auth.service';

@Component({
  selector: 'app-static-modals',
  templateUrl: './static-modals.component.html',
  styleUrls: ['./static-modals.component.scss']
})
export class StaticModalsComponent implements OnInit {
  alertOptions: AlertOptions;
  recoveryIdentification: string = '';
  constructor(
    private authSvc: AuthService
  ) { }

  ngOnInit(): void {
  }

  onRecoveryPassword() {
    if(this.recoveryIdentification != '') {
      this.authSvc.getPassword(this.recoveryIdentification).subscribe(
        success => {
          this.alertOptions = {
            type: '',
            title: '',
            info: success['msg']
          }
          if(success['success']) {
            this.alertOptions.type = 'success';
            this.alertOptions.title = '¡Recuperación exitosa!'
          } else {
            this.alertOptions.type = 'danger';
            this.alertOptions.title = '¡Algo ha salido mal!'
          }
        },
        error => {
          console.error(error);
        }
      )
    } else {
      this.alertOptions = {
        type: 'warning',
        title: '¡Información incompleta!',
        info: 'Te falta diligenciar el campo <b>documento</b>'
      }
		}
  }

}
