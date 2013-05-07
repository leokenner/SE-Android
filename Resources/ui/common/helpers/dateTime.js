var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";

function getMonth(input)
{
	return month[input];
}

/* function to judge if time ented is valid(ie: equal to or later than current time)
 * input: the appointment date and time as a string
 * output: boolean: date is valid/invalid
 * 
 */

function isValidDateTime(appointment_date)
{
var appointment = new Date(appointment_date);
var current = new Date();	


if(appointment.getFullYear() > current.getFullYear()) { return true; }
else {
	if(appointment.getMonth() > current.getMonth()) { return true; }
	else {
		if(appointment.getDate() > current.getDate()) { return true; }
		else {
			if(appointment.getHours() > current.getHours()) { return true; }
			else {
				if(appointment.getMinutes() > current.getMinutes()) { return true; }
				else 
				{ 
					return false; 
				}
			}
		}
	}
 }
}


function isValidDate(apt_date)
{
var date = new Date(apt_date);
var current = new Date();	

if(date.getFullYear() >= current.getFullYear()) { return true; }
else {
	if(date.getMonth() >= current.getMonth()) { return true; }
	else {
		if(date.getDate() >= current.getDate()) { return true; }
		else {
				return false; 	
		}
	}
 }
}

function isStartBeforeEnd(start_date,end_date)
{
	if(end_date == null) { var end = new Date(); }
	else { var end = new Date(end_date); }
	if(start_date == null) { var start = new Date(); }
	else { var start = new Date(start_date); }	

if(end.getFullYear() >= start.getFullYear()) { return true; }
else {
	if(end.getMonth() >= start.getMonth()) { return true; }
	else {
		if(end.getDate() >= start.getDate()) { return true; }
		else {
				return false; 
		}
	}
 }
}

//function to round the mintues to the nearest 5 so we can use 5 min interval in picker
function roundMinutes(d) {
	var min = d.getMinutes();
		var min1 = min%10;
		if(min1%5 == 0) return d;
		
		if(min1 < 5) { var min2 = 5-min1; }
		else { var min2 = 10-min1; }
		min = min + min2;
		d.setMinutes(min,0,0);
		
	return d;
}



//This function formats the time to remove excess text like time zone and hours compared to GMT
//input: date as a Date object
function timeFormatted(date)
{
var final_date = date.toDateString();
var ampm = (date.getHours() >= 12)?'PM':'AM';
var hours = date.getHours() % 12;
	hours = hours?hours:12;   //the hour 0 should be 12	
var minutes = date.getMinutes();
	minutes = (minutes < 10)?'0'+minutes:minutes;
var final_time = hours+':'+minutes+' '+ampm;	
final_time =  { date: final_date, time: final_time };
return final_time;
}



function calculateAge(birthDate, otherDate) {
    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() || 
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }
    
    if(years == 0) {
    	if(otherDate.getMonth() >= birthDate.getMonth()) {
    		var months = otherDate.getMonth() - birthDate.getMonth();
    	}
    	else {
    		var months = (12 - birthDate.getMonth()) + otherDate.getMonth();
    	}
    	
    	if(otherDate.getDate() < birthDate.getDate()) {
    		months--;
    	}
    }
    
    if(months == 0) {
    	var days = otherDate.getDate() - birthDate.getDate();
    }
    
    var result = (years > 0)?years+' years':(months > 0)?months+' months':days+' days';

    return result;
}

