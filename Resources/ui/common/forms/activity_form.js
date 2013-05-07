



function activity(input)
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

var activity = {
		id: input.activity.id?input.activity.id:null,
		cloud_id: input.activity.cloud_id?input.activity.cloud_id:null,
		entry_id: input.activity.entry_id?input.activity.entry_id:null,
		appointment_id: input.activity.appointment_id?input.activity.appointment_id:null,
		main_actvity: input.activity.main_activity?input.activity.main_activity:null,
		start_date: input.activity.start_date?input.activity.start_date:timeFormatted(new Date).date,
		end_date: input.activity.end_date?input.activity.end_date:timeFormatted(new Date).date,
		frequency: input.activity.frequency?input.activity.frequency:'Tap to change',
		location: input.activity.location?input.activity.location:null,
		goals: input.activity.goals?input.activity.goals:[],
		end_notes: input.activity.end_notes?input.activity.end_notes:null,
		successful: (input.activity.successful == 1)?true:false,
		facebook_id: input.activity.facebook_id?input.activity.facebook_id:null,
	}
	
	var goals_string='';
	for(var i=0;i < activity.goals.length; i++) {
		goals_string += activity.goals[i];
		if(i != activity.goals.length -1) goals_string += ', ';
	}
	
	var share_background_color = activity.facebook_id?'#CCC':
								(!activity.successful)?'#CCC':(!Titanium.Network.online)?'#CCC':(!Titanium.Facebook.loggedIn)?'#CCC':'blue';

var window = Titanium.UI.createWindow({
  backgroundColor:'white',
  navBarHidden: true,
  windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_PAN,
});
window.result = null;

var windowTitleBar = require('ui/handheld/windowNavBar');
	windowTitleBar = new windowTitleBar('100%', 'Activity', 'Cancel', 'Save');
	window.add(windowTitleBar);

var cancel_btn = windowTitleBar.leftNavButton;

cancel_btn.addEventListener('click', function() {
	window.close();
});

var save_btn = windowTitleBar.rightNavButton;

save_btn.addEventListener('click', function() {
	var activity_test = false, frequency_test = false, date_test = false, goals_test=false;
	
	if(activity_field.value == null || activity_field.value == '') {
		alert('You do not seem to have entered anything for activity. Please re-check');
	}
	else { activity_test=true; }
	if(frequency.text != 'Tap to change') { frequency_test=true; }
	else { alert('Place enter the frequency of the activity'); }
	if(!isValidDate(start_date.text)) { alert('Your start date seems to be invalid. Please recheck'); }
	else if(!isValidDate(end_date.text)) { alert('Your end date seems to be invalid. Please recheck'); }
	else if(!isStartBeforeEnd(start_date.text,end_date.text)) 
	{ alert('Your end date seems to be before your start date. Please correct'); }
	else { date_test = true; }
	if(goals_field.value == null || goals_field.value == '') {
		alert('You must list at least one goal');
	}
	else { goals_test=true; }
	
	if(activity_test && frequency_test && date_test && goals_test)
	{
		if(activity.id == null) {
			if(!Titanium.Network.online) {
				alert('Error:\n You are not connected to the internet. Cannot create new activity');
				return;
			}
			
			if(activity.appointment_id != null) {
				var appointment_id = '"'+activity.appointment_id+'"';
				activity.id = insertActivityLocal(null,appointment_id, activity_field.value, start_date.text, end_date.text, location.value, frequency.text);
			}
			else { 
				var entry_id = '"'+activity.entry_id+'"';
				activity.id = insertActivityLocal(entry_id,null,activity_field.value, start_date.text, end_date.text, location.value, frequency.text);
			}
			
			createObjectACS('activities', { id: activity.id, activity_field: activity_field.value, start_date: start_date.text,
											end_date: end_date.text, location: location.value, frequency: frequency.text, end_notes: endNotes_field.value });
		}
		else {
				updateActivityLocal(activity.id,start_date.text,end_date.text,activity_field.value,location.value,frequency.text);
		}
		deleteGoalsForActivityLocal(activity.id);
		activity.goals.splice(0, activity.goals.length);
		if(goals_field.value != null) {
			if(goals_field.value.length > 1) {
				var final_goals = goals_field.value.split(',');
				for(var i=0;i < final_goals.length; i++) {
					if(final_goals[i].length < 2) continue;
					final_goals[i] = final_goals[i].replace(/^\s\s*/, '');  // Remove Preceding white space
					insertGoalForActivityLocal(activity.id,final_goals[i]);
					activity.goals.push(final_goals[i]);
				}
			}
		}
		
		updateActivitySuccessStatus(activity.id,successful_switcher.value);
		if(endNotes_field.value != null || endNotes_field.value.length > 1) updateActivityEndNotes(activity.id,endNotes_field.value);
		updateRecordTimesForEntryLocal(activity.entry_id,timeFormatted(new Date()).date,timeFormatted(new Date()).time);
		
		activity.start_date = start_date.text;
		activity.end_date = end_date.text;
		activity.main_activity = activity_field.value;
		activity.frequency = frequency.text;
		activity.location = location.value;
		activity.successful = successful_switcher.value;
		activity.end_notes = endNotes_field.value;
		window.result = activity;
		window.close();
	}
	
});

