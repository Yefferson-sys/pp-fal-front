import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadResultsService } from 'src/app/Services/Download-Results/download-results.service';

//declare var M: any;
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { IMyOptions, ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-download-results',
  templateUrl: './download-results.component.html',
  styleUrls: ['./download-results.component.scss']
})
export class DownloadResultsComponent implements OnInit {
  downloadUrl: string = environment.apiUrl + 'ResultProfiles/downloadPrev/true/';
	loading = true;
	search: string = '';
	colorchangePassword: any;
	antPassword: any;
	newPassword: any;
	instances: any;
	userEmail: any;
	username: any;
	userType: any;
	uid: any;
	changePasswordModal: any;
	instancesPicker: any;
	colorBarra: string = 'studies-s';
	rol: string;
	identification: string;
	dateIni: string;
	dateEnd: string;
	listOrders = [];
	auxListOrders = [];
	listStudies = {};
	auxStudies = [];
	msgchangePassword = '';
	page: number = 1;
	itemsPerPage: number = 10;

	backgroundColor: any;
	colorToggle: any;
	items$: any[];
	client: string;
	clients: any;
	checkOn: false;
	isDisabled: boolean = false;
	downloadFlag: boolean = false;
	personId: any;
	labelCheck: any = 'Seleccionar';

