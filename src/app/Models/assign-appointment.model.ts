export interface Eps {
    id?: number,
    name?: string,
    nit?: string
}

export interface Studio {
    id?: string,
    cup?: string,
    name?: string,
    type_study?: number,
    specializations_id?: string,
    average_time?: number
}

export interface StudioInfo {
    id?: number,
    cup?: string,
    name?: string,
    specializations_id?: number,
    average_time?: number,
    type?: number,	
    format_types_id?: number
    coments?: string,
    radiation_dose?: number, 
    created?: string,
    modified?: string,
    users_id?: number,
    state?: number,
	category_studies_id?: number, 
    type_study?: number,
	instructives: Array<any>,
    studies_informed_consents?: Array<any>,
    services?: Array<any>,
    specialization: Specialization
}

export interface Specialization {
    id?: number,                      
	specialization?: string,          
	created?: string,                 
	modified?: string,                
	code?: string,                    
	cost_centers_id?: number,        
	cost_center?: CostCenter             
}

export interface CostCenter {
    id?: number,                      
    name?: string,                    
    code?: string,                    
    business_units_id?: number        
}

export interface Rateclient {
    id?: number,
    rate: Rate
}

export interface Rate {
    id?: number,
    name?: string,
    type_rate?: number
}
/************************************************************************************** */
/** -> Módelo de datos de cita.
 *  -> Yefferson Caleño
 *  -> 05-03-2021
 */
export interface Appointment {
	cup?: number,                        
	name?: string, 
    specializations_id?: string,                      
	appointment_id?: number,             
	medical_offices_id?: number,   
    centers_id?: number,
    cost_center?: string,
    cost_center_id?: number,      
	observations?: string,               
	appointment_dates_id?: number,       
	users_id?: number,                   
	date_time_ini?: string,              
	date_time_end?: string,
    clients_id?: number,
    studies_id?: number              
}
