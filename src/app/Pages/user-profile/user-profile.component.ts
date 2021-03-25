import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService, IMyOptions } from 'ng-uikit-pro-standard';
import { OptionsModal } from 'src/app/Models/dynamic-modal.model';
import { DocumentInfo, DocumentType, Gender, People } from 'src/app/Models/user-profile.model';
import { UserProfileService } from 'src/app/Services/User-Profile/user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  timeout: number = 1000;
  keys:any = {saveId: 'saveId', success: 'success', people: 'people', picture: 'picture', result: 'result', gender: 'gender', documentTypes: 'documentTypes'}
  datePicker: string;
  myDatePickerOptions: IMyOptions = {
    dayLabels: {
      su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'
    },
    dayLabelsFull: {
      su: "Domingo", mo: "Lunes", tu: "Martes", we: "Miercoles", th: "Jueves", fr: "Viernes", sa: "Sábado"
    },
    monthLabels: { 
      1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' 
    },
    monthLabelsFull: { 
      1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre" 
    },
    todayBtnTxt: "Hoy",
    clearBtnTxt: "Limpiar",
    closeBtnTxt: "Cerrar",
    minYear: 1900,
		maxYear: new Date().getFullYear()
  };
  genders: Array<Gender>;
  documentTypes: Array<DocumentType>;
  people: People = {
    first_name: ''
  };
  urlPhoto: string;
  documentInfo: DocumentInfo;
  files: FileList;
  images: FileList;
  fileName: string;
  type: string;
  optionsModal: OptionsModal;
  enableSave: boolean = false;
  constructor(
    private userProfileSvc: UserProfileService,
    private toastSvc: ToastService,
    private router: Router
  ) { 
    this.getData();
  }

  ngOnInit(): void {
    const options = {opacity: 1, enableHtml: true};
    this.toastSvc.clear();
    this.toastSvc.info('<b>Buscando información...</b>', '¡Un momento por favor!', options);
    this.getPeople();
  }

  onOpenModal(type: string) {
    this.type = type;
    switch (type) {
      case 'ELIMINAR DOC':
          this.optionsModal = {
            header: "CONFIRMAR ELIMINACIÓN DE ARCHIVO",
            body: "¿Está seguro que desea eliminar el documento?",
          }
        break;
      case 'GUARDAR INFO':
          this.optionsModal = {
            header: "CONFIRMAR GUARDADO DE INFORMACIÓN",
            body: "¿Está seguro que desea guardar la información?",
          }
        break;
      case 'IR A HOME':
          this.optionsModal = {
            header: "CONFIRMACIÓN",
            body: "¿Desea volver a menú principal?",
          }
        break;
    }
  }

  onConfirm(event: any) {
    switch (event) {
      case 'ELIMINAR DOC':
          this.deleteDocument();
        break;
    
      case 'GUARDAR INFO':
          const emptyField = this.emptyFields(), options = {opacity: 1, enableHtml: true};
          if(!emptyField) {
            this.updatePhoto();
            this.updateDocument();
            this.updatePeopleInfo();
          } else {
            this.toastSvc.warning('Te falta diligenciar el campo <b>'+emptyField+'</b>', '¡Información incompleta!', options);
          }
        break;
      case 'IR A HOME':
          this.router.navigate(['home']);
        break;
    }
  }
  
  onDownloadDocument(urlFile: string) {
    window.open(urlFile, '_blank');
  }

  onSelectImage(event: any) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.urlPhoto = <string>reader.result; 
    }
    this.images = event.target.files;
  }
  
  onSelectDocument(event: any) {
    this.fileName = event.target.files[0].name;
    this.files = event.target.files;
  }
  
  private updatePhoto() {
    if(this.images) {
      const options = {opacity: 1,enableHtml: true};
      this.toastSvc.info('Guardando foto de perfil ...', '¡Un momento por favor!', options);
      let image: File | null = this.images.item(0);
      if(image && this.people.id != null && this.people.id != 0) {
        this.userProfileSvc.updatePhoto({peopleId: this.people.id}, image).subscribe(
          success => {
            if ( success['peopleId'] ) {
              this.toastSvc.success("La foto de perfil se ha guardado correctamente", "¡Guardado exitoso!", options);
              this.getPhoto(success['peopleId']);
            } else {
              this.toastSvc.error("La foto de perfil no se ha guardado correctamente", "¡Algo ha salido mal!", options);
            }
          },
          error => {
            console.error(error);
          }
        )
      }
    }
  }

  private updatePeopleInfo() {
    const options = {opacity: 1,enableHtml: true};
    this.toastSvc.info('Guardando información ...', '¡Un momento por favor!', options);
    let last_name = this.people.last_name.split(' ');
    this.people.last_name = last_name[0];
    this.people.last_name_two = (last_name.length > 1)?last_name[1]:''; 
    this.userProfileSvc.updatePeopleInfo(this.people).subscribe(
      success => {
        if( success[this.keys.success] ) {
          this.toastSvc.clear();
          this.toastSvc.success("La información se ha guardado correctamente", "¡Guardado exitoso!", options);
          localStorage.setItem('identification', this.people.identification);
          this.updateUserInfo();
          this.getPeople();
        } else {
          this.toastSvc.error("La información no se ha guardado correctamente", "¡Algo ha salido mal!", options);
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  private updateUserInfo() {
    this.userProfileSvc.updateUserInfo(this.people).subscribe(
      success => {
        if(success[this.keys.success]) {
          if(!this.files) {
            setTimeout(() => {
              document.getElementById('toggleModal').click();
            }, this.timeout);
          }
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  private deleteDocument() {
    const options = {opacity: 1,enableHtml: true};
    this.toastSvc.info('Eliminando documento ...', '¡Un momento por favor!', options);
    this.userProfileSvc.deleteDocument(this.people.id, this.documentInfo.id).subscribe(
      success => {
        this.documentInfo = null;
        this.toastSvc.clear();
        this.toastSvc.success("El documento se ha eliminado correctamente", "Eliminación exitosa!", options);
      },
      error => {
        console.error(error);
      }
    )
  }

  private updateDocument() {
    if(this.files) {
      const options = {opacity: 1,enableHtml: true};
      this.toastSvc.info('Guardando documento ...', '¡Un momento por favor!', options);
      const file: File | null = this.files.item(0);
      if(file && this.people.id && this.people.id != 0) {
        this.userProfileSvc.updateDocument({peopleId: this.people.id}, file).subscribe(
          success => {
            if ( success['peopleId'] ) {
              this.toastSvc.success("El documento se ha guardado correctamente", "¡Guardado exitoso!", options);
              this.getDocument(success['peopleId']);
              setTimeout(() => {
                document.getElementById('toggleModal').click();
              }, this.timeout);
            } else {
              this.toastSvc.error("El documento no se ha guardado correctamente", "¡Algo ha salido mal!", options);
            }
          },
          error => {
            console.error(error);
          }
        )
      }
    }
  }

  private getData() {
    this.userProfileSvc.getData().subscribe(
      success => {
        this.genders = success[this.keys.result][this.keys.gender];
        this.documentTypes = success[this.keys.result][this.keys.documentTypes];
      }, 
      error => {
        console.error(error);
      }
    )
  }

  private getPeople() {
    this.userProfileSvc.getPeople(localStorage.getItem('identification')).subscribe(
      success => {
        const options = {opacity: 1, enableHtml: true};
        if(success[this.keys.success]) {
          this.getPhoto(success[this.keys.people]['id']);
          this.getDocument(success[this.keys.people]['id']);
          this.people = success[this.keys.people];
          this.people.last_name = this.people.last_name + ' ' + this.people.last_name_two; 
          this.people.birthdate = this.people.birthdate.split('T')[0];
        } else {
          this.toastSvc.error(success[this.keys.people], "¡Algo ha salido mal!", options);
        }
      }, 
      error => {
        console.error(error);
      }
    )
  }

  private getPhoto(peopleId: string) {
    this.userProfileSvc.getPhoto(peopleId).subscribe(
      success => {
        if(success[this.keys.success]) {
          this.urlPhoto = success[this.keys.picture]['url'];
        }
      },
      error => {
        console.error(error);
      }
    )
  }

  private getDocument(peopleId: string) {
    const options = {opacity: 1, enableHtml: true};
    this.userProfileSvc.getDocument(peopleId).subscribe(
      success => {
        this.toastSvc.clear();
        this.toastSvc.success("<b>Ya puedes editar tu perfil</b>", "¡Busqueda exitosa!", options);
        this.enableSave = true;
        if(success[this.keys.saveId]['length'] > 0) {
          this.fileName = null;
          this.documentInfo = success[this.keys.saveId][0];
        }
      }, 
      error => {
        console.error(error);
      }
    )
  }

  private emptyFields() {
    if(this.people.first_name == '') return 'Primer nombre';
    if(!this.people.last_name) return 'Apellido';
    if(!this.people.birthdate) return 'Fecha de cumpleaños';
    if(!this.people.address) return 'Dirección';
    if(!this.people.phone) return 'Número de contacto';
    if(!this.people.phone_sms) return 'Numero de envio sms';
    if(!this.people.email) return 'Correo electrónico';
    if(!this.people.gender == null) return 'Genero';
    return false;
  }

}
