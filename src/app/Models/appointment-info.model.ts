/************************************************************************************** */
/** -> Módelo de datos para consultorio
 *  -> Yefferson Caleño
 *  -> 04-03-2021
 */
export interface MedicalOffices {
    MedicalOffices: medicalOffices
}
/************************************************************************************** */
/** -> Módelo de datos para consultorio
 *  -> Yefferson Caleño
 *  -> 04-03-2021
 */
export interface medicalOffices {
    id?: number,
    code?: string,
    name?: string,
    centers_id?: number,
    center?: Center,
    availableDates?: Dates,
    appointments?: Array<any>,
    medicalRestriction?: Array<any>
}
/************************************************************************************** */
/** -> Módelo de datos para sede
 *  -> Yefferson Caleño
 *  -> 04-03-2021
 */
export interface Center {
    id?: number,               
    name?: string,             
    code?: string,             
    state?: number,            
    contact?: string,          
    direction?: string,        
    phone?: string            
}
/************************************************************************************** */
/** -> Módelo de datos para citas disponibles.
 *  -> Yefferson Caleño
 *  -> 04-03-2021
 */
export interface AppointmentShedule {
    id?: number,
    date?: string,
    place?: string,
    place_id?: number,
    consulting_room?: string,
    consulting_room_id?: number,
    state?: string
}
/************************************************************************************** */
/** -> Módelo de datos para restricciones a citas disponibles.
 *  -> Yefferson Caleño
 *  -> 04-03-2021
 */
export interface AppointmentsData {
    dates?: Dates,
    appointments?: Array<any>,
    medicalRestriction?: Array<any>
}
/************************************************************************************** */
/** -> Módelo de datos para rango de citas habilitadas/fecha.
 *  -> Yefferson Caleño
 *  -> 04-03-2021
 */
export interface Dates {
    medicalOfficeId?: number,
    dateIni?: string, 
    dateEnd?: string 
}
/************************************************************************************** */
/** -> Módelo de datos para envio de mensaje de texto
 *  -> Yefferson Caleño
 *  -> 06-03-2021
 */
export interface Aldeamo {
    dateSchedule?: string,
    message?: string,
    addresseeList?: string,
    allowSendSMS?: number
}
/************************************************************************************** */
export interface Center {
	id?: number,                     
	name?: string,                 
	code?: string,                 
	state?: number,                 
	contact?: string,                
	direction?: string,             
	phone?: string,                 
	company_id?: number,             
	city_id?: number                 
}