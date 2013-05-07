
/**
 * input: the parent entry or appointment 
 * input.activities: array of existing activity objects
 * input.treatments: array of existing treatment objects
 */


function prescription(input) {

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

//var navGroupWindow = input.navGroupWindow;
var treatments = input.treatments?input.treatments:[];
var activities = input.activities?input.activities:[];	
	
var symptoms_list='';
var activities_list='';

function getBackgroundColor(the_input)
{
	if(the_input.successful == true) {  //It is was declared successful
		return 'white';
	}
	else if(isValidDate(the_input.end_date)) {  //If the treatment is still in progress
		return 'yellow';
	}
	else { 
		return 'red';   							//If the treatment has ended and an outcome has not been entered
	}
	
	return 'white';
}

	
function loadTreatments()
{
	for(var i=0;i < treatments.length; i++) 
	{
		var medication = Titanium.UI.createLabel({ text: treatments[i].medication, color: 'black', font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5, height: 25, width: '70%', });
		
		symptoms_list = '';
		var length = (treatments[i].symptoms.length<2)?treatments[i].symptoms.length:2;
		for(var j=0;j < length;j++) { 
			symptoms_list += treatments[i].symptoms[j];
			if(j != length-1) symptoms_list += ', '; 
		}
		var difference = treatments[i].symptoms.length - j;
		if(difference > 0) { symptoms_list += ' and '+difference+' more'; } 
		
		var symptom = Titanium.UI.createLabel({ text: symptoms_list, color: 'black', font: { fontSize: 15 }, left: 10, top: 50 });
		var background_color = getBackgroundColor(treatments[i]);
		sectionTreatments.add(Ti.UI.createTableViewRow({ height: 90, backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, index: i }));
		sectionTreatments.rows[i].add(medication);
		sectionTreatments.rows[i].add(symptom);
	}
	
	for(var i=0;i < activities.length; i++) 
	{	
		var main_activity = Titanium.UI.createLabel({ text: activities[i].main_activity, color: 'black', font: {fontWeight: 'bold', fontSize: 20 }, left: 10, top: 5, height: 25, width: '70%' });
		
		activities_list = '';
		var length = (activities[i].goals.length < 4)?activities[i].goals.length:4;
		for(var j=0;j < length;j++) { 
			activities_list += activities[i].goals[j];
			if(j != length-1) activities_list += ', ';  
		}
		var difference = activities[i].goals.length - j;
		if(difference > 0) { activities_list += ' and '+difference+' more'; } 
		
		var goal = Titanium.UI.createLabel({ text: activities_list, color: 'black', font: { fontSize: 15 }, left: 10, top: 50, });
		var background_color = getBackgroundColor(activities[i]);
		sectionActivities.add(Ti.UI.createTableViewRow({ height: 90, backgroundColor: background_color, selectedBackgroundColor: 'white', hasChild: true, index: i }));
		sectionActivities.rows[i].add(main_activity);
		sectionActivities.rows[i].add(goal);
	}
	if(treatments.length > 0) sectionTreatments.headerTitle = 'Treatments';
	if(activities.length > 0) sectionActivities.headerTitle = 'Activities';
	
	table.data = [sectionActivities,sectionTreatments];
}	
	

var self = Titanium.UI.createWindow({
  backgroundColor:'white',
  navBarHidden: true,
  height: 'auto'
});
self.result = null;

var windowTitleBar = require('ui/handheld/windowNavBar');
	windowTitleBar = new windowTitleBar('100%', 'Actions', 'Close', '+');
	self.add(windowTitleBar);

var close_btn = windowTitleBar.leftNavButton;

close_btn.addEventListener('click', function() {
	input.activities = activities;
	input.treatments = treatments;
	self.result = input;
	self.close();
});

var add_btn = windowTitleBar.rightNavButton;

var actionDialog = Titanium.UI.createOptionDialog({
    options: ['New Activity','New Treatment','Cancel'],
    cancel:2
});

actionDialog.addEventListener('click', function(e) {
	if(e.index == 0) {
		var activity_form = require('ui/common/forms/activity_form');
		var activity = { 
			entry_id: input.entry_id?input.entry_id:null, 
			appointment_id: input.appointment_id?input.appointment_id:null, 
			};
		activity_form = new activity_form({ activity: activity });
		activity_form.open(); 
			
			activity_form.addEventListener('close', function() {
				if(activity_form.result != null)
				{
					if(activity_form.result == -1)  { return; }
					
					var main_activity = Titanium.UI.createLabel({ text: activity_form.result.main_activity, color: 'black', font: {fontWeight: 'bold', fontSize: 20 }, left: 10, height: 25, top: 5, width: '70%' });
					
					activities_list = '';
					var length = (activity_form.result.goals.length < 4)?activity_form.result.goals.length:4;
					for(var j=0;j < length;j++) { 
						activities_list += activity_form.result.goals[j]; 
						if(j != length-1) activities_list += ', '; 
					}
					var difference = activity_form.result.goals.length - j;
					if(difference > 0) { activities_list += ' and '+difference+' more'; } 
		
					var goal = Titanium.UI.createLabel({ text: activities_list, color: 'black', font: { fontSize: 15 }, left: 10, top: 50, });
					activities.push(activity_form.result);
					sectionActivities.add(Ti.UI.createTableViewRow({ height: 90, backgroundColor: 'yellow', selectedBackgroundColor: 'white', hasChild: true, index: activities.length-1 }));
					sectionActivities.rows[sectionActivities.rowCount-1].add(main_activity);
					sectionActivities.rows[sectionActivities.rowCount-1].add(goal);
					
					sectionActivities.headerTitle = 'Activities';
					table.data = [sectionActivities,sectionTreatments];
				}
			});
	}
	
	if(e.index == 1) {
		var treatment_form = require('ui/common/forms/treatment_form');
		var treatment = { 
			entry_id: input.entry_id?input.entry_id:null, 
			appointment_id: input.appointment_id?input.appointment_id:null, 
			};
		treatment_form = new treatment_form({treatment: treatment });
		treatment_form.open();  
			
			treatment_form.addEventListener('close', function() {
				if(treatment_form.result != null)
				{
					if(treatment_form.result == -1)  { return; }
					medication = Titanium.UI.createLabel({ text: treatment_form.result.medication, color: 'black', font: {fontWeight: 'bold', fontSize: 20 }, left: 10, height: 25, top: 5, width: '70%', });
														
					symptoms_list = '';
					var length = (treatment_form.result.symptoms.length<2)?treatment_form.result.symptoms.length:2;
					for(var j=0;j < length;j++) { 
						symptoms_list += treatment_form.result.symptoms[j]; 
						if(j != length-1) symptoms_list += ', '; 
					}
					var difference = treatment_form.result.symptoms.length - j;
					if(difference > 0) { symptoms_list += ' and '+difference+' more'; } 
		
					symptom = Titanium.UI.createLabel({ text: symptoms_list, color: 'black', font: { fontSize: 15 }, left: 10, top: 50 });
					treatments.push(treatment_form.result);
					sectionTreatments.add(Ti.UI.createTableViewRow({ height: 90, backgroundColor: 'yellow', selectedBackgroundColor: 'white', hasChild: true, index: treatments.length-1 }));
					sectionTreatments.rows[sectionTreatments.rowCount-1].add(medication);
					sectionTreatments.rows[sectionTreatments.rowCount-1].add(symptom);
					
					sectionTreatments.headerTitle = 'Treatments';
					table.data = [sectionActivities,sectionTreatments];
				}
			});
	}
});

add_btn.addEventListener('click', function() {
	actionDialog.show();
});



var table = Titanium.UI.createTableView({ top: 70, });

var sectionActivities = Ti.UI.createTableViewSection({ headerTitle: 'Activities' });
var sectionTreatments = Ti.UI.createTableViewSection({ headerTitle: 'Treatments' });
loadTreatments();

self.add(table);


	var sectionTreatment_clicked = function(selected_row) {
		var treatment_form = require('ui/common/forms/treatment_form');
			treatments[selected_row.index].entry_id = input.entry?input.entry.id:null; 
			treatments[selected_row.index].appointment_id = input.appointment?input.appointment.id:null;
			treatment_form = new treatment_form({ treatment: treatments[selected_row.index] });
			treatment_form.open(); 	
			
			treatment_form.addEventListener('close', function() {
				if(treatment_form.result != null)
				{
					if(treatment_form.result == -1) {
						sectionTreatments.remove(selected_row);
						treatments.splice(selected_row.index,1);
						for(var i=selected_row.index; i < treatments.length; i++) { sectionTreatments.rows[i].index = i; }
						if(treatments.length == 0) sectionTreatments.headerTitle = '';
						table.data = [sectionActivities,sectionTreatments];
						return;
					}
					
					selected_row.backgroundColor = getBackgroundColor(treatment_form.result);
					
					treatments[selected_row.index] = treatment_form.result;
					selected_row.children[0].text = treatment_form.result.medication;
		
					symptoms_list = '';
					var length = (treatment_form.result.symptoms.length<2)?treatment_form.result.symptoms.length:2;
					for(var j=0;j < length;j++) { 
						symptoms_list += treatment_form.result.symptoms[j]; 
						if(j != length-1) symptoms_list += ', '; 
					}
					var difference = treatment_form.result.symptoms.length - j;
					if(difference > 0) { symptoms_list += ' and '+difference+' more'; }
					selected_row.children[1].text = symptoms_list;
					
					table.data = [sectionActivities,sectionTreatments];
				}
			});
};


var sectionActivities_clicked =  function(selected_row) {
	var activity_form = require('ui/common/forms/activity_form');
			activities[selected_row.index].entry_id = input.entry_id?input.entry_id:null; 
			activities[selected_row.index].appointment_id = input.appointment_id?input.appointment_id:null;
			activity_form = new activity_form({ activity: activities[selected_row.index] });
			activity_form.open();	
			
			activity_form.addEventListener('close', function() {
				if(activity_form.result != null)
				{
					if(activity_form.result == -1) {
						sectionActivities.remove(selected_row);
						activities.splice(selected_row.index,1);
						for(var i=selected_row.index; i < activities.length; i++) { sectionActivities.rows[i].index = i; }
						if(activities.length == 0) sectionActivities.headerTitle='';
						table.data = [sectionActivities,sectionTreatments];
						return;
					}
					
					selected_row.backgroundColor = getBackgroundColor(activity_form.result);
					activities[selected_row.index] = activity_form.result;
					selected_row.children[0].text = activity_form.result.main_activity;
					
					activities_list = '';
					var length = (activity_form.result.goals.length < 4)?activity_form.result.goals.length:4;
					for(var j=0;j < length;j++) { 
						activities_list += activity_form.result.goals[j]; 
						if(j != length-1) activities_list += ', '; 
					}
					var difference = activity_form.result.goals.length - j;
					if(difference > 0) { activities_list += ' and '+difference+' more'; } 
					selected_row.children[1].text = activities_list;
					
					table.data = [sectionActivities,sectionTreatments];
				}
			});
};

table.addEventListener('click', function(e) {
	if(e.section.headerTitle == 'Activities') {
		sectionActivities_clicked(e.row);
	}
	else if(e.section.headerTitle == 'Treatments') {
		sectionTreatment_clicked(e.row);
	}  
});

	return self;
};

module.exports = prescription;