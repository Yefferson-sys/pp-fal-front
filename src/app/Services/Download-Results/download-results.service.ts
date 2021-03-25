import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadResultsService {
  URL_API: string = environment.apiUrl;
  constructor(
    private http: HttpClient
  ) { }
  public getOrdersByRol(dateIni, dateEnd, identification, rol, client) {
		
    let data = JSON.stringify({
			dateIni: dateIni,
			dateEnd: dateEnd,
			identification: identification,
			rol: rol,
			client: client
		});

		return Observable.create((observer) => {
			this.http.post(this.URL_API + `WsUsers/getOrdersByRol.json`, data).subscribe(
				(data) => {
					observer.next(data);
					observer.complete();
				},
				(error) => {
					observer.next(error);
					observer.complete();
				}
			);
		});
	}

	// Cambio de contraseña
	public changePassword(antPassword, newPassword, identification) {
		let data = JSON.stringify({
			antPassword: antPassword,
			newPassword: newPassword,
			identification: identification
		});
		return Observable.create((observer) => {
			this.http.post(this.URL_API + `WsUsers/changePassword.json`, data).subscribe(
				(data) => {
					observer.next(data);
					observer.complete();
				},
				(error) => {
					observer.next(error);
					observer.complete();
				}
			);
		});
	}

	public getInfoResult(people_id, specialist_id) {
		let data = JSON.stringify({ people_id: people_id, id: specialist_id });

		return Observable.create((observer) => {
			this.http.post(this.URL_API + `WsUsers/getInfoResult.json`, data).subscribe(
				(data) => {
					observer.next(data);
					observer.complete();
				},
				(error) => {
					observer.next(error);
					observer.complete();
				}
			);
		});
	}

	public printResult(data) {
		return Observable.create((observer) => {
			this.http.post(this.URL_API + `resultProfiles/preResultProfile.json`, data).subscribe(
				(data) => {
					observer.next(data);
					observer.complete();
				},
				(error) => {
					observer.next(error);
					observer.complete();
				}
			);
		});
	}

	public addPrintControl(result_id, uid, attention_id, people, observation) {
		let data = JSON.stringify({
			results_id: result_id,
			users_id: uid,
			attention_id: attention_id,
			people: people,
			observation: observation
		});

		return Observable.create((observer) => {
			this.http.post(this.URL_API + `WsUsers/addPrintControl.json`, data).subscribe(
				(data) => {
					observer.next(data);
					observer.complete();
				},
				(error) => {
					observer.next(error);
					observer.complete();
				}
			);
		});
	}

	public getClients() {
		return Observable.create((observer) => {
			this.http.get(this.URL_API + `WsUsers/getClients.json`).subscribe(
				(data) => {
					observer.next(data);
					observer.complete();
				},
				(error) => {
					observer.next(error);
					observer.complete();
				}
			);
		});
	}
}
