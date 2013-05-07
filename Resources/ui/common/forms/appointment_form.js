


function appointment(input)
{
	Ti.include('/ui/common/helpers/dateTime.js');
	Ti.include('/ui/common/database/users_db.js');
	Ti.include('/ui/common/database/children_db.js');
	Ti.include('/ui/common/database/relationships_db.js');
	Ti.include('/ui/common/database/records_db.js');
	Ti.include('/ui/common/database/incidents_db.js');
	Ti.include('/ui/common/database/entries_db.js');
	Ti.include('/ui/common/database/activities_db.js');
	Ti.include('/ui/common/database/appointments_db.js');
	Ti.include('/ui/common/database/treatments_db.js');
	Ti.include('/ui/common/cloud/appcelerator/objects.js');
	
	var appointment = {
		id: input.id?input.id:null,
		entry_id: input.entry_id?input.entry_id:null,
		diagnosis: input.diagnosis?input.diagnosis:null,
		complete: (input.complete == 1)?true:false,              
		date: input.date?input.date:timeFormatted(new Date).date,
		time: input.time?input.time:timeFormatted(new Date).time,
		symptoms: input.symptoms?input.symptoms:[],
		doctor: input.doctor?input.doctor:{
								name: null,
								location: null,
								street: null,
								city: null,
								state: null,
								zip: null,
								country: 'USA',
								},
		activities: input.activities?input.activities:[],
		treatments: input.treatments?input.treatments:[],	
	}
	
	var symptoms_string='';
	for(var i=0;i < appointment.symptoms.length; i++) {
		symptoms_string += appointment.symptoms[i];
		if(i != appointment.symptoms.length -1) symptoms_string += ', ';
	}
	
	var window = Ti.UI.createWindow({
  		backgroundColor:'white',
  		navBarHidden: 'true',
  		windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_PAN,
	});
	window.result = null;
	
	var windowTitleBar = require('ui/handheld/windowNavBar');
	windowTitleBar = new windowTitleBar('100%', 'Appointment', 'Cancel', 'Save');
	window.add(windowTitleBar);
	
	var warning = Ti.UI.createView({
	top: 70,
	width: '100%',
	zIndex: 3,
	height: 70,
	backgroundColor: 'red',
	borderColor: 'red'
	});
	
	warning.add(Ti.UI.createLabel({ text: 'NOTE: This is for personal records, it does not schedule an actual appointment', 
									textAlign: 'center', 
									color: 'white', 
									width: Titanium.Platform.displayCaps.platformWidth*0.90, 
									}));
	window.add(warning);
	
	var cancel_btn = windowTitleBar.leftNavButton;
	
	cancel_btn.addEventListener('click', function() {
		window.close();
	});
	
	var save_btn = windowTitleBar.rightNavButton;
	
	save_btn.addEventListener('click', function() {
		if(table.scrollable == false) { return; }

		var name_test=false, dateTime_test=false, symptoms_test=false;


		if(!isValidDateTime(date.text+' '+time.text) && complete_switcher.value == false) { alert('You may have entered a date that has already passed. Kindly recheck'); }
		else { dateTime_test = true; }
		//Remove the whitespace then test to make sure there are only letters
		var onlyLetters = /^[a-zA-Z]/.test(name.value.replace(/\s/g, ''));
		if(name.value != null && name.value.length > 1 && onlyLetters) { name_test = true; }
		else { alert('Doctors name must be longer than one character and contain only letters'); }
		if(symptoms_field.value == null || symptoms_field.value == '') {
			alert('You must list at least one symptom');
		}
		else { symptoms_test=true; }
		
		if(dateTime_test && name_test && symptoms_test)
		{
			if(diagnosis.value != null) { diagnosis.value = diagnosis.value.replace("'", "''"); } //If diagnosis exists, remove quotes before submitting
			
			if(appointment.id == null) {
				if(!Titanium.Network.online) {
					alert('Error:\n You are not connected to the internet. Cannot create new appointment');
					return;
				}
				
				var entry_id = '"'+appointment.entry_id+'"';
				appointment.id = insertAppointmentLocal(entry_id,appointment.date,appointment.time,diagnosis.value);
				appointment.doctor.id = insertDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value);
			
				createObjectACS('appointments', { id: appointment.id, entry_id: appointment.entry_id, 
													date: appointment.date, time: appointment.time, complete: complete_switcher.value, diagnosis: diagnosis.value, });
			}
			else {
				updateAppointmentLocal(appointment.id,appointment.date,appointment.time,diagnosis.value);
				updateDoctorForAppointmentLocal(appointment.id,name.value,location.value,street.value,city.value,state.value,zip.value,country.value);
			}
			deleteSymptomsForAppointmentLocal(appointment.id);
			appointment.symptoms.splice(0, appointment.symptoms.length);
			
			if(symptoms_field.value != null) {
				if(symptoms_field.value.length > 1) {
					var final_symptoms = symptoms_field.value.split(',');
					for(var i=0;i < final_symptoms.length;i++) {
						if(final_symptoms[i].length < 2) continue;
						final_symptoms[i] = final_symptoms[i].replace(/^\s\s*/, '');  // Remove Preceding white space
						insertSymptomForAppointmentLocal(appointment.id,final_symptoms[i]);
						appointment.symptoms.push(final_symptoms[i]);
					}
				}
			}
			
			updateAppointmentCompleteStatus(appointment.id,complete_switcher.value);
			updateRecordTimesForEntryLocal(appointment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
			
			appointment.doctor.name = name.value;
			appointment.doctor.location = location.value;
			appointment.doctor.street = street.value;
			appointment.doctor.city = city.value;
			appointment.doctor.state = state.value;
			appointment.doctor.zip = zip.value;
			appointment.doctor.country = country.value;
			appointment.complete = complete_switcher.value;
			appointment.diagnosis = diagnosis.value;
			window.result = appointment;
			window.close();
		}

		
	});
	
	var table = Ti.UI.createTableView({ top: 140, separatorColor: 'transparent', });


var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Doctor Details(*=required)' });
sectionDetails.add(Ti.UI.createTableViewRow({ height: 45, }));
sectionDetails.add(Ti.UI.createTableViewRow({ height: 45, }));
sectionDetails.add(Ti.UI.createTableViewRow({ height: 135, }));
var name_title = Titanium.UI.createLabel({ text: '*Name', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var name = Ti.UI.createTextField({ hintText: 'eg: James Smith', color: 'black', value: appointment.doctor.name, left: '40%', width: '60%' });
var location_title = Titanium.UI.createLabel({ text: 'Location', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var location = Ti.UI.createTextField({ hintText: 'Clinic/Hospital name', color: 'black', value: appointment.doctor.location, left: '40%', width: '60%' });
var address_title = Titanium.UI.createLabel({ text: 'Address', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var street = Ti.UI.createTextField({ hintText: 'Street', color: 'black', value: appointment.doctor.street, borderColor: '#CCC', leftButtonPadding: 5, height: 45, width: '60%', left: '40%', top: 0 });
var city = Ti.UI.createTextField({ hintText: 'City', color: 'black', value: appointment.doctor.city, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '40%',  top: 45 });
var state = Ti.UI.createTextField({ hintText: 'State', color: 'black', value: appointment.doctor.state, borderColor: '#CCC', leftButtonPadding: 5, left: '80%', height: 45, width: '20%', top: 45 });
var zip = Ti.UI.createTextField({ hintText: 'ZIP', color: 'black', value: appointment.doctor.zip, borderColor: '#CCC', leftButtonPadding: 5, left: '40%', height: 45, width: '20%', top: 90 });
var country = Ti.UI.createTextField({ hintText: 'Country', color: 'black', value: appointment.doctor.country, borderColor: '#CCC', leftButtonPadding: 5, left: '60%', height: 45, width: '40%', top: 90 });
sectionDetails.rows[0].add(name_title);
sectionDetails.rows[0].add(name);
sectionDetails.rows[1].add(location_title);
sectionDetails.rows[1].add(location);
sectionDetails.rows[2].add(address_title);
sectionDetails.rows[2].add(street);
sectionDetails.rows[2].add(city);
sectionDetails.rows[2].add(state);
sectionDetails.rows[2].add(zip);
sectionDetails.rows[2].add(country);


var sectionDateTime = Ti.UI.createTableViewSection({ headerTitle: 'Date and Time(tap to change)' });
sectionDateTime.add(Ti.UI.createTableViewRow({ height: 45, }));
var date = Ti.UI.createLabel({ text: appointment.date, color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var time = Ti.UI.createLabel({ text: appointment.time, color: 'black', left: 160, font: { fontWeight: 'bold', fontSize: 18, }, });
sectionDateTime.rows[0].add(date);
sectionDateTime.rows[0].add(time);

var sectionSymptoms = Ti.UI.createTableViewSection({ headerTitle: '*Symptoms(list using commas)' });
sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
var symptoms_field = Ti.UI.createTextArea({ hintText: 'Seperate each symptom by comma', value: symptoms_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
sectionSymptoms.rows[0].add(symptoms_field);

var sectionDiagnosis = Ti.UI.createTableViewSection();
sectionDiagnosis.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
sectionDiagnosis.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white' }));
var complete_title = Ti.UI.createLabel({ text: 'Complete', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var complete_switcher = Ti.UI.createSwitch({ value: appointment.complete,  left: '50%', });
var diagnosis_title = Ti.UI.createLabel({ text: 'Diagnosis', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var diagnosis = Ti.UI.createTextField({ hintText: 'Enter here', value: appointment.diagnosis, width: '50%', left: '50%' });
sectionDiagnosis.rows[0].add(complete_title);
sectionDiagnosis.rows[0].add(complete_switcher);
sectionDiagnosis.rows[1].add(diagnosis_title);
sectionDiagnosis.rows[1].add(diagnosis);


table.data = [sectionDateTime, sectionDetails, sectionSymptoms, sectionDiagnosis ];
window.add(table);


date.addEventListener('click', function(e) {
	
modalPicker = require('ui/common/helpers/modalPicker');
var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,null,date.text); 

modalPicker.showDatePickerDialog({
	  value: new Date(date.text),
	  callback: function(e) {
	    if (e.cancel) {
	      
	    } else {
	    	//var result = timeFormatted(e.value);
	      date.text = e.value.toDateString();
	      appointment.date = date.text;
	    }
	  }
	}); 
});

time.addEventListener('click', function(e) {
	
modalPicker = require('ui/common/helpers/modalPicker');
var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE_AND_TIME,null,date.text+' '+time.text); 

modalPicker.showTimePickerDialog({
	  value: new Date(date.text+' '+time.text),
	  callback: function(e) {
	    if (e.cancel) {
	      
	    } else {
	    	var result = timeFormatted(e.value);
	      time.text = result.time;
	      appointment.time = time.text;
	    }
	  }
	}); 
});




return window;


}

module.exports = appointment;
