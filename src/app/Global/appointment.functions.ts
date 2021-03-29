import { Aldeamo, AppointmentShedule, MedicalOffices } from "../Models/appointment-info.model";
import { Appointment } from "../Models/assign-appointment.model";
import { People } from "../Models/user-profile.model";

/********************************************************************************************************************************************************************* */
/** -> 
 * 
 * @param date 
 * @param days 
 * @returns 
 */
export function dateAddDays(date: Date, days: number) {
    var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + (d.getDate() + days ), year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}
/********************************************************************************************************************************************************************* */
/**
 * 
 * @param date 
 * @param minutes 
 * @returns 
 */
export function dateAddMinutes(date: Date, minutes: number) {
    date = new Date(date.getTime()+minutes*60000);
    var year = date.getFullYear(), month = ''+ (date.getMonth()+1), day = '' + date.getDate(), hours = '' + date.getHours(), min = '' + date.getMinutes(), seconds = '' + date.getSeconds();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (min.length < 2) min = '0' + min;
    if (seconds.length < 2) seconds = '0' + seconds;
    return [year, month, day].join('-') + ' ' + [hours, min, seconds].join(':');
}
/********************************************************************************************************************************************************************* */
/**
 * 
 * @param dateAppointment 
 * @param medicalOffices 
 * @returns 
 */
export function appointmentsShedule(dateAppointment: string, medicalOffices: Array<MedicalOffices>, average_time: number) {
      let dateIni = dateAppointment + ' 07:00:00', dateEnd = dateAppointment + ' 18:00:00', count:number = 0, appointmentShedule: Array<AppointmentShedule> = [], dataSchedule: AppointmentShedule;
      while(new Date(dateIni) < new Date(dateEnd)) {
        if ( (new Date(dateIni) < new Date(dateAppointment+' 12:00:00')) || (new Date(dateIni) >= new Date(dateAppointment+' 14:00:00')) ) {
          medicalOffices.forEach((e)=> {
            dataSchedule = {
              id: count, 
              date: dateIni, 
              place: e.MedicalOffices.center.name,
              place_id: e.MedicalOffices.centers_id,
              consulting_room: e.MedicalOffices.name,
              consulting_room_id: e.MedicalOffices.id,
              state: 'Not Available'
            }
            if ((new Date(dateAppointment) < new Date(e.MedicalOffices.availableDates.dateEnd)) && e.MedicalOffices.id != 30) {
              let isAssigned:boolean = false, isRestricted: boolean = false;
              e.MedicalOffices.appointments.every(ei=> {
                if(dateAddMinutes(new Date(ei.date_time_ini), 0) == dateIni) {
                  isAssigned = true;
                  return false;
                }
                return true;
              })
              e.MedicalOffices.medicalRestriction.every(eii => {
                if(eii.state == 0 && dateAddMinutes(new Date(eii.date_ini), 0) <= dateIni && dateAddMinutes(new Date(eii.date_end), 0) >= dateIni) {
                  isRestricted = true;
                  return false;
                }
                return true;
              })
              if(!isAssigned) {
                if(isRestricted) {
                  dataSchedule.state = 'Restricted';
                } else {
                  dataSchedule.state = 'Available';
                }
              } else {
                dataSchedule.state = 'Assigned';
              }
            }
            appointmentShedule.push(dataSchedule);
          })
        } else {
          appointmentShedule.push({
              id: count, 
              date: dateIni, 
              place: '',
              place_id: 0,
              consulting_room: '',
              consulting_room_id: 0,
              state: 'Lunch'
          });
        }
        count++;
        dateIni =  dateAddMinutes(new Date(dateIni), average_time);
      }
      return appointmentShedule;
}
/***************************************************************************************** */

export function diffDate(dateIni: any, dateEnd: any, type: string) {
  let operator:number = 1000, diff:number = 0;
  dateIni = new Date(dateIni).getTime();
  dateEnd = new Date(dateEnd).getTime();
  diff = dateEnd - dateIni;
  switch (type) {
    case 'Years':
        operator *= 60*60*24*365;
      break;
    case 'Days':
        operator *= 60*60*24;
      break;
    case 'Hours':
        operator *= 60*60;
      break;
    case 'Minutes':
        operator *= 60;
      break;
  }
  return (diff/operator);
}

/***************************************************************************************** */
export function Aldeamo(type: string, people: People, appointment: Appointment) {
  let allowSendSMS = 0, dateSend = dateAddMinutes(new Date(), 0);
  if ( type == 'NUEVA' ) {
      let diff = diffDate(new Date(dateSend), new Date(appointment.date_time_ini), 'Hours');
      if (diff > 24) {allowSendSMS = 0;}
      dateSend = subtractDate(new Date(appointment.date_time_ini), 24, 'Hours');
  }
  
  let appointmentDate = appointment.date_time_ini.split(' '), arrayHour = appointmentDate[1].split(':'), 
      ampm = (new Date(appointment.date_time_ini).getHours() >= 12)? 'PM': 'AM',
      Hour = arrayHour[0]+':'+arrayHour[1]+' '+ampm; 

  let arrayDate = appointmentDate[0].split('-'), 
      year = arrayDate[0].substring(2, 4), month = formatMonth(arrayDate[1]), day = arrayDate[2],
      dateMeet = day + '/' + month + '/' + year;

  let smsAddress = appointment.centers_id == 1 ? 'Sede Norte: Cra 15 1N-49' : 'Sede Sur: Cra 18 # 43-70',
      urlFAL = 'aldm.co/IDAWqcQ', 
      firstName = (people.first_name.indexOf(' ') != -1) ? people.first_name.split(' ')[0]: people.first_name,
      typeAppointment = (appointment.cost_center.length > 10 ) ?  appointment.cost_center.substring(0,10) + '.': appointment.cost_center;
  
  let smsAppoinment =
      'Hola ' + firstName +
      ' la Fundacion AL te informa ' + type +
      ' cita de ' + typeAppointment + 
      ' el dia ' + dateMeet +
      ' a las ' + Hour +
      ' en ' + smsAddress +
      '. Info: ' + urlFAL;

  let data: Aldeamo = {
      dateSchedule: dateSend,
      message: smsAppoinment,
      addresseeList: people.phone_sms,
      allowSendSMS
  };
  return data;
}

/****************************************************************************************** */
/** -> Función de envio de mensaje API aldeamo.
 *  -> Yefferson Caleño
 *  -> 06-03-2021
 */
export function formatMonth(m) {
    var month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return month[m-1];
}

export function subtractDate(date: Date, quantity: number, type: string) {
  let operator:number = 1000;
  switch (type) {
    case 'Years':
        operator *= 60*60*24*365;
      break;
    case 'Days':
        operator *= 60*60*24;
      break;
    case 'Hours':
        operator *= 60*60;
      break;
    case 'Minutes':
        operator *= 60;
      break;
  }
  date = new Date(date.getTime()-quantity*operator);
  var year = date.getFullYear(), month = ''+ (date.getMonth()+1), day = '' + date.getDate(), hours = '' + date.getHours(), min = '' + date.getMinutes(), seconds = '' + date.getSeconds();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hours.length < 2) hours = '0' + hours;
  if (min.length < 2) min = '0' + min;
  if (seconds.length < 2) seconds = '0' + seconds;
  return [year, month, day].join('-') + ' ' + [hours, min, seconds].join(':');
}