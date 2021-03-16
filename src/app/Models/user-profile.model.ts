export interface People {
	id?: number,
    document_types_id?: number,             
	identification?: string,                
	first_name?: string,                    
	middle_name?: string,                   
	last_name?: string,                     
	last_name_two?: string,                 
	birthdate?: string,                              
	gender?: number,                        
	address?: string,                       
	phone?: string,             
	email?: string,                         
	created?: string,                       
	modified?: string,                      
	municipalities_id?: number,             
	user_creation?: number,
    phone_sms?: string,         
	check_send_sms?: boolean
}

export interface Gender {
	id?: number,
	gender?: string,
	initials?: string
}

export interface DocumentType {
	id?: number,
	type?: string,
	initials?: string
}

export interface DocumentInfo {
	id?: number,                                         
	users_id?: number,                                   
	stored_file_name?: string,                           
	name?: string,                                       
	created?: string,                                    
	modified?: string,                                   
	entity_id?: number,                                  
	resource_extensions_id?: number,                     
	resource_types_id?: number,                          
	resource_parent_entities_id?: number,                
	bytes?: string,                                      
	size_format?: string,                                
	url?: string,                                        
}

export interface Patient {
	id?: number,						
	people_id?: number,					
	users_id?: number,					
	created?: string,					
	modified?: string,					
	zone_id?: string,					
	regimes_id?: number,				
	permanent_diagnostic?: string,			
	eps_id?: number,					
	affiliation_type?: number,			
	education_level_id?: number,		
	ocupations_id?: number,				
	ethics_id?: number				
}
