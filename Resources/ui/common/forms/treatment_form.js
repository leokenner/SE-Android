/**
 * inputs:
 *   navGroupWindow; the navgroup its part of
 *   treatment
 */


function treatment(input) {
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


var treatment = {
		id: input.treatment.id?input.treatment.id:null,
		cloud_id: input.treatment.cloud_id?input.treatment.cloud_id:null,
		entry_id: input.treatment.entry_id?input.treatment.entry_id:null,
		appointment_id: input.treatment.appointment_id?input.treatment.appointment_id:null,
		start_date: input.treatment.start_date?input.treatment.start_date:timeFormatted(new Date).date,
		end_date: input.treatment.end_date?input.treatment.end_date:timeFormatted(new Date).date,
		medication: input.treatment.medication?input.treatment.medication:null,
		dosage: input.treatment.dosage?input.treatment.dosage:null,
		frequency: input.treatment.frequency?input.treatment.frequency:'Tap to change',
		symptoms: input.treatment.symptoms?input.treatment.symptoms:[],
		sideEffects: input.treatment.sideEffects?input.treatment.sideEffects:[],
		successful: (input.treatment.successful == 1)?true:false,
		facebook_id: input.treatment.facebook_id?input.treatment.facebook_id:null,
	}
	
	var symptoms_string='';
	for(var i=0;i < treatment.symptoms.length; i++) {
		symptoms_string += treatment.symptoms[i];
		if(i != treatment.symptoms.length -1) symptoms_string += ', ';
	}
	
	var sideEffects_string='';
	for(var i=0;i < treatment.sideEffects.length; i++) {
		sideEffects_string += treatment.sideEffects[i];
		if(i != treatment.sideEffects.length -1) sideEffects_string += ', ';
	}
	
	var share_background_color = treatment.facebook_id?'#CCC':
								(!treatment.successful)?'#CCC':(!Titanium.Network.online)?'#CCC':(!Titanium.Facebook.loggedIn)?'#CCC':'blue';


var window = Titanium.UI.createWindow({
  backgroundColor:'white',
  windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_PAN,
  navBarHidden: 'true',
});
window.result = null;

var windowTitleBar = require('ui/handheld/windowNavBar');
	windowTitleBar = new windowTitleBar('100%', 'Treatment', 'Cancel', 'Save');
	window.add(windowTitleBar);

var cancel_btn = windowTitleBar.leftNavButton;

cancel_btn.addEventListener('click', function() {
	window.close();
});

var save_btn = windowTitleBar.rightNavButton;

save_btn.addEventListener('click', function() {
	var medication_test = false, dosage_test = false, frequency_test = false, symptoms_test=false, date_test = false;
	
	if(!isValidDate(start_date.text)) { alert('Your start date seems to be invalid. Please recheck'); }
	else if(!isValidDate(end_date.text)) { alert('Your end date seems to be invalid. Please recheck'); }
	else if(!isStartBeforeEnd(start_date.text,end_date.text)) 
	{ alert('Your end date seems to be before your start date. Please correct'); }
	else { date_test = true; }
	if(medication.value.length >= 3) { medication_test=true; }
	else { alert('The listed medication seems to be invalid. It should be at least 3 characters'); }
	if(dosage.value.length >= 2) { dosage_test=true; }
	else { alert('The listed dosage seems to be invalid. It should be at least 2 characters'); }
	if(frequency.text != 'Tap to change') { frequency_test=true; }
	else { alert('Place enter the frequency of the medication'); }
	if(symptoms_field.value == null || symptoms_field.value == '') {
		alert('You must list at least one symptom');
	}
	else { symptoms_test=true; }
	
	if(medication_test && dosage_test && frequency_test && symptoms_test && date_test)
	{
			if(treatment.id == null) {
				if(!Titanium.Network.online) {
					alert('Error:\n You are not connected to the internet. Cannot create new treatment');
					return;
				}
				
				if(treatment.appointment_id != null) {
					var appointment_id = '"'+treatment.appointment_id+'"';
					treatment.id = insertTreatmentLocal(null,appointment_id,start_date.text,end_date.text,medication.value,dosage.value,frequency.text);
				}
				else {
					var entry_id = '"'+treatment.entry_id+'"'; 
					treatment.id = insertTreatmentLocal(entry_id,null,start_date.text,end_date.text,medication.value,dosage.value,frequency.text);
				}
				createObjectACS('treatments', { id: treatment.id, start_date: start_date.text, end_date: end_date.text, 
												medication: medication.value, dosage: dosage.value, frequency: frequency.text, });

			}
			else {
				updateTreatmentLocal(treatment.id,start_date.text,end_date.text,medication.value,dosage.value,frequency.text);
			}
			deleteSymptomsForTreatmentLocal(treatment.id);
			deleteSideEffectsForTreatmentLocal(treatment.id);
			treatment.symptoms.splice(0, treatment.symptoms.length);
			treatment.sideEffects.splice(0, treatment.sideEffects.length);
			
			if(symptoms_field.value != null) {
				if(symptoms_field.value.length > 1) {
					var final_symptoms = symptoms_field.value.split(',');
					for(var i=0;i < final_symptoms.length;i++) {
						if(final_symptoms[i].length < 2) continue;
						final_symptoms[i] = final_symptoms[i].replace(/^\s\s*/, '');  // Remove Preceding white space
						insertSymptomForTreatmentLocal(treatment.id,final_symptoms[i]);
						treatment.symptoms.push(final_symptoms[i]);
					}
				}
			}
			
			if(sideEffects_field.value != null) {
				if(sideEffects_field.value.length > 1) {
					var final_sideEffects = sideEffects_field.value.split(',');
					for(var i=0;i < final_sideEffects.length;i++) {
						if(final_sideEffects[i].length < 2) continue;
						final_sideEffects[i] = final_sideEffects[i].replace(/^\s\s*/, '');  // Remove Preceding white space
						insertSideEffectForTreatmentLocal(treatment.id,final_sideEffects[i]);
						treatment.sideEffects.push(final_sideEffects[i]);
					}
				}
			}
			
			
			updateTreatmentSuccessStatus(treatment.id,successful_switcher.value);
			//var record_incident_id = getAppointmentLocal(treatment.appointment_id)[0].incident_id;
			updateRecordTimesForEntryLocal(treatment.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
			
			treatment.start_date = start_date.text;
			treatment.end_date = end_date.text;
			treatment.medication = medication.value;
			treatment.dosage = dosage.value;
			treatment.frequency = frequency.text;
			treatment.successful = successful_switcher.value;
			window.result = treatment;
			window.close();
	}
});

	

var table = Titanium.UI.createTableView({ top: 70, separatorColor: 'transparent', });

var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Details(* = required)' });
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
var startDate_title = Titanium.UI.createLabel({ text: '*Start date', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var start_date = Titanium.UI.createLabel({ text: treatment.start_date, color: 'black', width: '55%', left: '45%' });
var endDate_title = Titanium.UI.createLabel({ text: '*End date', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var end_date = Titanium.UI.createLabel({ text: treatment.end_date, color: 'black', width: '55%', left: '45%' });
var medication_title = Titanium.UI.createLabel({ text: '*Medication', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var medication = Titanium.UI.createTextField({ hintText: 'eg: Panadol', color: 'black', value: treatment.medication, width: '55%', left: '45%' });
var dosage_title = Titanium.UI.createLabel({ text: '*Dosage', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var dosage = Titanium.UI.createTextField({ hintText: 'eg: 100mL', color: 'black', value: treatment.dosage, width: '55%', left: '45%' });
var frequency_title = Titanium.UI.createLabel({ text: '*Frequency', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var frequency = Titanium.UI.createLabel({ text: treatment.frequency, color: 'black', width: '55%', left: '45%' });
sectionDetails.rows[0].add(startDate_title);
sectionDetails.rows[0].add(start_date);
sectionDetails.rows[1].add(endDate_title);
sectionDetails.rows[1].add(end_date);
sectionDetails.rows[2].add(medication_title);
sectionDetails.rows[2].add(medication);
sectionDetails.rows[3].add(dosage_title);
sectionDetails.rows[3].add(dosage);
sectionDetails.rows[4].add(frequency_title);
sectionDetails.rows[4].add(frequency);

var sectionSymptoms = Ti.UI.createTableViewSection({ headerTitle: '*Symptoms(list using commas)' });
sectionSymptoms.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
var symptoms_field = Titanium.UI.createTextArea({ hintText: 'Seperate each symptom by comma', color: 'black', value: symptoms_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
sectionSymptoms.rows[0].add(symptoms_field);

var sectionOutcome = Ti.UI.createTableViewSection();
sectionOutcome.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
var success_title = Titanium.UI.createLabel({ text: 'Successful?', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
var successful_switcher = Titanium.UI.createSwitch({ value: treatment.successful, right: 10 });
sectionOutcome.rows[0].add(success_title);
sectionOutcome.rows[0].add(successful_switcher);

/*
successful_switcher.addEventListener('change', function() {
		if(successful_switcher.value == true && Titanium.Network.online && 
			Titanium.Facebook.loggedIn && treatment.facebook_id == null) { 
			sectionShare.rows[0].backgroundColor = 'blue';
			return;
		}
		sectionShare.rows[0].backgroundColor = '#CCC';
	});  */

var sectionSideEffects = Ti.UI.createTableViewSection({ headerTitle: 'Side effects(list using commas)' });
sectionSideEffects.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
var sideEffects_field = Titanium.UI.createTextArea({ hintText: 'Seperate each entry by comma', color: 'black', value: sideEffects_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
sectionSideEffects.rows[0].add(sideEffects_field);

	var activity = window.activity;

	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var sectionShare = menu.add({ 
	    title: "Share on Facebook", 
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	  var sectionDelete = menu.add({ 
	    title: "Delete Treatment", 
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	
	sectionShare.addEventListener('click', function() {
		if(!Titanium.Network.online) {
			alert('Sorry, an internet connection is required to share on Facebook');
			return;
		}
		if(!Titanium.Facebook.loggedIn) {
			alert('Sorry, it seems like you are not logged into Facebook');
			return;
		}
		if(treatment.facebook_id) {
			alert('This treatment has already been shared on facebook');
			return;
		}
		if(!successful_switcher.value) {
			alert('You must declare a treatment successful in order to be able to share it on Facebook');
			return;
		}
		
		var child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		
		var share_symptoms = symptoms_field.value.split(',');
		
		var fb_endDate = new Date(end_date.text);
		var fb_startDate = new Date(start_date.text);
		var days = parseInt((fb_endDate-fb_startDate)/(24*3600*1000));
		
		if(treatment.appointment_id) {
			var doctor_name = getDoctorByAppointmentLocal(treatment.appointment_id)[0].name;
			var description = child.first_name+" successfully completed a treatment of " + 
								treatment.medication + " over " + days + " days as prescribed by Dr. " + doctor_name;
		}
		else {
			var description = child.first_name+" successfully completed a treatment of " + treatment.medication + 
								" over " + days + " days and was cured of " + share_symptoms.length + " symptoms"; 
		}
		
		var data = {
   			link : "http://www.starsearth.com",
		    name : "Treatment successfully completed",
		    message : "By: "+child.first_name+" "+child.last_name,
		    caption : "By: "+child.first_name+" "+child.last_name,
		    picture : "http://pcfrivesdedordogne.pcf.fr/sites/default/files/imagecache/image/arton1.png",
		    description : description,
		}
		
		Titanium.Facebook.dialog("feed", data, function(e) {
		    if(e.success && e.result) {
		    	sectionShare.rows[0].backgroundColor = '#CCC';
		    	treatment.facebook_id = e.result.split('=')[1];
		    	updateTreatmentFacebookId(treatment.id, '"'+treatment.facebook_id+'"');
		        //alert("Success! New Post ID: " + e.result); Begins with post_id= 
		    } else {
		        if(e.error) {
		            alert(e.error);
		        } else {
		            alert("Dialog closed");
		        }
		    }
		});
	});


sectionDelete.addEventListener('click', function() {
	if(!treatment.id) {
		alert('This treatment has not been saved. If you wish to delete it, simply press cancel at the top left corner');
		return;
	}
	var confirm = Titanium.UI.createAlertDialog({ title: 'Are you sure?', 
								message: 'This cannot be undone', 
								buttonNames: ['Yes','No'], cancel: 1 });
								
	confirm.addEventListener('click', function(g) { 
   			//Clicked cancel, first check is for iphone, second for android
   			if (g.cancel === g.index || g.cancel === true) { return; }


  			 switch (g.index) {
     		 case 0:
     		  	treatment.cloud_id = treatment.cloud_id?treatment.cloud_id:getTreatmentLocal(treatment.id)[0].cloud_id;
				deleteTreatmentLocal(treatment.id);			
				deleteObjectACS('treatments', treatment.cloud_id);
				window.result = -1;
				window.close();
      			break;

      		 case 1:       			
      		 default: break;
  			}
		});
		confirm.show();
});

}

table.data = [sectionDetails,sectionSymptoms, sectionOutcome, sectionSideEffects ];
window.add(table);

//Functions that works with the modal picker to change the date
//input: date: the object that we need to work with(label object)
function changeDate(date)
{
var modalPicker = require('ui/common/helpers/modalPicker');
modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,null,date.text); 

modalPicker.showDatePickerDialog({
	  value: new Date(date.text),
	  callback: function(e) {
	    if (e.cancel) {
	      
	    } else {
	      date.text = e.value.toDateString();
	    }
	  }
	}); 
}



start_date.addEventListener('click', function() {
	changeDate(start_date);
	treatment.start_date = start_date.text;
	});
end_date.addEventListener('click', function() {
	changeDate(end_date);
	treatment.end_date = end_date.text;
	});
frequency.addEventListener('click', function() {
	var data = [];
	data[0] = [];
	data[1] = [];
	for(var i=1;i<11;i++) { data[0][i-1] = i; }
	data[1][0] = 'Every Hour';
	for(var i=2;i<13;i++) { data[1][i-1] = 'Every '+i+' Hours'; }
	data[1][12] = 'Every Day';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker('picker_columns',data,frequency.text); 

	var pickerWindow = Ti.UI.createWindow({ backgroundColor: 'transparent', });
	pickerWindow.add(modalPicker);

	var main_button = Ti.UI.createView({ backgroundColor: 'transparent', height: 50, width: 200, top: '62%', });
	var cancel_btn = Ti.UI.createView({ backgroundColor: 'black', height: 50, width: 90, left: 0, });
	var cancel_txt = Ti.UI.createLabel({ text: 'Cancel', color: 'white', font: { fontSize: 15, }, });
	var submit_btn = Ti.UI.createView({ backgroundColor: 'black', height: 50, width: 90, right: 0, });
	var submit_txt = Ti.UI.createLabel({ text: 'Save', color: 'white', font: { fontSize: 15, }, });
	cancel_btn.add(cancel_txt);
	submit_btn.add(submit_txt);
	main_button.add(cancel_btn);
	main_button.add(submit_btn);
	pickerWindow.add(main_button);
	
	pickerWindow.addEventListener('click', function() {
		pickerWindow.close();
	});
	
	cancel_btn.addEventListener('click', function() {
		pickerWindow.close();
	});
	
	submit_btn.addEventListener('click', function() {
		frequency.text = modalPicker.getSelectedRow(0).title + ' '+ modalPicker.getSelectedRow(1).title;
		pickerWindow.close();
	});
	
	pickerWindow.open();
});

	return window;
};

module.exports = treatment;