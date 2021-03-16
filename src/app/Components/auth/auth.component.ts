import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/Models/auth.model';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  auth: Auth = {
    identification: '',
    password: ''
  };
  sign: string = 'signIn';
  term: boolean = false;
  typeInput: string = "password";
  constructor(
    private authSvc: AuthService,
    private toastSvc: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  onAuth() {
    const options = {opacity: 1,enableHtml: true};
    this.authSvc.getAuth(this.auth).subscribe(
      success => {
        console.log(success)
        if(success['success']) {
          localStorage.setItem('token', success['data']['token']);
          localStorage.setItem('person', JSON.stringify(success['person']));
          this.toastSvc.success("Bienvenido(a) "+success['person']['name'], "¡Verificación exitosa!", options);
          this.router.navigate(['home']);
        } else {
          this.toastSvc.error(success['msg'], "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  onRegister() {
    const options = {opacity: 1, enableHtml: true};
    this.authSvc.getRegister(this.auth.identification).subscribe(
      success => {
        console.log(success);
        if(success['success']) {
          this.toastSvc.success(success['msg'], '¡Validación exitosa!', options);
        } else {
          this.toastSvc.error(success['msg'], "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  onSubmitSign(type) {
    const options = {opacity: 1, enableHtml: true};
    const verify = this.onInputState(type);
    if( verify == true) {
      this.toastSvc.info('Validando información ...', '¡Un momento por favor!');
      if (type == 'signIn') {
        this.onAuth();
      } else {
        this.onRegister();
      }
    } else {
      this.toastSvc.warning('Te falta diligenciar el campo <b>'+verify+'</b>', '¡Información incompleta!', options);
    }
  }
  
  onTypeInput() {
    if (this.typeInput == 'password') {
      this.typeInput = 'text';
    } else {
      this.typeInput = 'password';
    }
  }

  onToggleCheck(e) {
		this.term = e.target.checked;
	}

  onInputState(type) {
    if (type == 'signIn') {
      if (this.auth.identification == '') {
        return 'identificación';
      }
      if (this.auth.password == '') {
        return 'Contraseña';
      }
    }
    if (type == 'signUp') {
      if (this.auth.identification == '') {
        return 'identificación';
      }
      if (!this.term) {
        return 'Politicas de seguridad';
      }
    }
    return true;
  }
}