	options: any = {opacity: 1,enableHtml: true};
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
		minYear: 2000,
		maxYear: new Date().getFullYear()
	};

  constructor(
    private router: Router,
    private downloadResultsSvc: DownloadResultsService,
	private toastSvc: ToastService
  ) { 
    this.search = '';
		this.client = '';
  }

  ngOnInit(): void {
    // inicia los componentes de materialize
	let elems = document.querySelectorAll('#forceChangePassword');
	
	let elems2 = document.querySelectorAll('#changePassword');
	
	let today = new Date();
		
	let userInfo = JSON.parse(localStorage.getItem('userInfo'));
	let person = JSON.parse(localStorage.getItem('person'));
	this.userEmail = userInfo.email;
	this.rol = userInfo.rol;

	this.uid = userInfo.id;
	this.username = person.name;
	this.personId = person.id;
	// si el usuario es admin
	if (this.rol == '0') {
		this.getClients();
		this.dateIni = moment().subtract(30, 'd').format('YYYY-MM-DD');
		this.dateEnd = moment().format('YYYY-MM-DD');
		this.userType = 'Admin';
	}
	if (this.rol == '1') {
		// cliente
		this.dateIni = moment().subtract(90, 'd').format('YYYY-MM-DD');
		this.dateEnd = moment().format('YYYY-MM-DD');
		this.userType = 'Entidad';
		this.identification = userInfo.usuario_id;
	} else if (this.rol == '2') {
		// medico
		this.dateIni = moment().subtract(90, 'd').format('YYYY-MM-DD');
		this.dateEnd = moment().format('YYYY-MM-DD');
		this.identification = userInfo.usuario_id;
		this.userType = 'Medico';
	} else if (this.rol == '3') {
		// paciente
		this.dateIni = moment().format('YYYY-MM-DD');
		this.dateEnd = moment().format('YYYY-MM-DD');
		this.identification = userInfo.identification;
		this.userType = 'Usuario';
	}
	this.forceChangePassword();
	this.getOrdersByRol();
  }
  applyFilter(filterValue: string) {
		this.initializeItems();
	}

	getItems(searchbar) {
		// Reset items back to all of the items
		this.initializeItems();

		// set q to the value of the searchbar
		let q = searchbar.target.value;
		if (q && q.trim() != '') {
			this.items$ = this.items$.filter((item) => {
				return (
					item.order_consec.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
					item.identification.toLowerCase().indexOf(q.toLowerCase()) > -1 ||
					item.people_name.toLowerCase().indexOf(q.toLowerCase()) > -1
				);
			});
		}
	}

	initializeItems() {
		this.items$ = this.listOrders;
	}

	forceChangePassword() {
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));
		let change_password = userInfo.change_password;

		// Se abre modal para forzar cambio de password
		if (change_password == 0) {
			
		}
	}

	// Se obtienen las ordenes con estudios del dia actual
	getOrdersByRol() {
		this.listOrders = [];
		this.loading = true;
		this.items$ = [];

		let dateDiffEnd = moment(this.dateEnd);
		let dateDiffIni = moment(this.dateIni);
		let calFechas = dateDiffEnd.diff(dateDiffIni, 'days');

		if (this.rol == '1' || this.rol == '2') {
			// entidad o medico
			if (calFechas > 90) {
				alert('Solo se puede colsultar dos mes');
				this.loading = false;
				return;
			}
		}
		if (this.rol == '0') {
			// admin

			if (calFechas > 30) {
				this.loading = false;
				alert('Solo se puede colsultar un mes');
				return;
			}
		}

		if (dateDiffEnd == undefined || dateDiffEnd == null) {
			alert('Se debe especificar una Fecha Fin');
			return;
		}
		if (dateDiffIni == undefined || dateDiffIni == null) {
			alert('Se debe especificar una Fecha Inicial');
			return;
		}

		let diffDays = dateDiffEnd.diff(dateDiffIni, 'days'); // 1

		// // Diferencia de 30 dias
		if (diffDays > 30) {
			// Se restan dias resultantes para limitar a 3 meses de anterioridad
			let restDays = diffDays - 30;
			dateDiffIni = dateDiffIni.add(restDays, 'days');
			let dateFinal = moment(dateDiffIni).format('YYYY-MM-DD');
			// Se reasigna a la propiedad de fecha que sera enviada
			this.dateIni = dateFinal;
		}

		this.downloadResultsSvc
			.getOrdersByRol(this.dateIni, this.dateEnd, this.identification, this.rol, this.client)
			.subscribe((data) => {
				if (diffDays > 30) {
					// Propiedad que muestra mensaje indicando que la consulta se limito a solo 3 meses
					this.toastSvc.info('La consulta se ha generado con limite de 1 mes', '¡Información!', this.options);
				}
				this.loading = false;
				if(data.msg != '') this.toastSvc.info(data.msg, '¡Información!', this.options);
				if (data.success) {
					// Array de posiciones de ordenes repetidas
					let auxOrdersPosition = [];

					data.listOrders.forEach((value, index) => {
						// busqueda para saber si se repite la orden
						// control del color de la barra si cada orden esta bloqueada
						if (value.state_download == 0) {
							this.colorBarra = 'studies-w';
						} else {
							this.colorBarra = 'studies-s';
						}
						let posOrder = auxOrdersPosition.indexOf(value.order_id);

						// Si la encuentra repetida solo agrega el estudio y el id a la posicion de la orden
						if (posOrder != -1) {
							this.auxStudies[posOrder].push({
								name: value.name,
								result_id: value.result_id,
								Results_state: value.Results_state
							});
						} else {
							// Se almacenan los datos en un nuevo arreglo cuando es la primera vez que viene la orden

							// Se guarda cada order_id
							auxOrdersPosition.push(value.order_id);

							var newOrder = {
								cedula: value.ce
							};
							// Se asigna todo el arreglo en uno nuevo
							this.listOrders.push(value);
							this.auxStudies.push({
								name: value.name,
								result_id: value.result_id,
								Results_state: value.Results_state
							});
							this.initializeItems();

							// Se formatea objeto a array para ser iterados los estudios en el template
							this.auxStudies[this.auxStudies.length - 1] = Object.keys(
								this.auxStudies[this.auxStudies.length - 1]
							).map((i) => this.auxStudies[this.auxStudies.length - 1]);
							// Se quitan las dos primeras posiciones por quedar duplicada al hacer el object.keys()
							this.auxStudies[this.auxStudies.length - 1].splice(0, 2);
						}
					});
					this.listStudies = this.auxStudies;

					this.backgroundColor = 'primary';
					this.colorToggle = 'secondary';
				}
			});
	}

	toogleDisabled(event) {

		this.isDisabled = false;
	}

	DownloadAllChecked() {
		let element = <HTMLInputElement[]>(<any>document.getElementsByName('checkDownload'));

		for (let index = 0; index < element.length; index++) {
			if (element[index].checked) {
				let posOrderList = element[index].value;
				let item = this.items$[posOrderList];
				this.downloadBlock(item, posOrderList);
			}
		}
	}

	downloadBlock(item, index) {
		const options: any = {opacity: 1,enableHtml: true, timeOut: 20000};
		this.toastSvc.info('Descargando resultado <b>'+(index+1)+'</b> ...', '¡Un momento por favor!', options);
		if (item.state_download == '1') {
			this.auxStudies[index].forEach((value, index) => {
				if (value.Results_state == '1') {
					this.downloadFlag = true;
					this.downloadResult(value.result_id, item, value.Results_state, value.name);
				}

				// Si no se pudieron descargar los resultados de las ordenes seleccionadas
				// Se ejecuta esto al final del ciclo
				if (this.auxStudies[index].length == index + 1) {
					// Evalua si hubo al menos un resultados que se descargo
					if (!this.downloadFlag) {
						this.toastSvc.warning('No se han descargado los resultados de algunas ordenes seleccionadas', '¡Información!', this.options);
						setTimeout(() => {
							this.downloadFlag = false;
						}, 6000);
					}
				}
			});
		}
	}

	// Funcion encargada de la generacion de resultado y la posterior descarga en Pdf.
	downloadResult(result_id, item, Results_state, name) {
		let arrayName = item.people_name.split(' ');
		const peopleName = {
			identification: item.identification,
			first_name: arrayName[0],
			middle_name: arrayName[1],
			last_name: arrayName[2],
			last_name_two: arrayName[3]
		};

		const order = {
			calculated_age: '',
			client: {
				name: item.client
			},
			order_consec: item.order_consec
		};

		const appointment = {
			attentions: [],
			study: {
				cup: item.cup,
				name: name
			}
		};

		appointment.attentions.push({
			created: item.date_time_ini,
			id: item.attentions_id
		});

		const specialists_id = item.specialists_id;
		const summernote = item.result_content;
		const gender = item.gender;
		let results_state = Results_state;

		// Se obtiene informacion complementaria para generar el pdf del resultado
		this.downloadResultsSvc.getInfoResult(item.people_id, specialists_id).subscribe((response) => {
			let data = JSON.stringify({
				peopleName: peopleName,
				firmSpecialist: response.signature.url,
				order: order,
				appointment: appointment,
				sex: gender,
				specialistSelected: response.specialists,
				summernote: summernote,
				validate: results_state == '1' ? true : false,
				pre: true,
				picture: response.picture.url
			});

			this.downloadResultsSvc.printResult(data).subscribe((response) => {
				this.toastSvc.clear();
				window.open(this.downloadUrl + item.identification, '_blank');

				let observation = 'Impreso desde aplicación de resultados';
				let people_id = this.personId;

				if (!this.personId) {
					people_id = item.people_id;
					observation = 'Impreso desde aplicación de resultados por la entidad';
				}

				this.downloadResultsSvc
					.addPrintControl(
						result_id,
						people_id,
						item.attentions_id,
						this.username,
						observation
					)
					.subscribe((response) => {});
			});
		});
	}

	changePassword() {
		let userInfo = JSON.parse(localStorage.getItem('userInfo'));

		if (this.antPassword && this.newPassword) {
			if (this.newPassword.length > 5) {
				this.downloadResultsSvc
					.changePassword(this.antPassword, this.newPassword, userInfo.identification)
					.subscribe((data) => {
						this.msgchangePassword = data.msg;
						if (data.success) {
							this.antPassword = undefined;
							this.newPassword = undefined;
							this.colorchangePassword = true;
							userInfo.change_password = 1;
							localStorage.setItem('userInfo', JSON.stringify(userInfo));

							setTimeout(() => {
								this.changePasswordModal[0].close();
								this.instances[0].close();
							}, 1000);
						} else {
							this.colorchangePassword = false;
						}
					});
			} else {
				this.msgchangePassword =
					'¡La contraseña debe tener un minimo de 6 digitos o letras!';
			}
		} else {
			this.msgchangePassword = '¡El campo de contraseña no puede estar vacio!';
		}
	}

	closeModal() {
		this.antPassword = undefined;
		this.newPassword = undefined;
		this.msgchangePassword = '';
		this.changePasswordModal[0].close();
	}

	closeModalFilter() {
		let date = document.getElementById('dateIni');

		date.innerHTML = '';
	}

	openChangePassword() {
		this.changePasswordModal[0].open();
	}

	logOut() {
		localStorage.clear();
		this.router.navigate([ '/login' ]);
	}

	// funcion que permite listar los clientes activos state = 1 de la fundacion alejandro londoño
	getClients() {
		this.downloadResultsSvc.getClients().subscribe((res) => {
			this.clients = res.listClients;
			// se espera un momento para inicializar los campos select

		});
	}
	// identifica la seleccion del cliente
	changeClient() {
		this.getOrdersByRol();
	}

	absoluteIndex(indexOnPage: number): number {
		return this.itemsPerPage * (this.page - 1) + indexOnPage;
	}

	selectAllCheck() {
		let checkAll = <HTMLInputElement[]>(<any>document.getElementsByName('checkAll'));

		// Si se selecciono el check principal
		if (checkAll[0].checked) {
			this.labelCheck = 'Desmarcar';
			let element = <HTMLInputElement[]>(<any>document.getElementsByName('checkDownload'));
			for (let index = 0; index < element.length; index++) {
				if (!element[index].checked) {
					element[index].checked = true;
				}
			}
		} else {
			//Se desmarcan todos los checks
			this.labelCheck = 'Seleccionar';
			let element = <HTMLInputElement[]>(<any>document.getElementsByName('checkDownload'));
			for (let index = 0; index < element.length; index++) {
				if (element[index].checked) {
					element[index].checked = false;
				}
			}
		}
	}
}