var table = Ti.UI.createTableView({ top: 70, separatorColor: 'transparent', });
	
	var sectionGoals = Ti.UI.createTableViewSection({ headerTitle: '*Goals(list using commas)' });
	sectionGoals.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
	var goals_field = Titanium.UI.createTextArea({ hintText: 'Seperate each goal by comma', value: goals_string, width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
	sectionGoals.rows[0].add(goals_field);
	
	var sectionActivity = Ti.UI.createTableViewSection({ headerTitle: 'Activity description(required)'});
	sectionActivity.add(Ti.UI.createTableViewRow({ height: 160 })); 
	var main_activity = activity.main_actvity;
	var activity_field = Titanium.UI.createTextArea({ hintText: 'Enter here', value: main_activity, width: '100%', top: 5, font: { fontSize: 17 }, height: 140, borderRadius: 10 });
	sectionActivity.rows[0].add(activity_field);
	
	var sectionDetails = Ti.UI.createTableViewSection({ headerTitle: 'Details(* = required)' });
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
	sectionDetails.add(Ti.UI.createTableViewRow({ selectedBackgroundColor: 'white', height: 45, }));
	var startDate_title = Titanium.UI.createLabel({ text: '*Start date', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var start_date = Titanium.UI.createLabel({ text: activity.start_date, color: 'black', width: '55%', left: '45%' });
	var endDate_title = Titanium.UI.createLabel({ text: '*End date', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var end_date = Titanium.UI.createLabel({ text: activity.end_date, color: 'black', width: '55%', left: '45%' });
	var frequency_title = Titanium.UI.createLabel({ text: '*Frequency', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var frequency = Titanium.UI.createLabel({ text: activity.frequency, color: 'black', width: '55%', left: '45%' });
	var location_title = Titanium.UI.createLabel({ text: 'Location', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var location = Titanium.UI.createTextField({ hintText: 'eg: home', color: 'black', value: activity.location, width: '55%', left: '45%' });
	sectionDetails.rows[0].add(startDate_title);
	sectionDetails.rows[0].add(start_date);
	sectionDetails.rows[1].add(endDate_title);
	sectionDetails.rows[1].add(end_date);
	sectionDetails.rows[2].add(frequency_title);
	sectionDetails.rows[2].add(frequency);
	sectionDetails.rows[3].add(location_title);
	sectionDetails.rows[3].add(location);
	
	var sectionOutcome = Ti.UI.createTableViewSection();
	sectionOutcome.add(Ti.UI.createTableViewRow({ height: 45, selectedBackgroundColor: 'white' }));
	var success_title = Titanium.UI.createLabel({ text: 'Successful?', color: 'black', left: 15, font: { fontWeight: 'bold', fontSize: 18, }, });
	var successful_switcher = Titanium.UI.createSwitch({ value: activity.successful, right: 10 });
	sectionOutcome.rows[0].add(success_title);
	sectionOutcome.rows[0].add(successful_switcher);
	
/*	successful_switcher.addEventListener('change', function() {
		if(successful_switcher.value == true && Titanium.Network.online && 
			Titanium.Facebook.loggedIn && activity.facebook_id == null) { 
			sectionShare.backgroundColor = 'blue';
			return;
		}
		sectionShare.backgroundColor = '#CCC';
		
	});  */
	
	var sectionEndNotes = Ti.UI.createTableViewSection({ headerTitle: 'Observations?' });
	sectionEndNotes.add(Ti.UI.createTableViewRow({ height: 90, selectedBackgroundColor: 'white' }));
	var endNotes_field = Titanium.UI.createTextArea({ value: activity.end_notes, color: 'black', width: '100%', top: 5, font: { fontSize: 17 }, height: 70, borderRadius: 10 });
	sectionEndNotes.rows[0].add(endNotes_field);
	

	var window_activity = window.activity;

	window_activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var sectionShare = menu.add({ 
	    title: "Share on Facebook", 
	    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
	  });
	  var sectionDelete = menu.add({ 
	    title: "Delete Activity", 
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
		if(activity.facebook_id) {
			alert('This activity has already been shared on facebook');
			return;
		}
		if(!successful_switcher.value) {
			alert('You must declare an activity successful in order to be able to share it on Facebook');
			return;
		}
		var child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		
		var share_goals = goals_field.value.split(',');
		
		if(activity.appointment_id) {
			var doctor_name = getDoctorByAppointmentLocal(activity.appointment_id)[0].name;
			var description = child.first_name+" successfully completed an activity and achieved the " + share_goals.length + 
							  " goals as set by Dr. "+doctor_name;
		}
		else {
			var description = child.first_name+" successfully completed an activity and achieved the " + share_goals.length + 
							  " goals as set by me";
		}
		
		var data = {
   			link : "http://www.starsearth.com",
		    name : "Activity successfully completed",
		    message : "By: "+child.first_name+" "+child.last_name,
		    caption : "By: "+child.first_name+" "+child.last_name,
		    picture : "http://pcfrivesdedordogne.pcf.fr/sites/default/files/imagecache/image/arton1.png",
		    description : description,
		}
		
		Titanium.Facebook.dialog("feed", data, function(e) {
		    if(e.success && e.result) {
		    	sectionShare.rows[0].backgroundColor = '#CCC';
		    	activity.facebook_id = e.result.split('=')[1];
		    	updateActivityFacebookId(activity.id, '"'+activity.facebook_id+'"');
		        //alert("Success! New Post ID: " + e.result); starts with post_id=
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
		if(!activity.id) {
			alert('This activity has not been saved. If you wish to delete it, simply press cancel at the top left corner');
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
     		    activity.cloud_id = activity.cloud_id?activity.cloud_id:getActivityLocal(activity.id)[0].cloud_id; 
				deleteActivityLocal(activity.id);
				deleteObjectACS('activities', activity.cloud_id);
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
	
	table.data = [sectionDetails, sectionGoals, sectionActivity, sectionOutcome, sectionEndNotes];
	
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
	activity.start_date = start_date.text;
	});
end_date.addEventListener('click', function() {
	changeDate(end_date);
	activity.end_date = end_date.text;
	});	

frequency.addEventListener('click', function() {
	var data = [];
	data[0] = [];
	data[1] = [];
	for(var i=1;i<11;i++) { data[0][i-1] = i; }
	data[1][0] = 'Every Hour';
	data[1][1] = 'Every Day';
	data[1][2] = 'Every Night';
	data[1][3] = 'After School';
	data[1][4] = 'Before School';
	data[1][5] = 'Every Week';
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker('picker_columns',data,frequency.text); 

	var pickerWindow = Ti.UI.createWindow({ backgroundColor: 'transparent' });
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

}

module.exports = activity;
