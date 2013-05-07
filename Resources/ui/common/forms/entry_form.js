

function entry_form(input)
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
	
	var entry = {
		id: input.id?input.id:null,
		record_id: input.record_id?input.record_id:null,
		main_entry: input.main_entry?input.main_entry:null,
		date: input.date?input.date:timeFormatted(new Date).date,
		time: input.time?input.time:timeFormatted(new Date).time,
		goals: input.goals?input.goals:[],
		activities: input.activities?input.activities:[],
		treatments: input.treatments?input.treatments:[],
	}
	
		
	var win = Ti.UI.createWindow({
		backgroundColor: 'white',
		navBarHidden: true,
		windowSoftInputMode: Ti.UI.Android.SOFT_INPUT_ADJUST_PAN,
	});
	win.result=null;
	
	var windowTitleBar = require('ui/handheld/windowNavBar');
	windowTitleBar = new windowTitleBar('100%', 'Entry', 'Cancel', 'Save');
	win.add(windowTitleBar);
	
	var cancel_btn = windowTitleBar.leftNavButton;
	
	cancel_btn.addEventListener('click', function() {
		win.close();
	});
	
	var save_btn = windowTitleBar.rightNavButton;
	
	save_btn.addEventListener('click', function() {
		if(table.scrollable == false) { return; }
		
		if(main_entry.value == null || main_entry.value == '') {
			alert('You do not seem to have entered anything for entry. Please re-check');
			return;
		}
		
		if(entry.record_id == null) {
			if(!Titanium.Network.online) {
				alert('Error:\n You are not connected to the internet. Cannot create new entry');
				return;
			}
			
			entry.record_id = insertRecordLocal(Titanium.App.Properties.getString('child'));
			entry.id = insertEntryLocal(entry.record_id,main_entry.value,entry.date,location.value);
			updateRecordLocal(entry.record_id,entry.id,'entry',timeFormatted(new Date()).date,timeFormatted(new Date()).time);
			
			createObjectACS('records', { id: entry.record_id, child_id: Titanium.App.Properties.getString('child'), current: entry.id,
										current_type: 'entry', latest_date: timeFormatted(new Date()).date, latest_time: timeFormatted(new Date()).time, });		
		
		
			createObjectACS('entries', { id: entry.id, record_id: entry.record_id, main_entry: main_entry.value, 
											date: entry.date, location: location.value, });
		}
		else if(entry.id == null) {
			entry.id = insertEntryLocal(entry.record_id,main_entry.value,entry.date,location.value);
			updateRecordLocal(entry.record_id,Titanium.App.Properties.getString('child'),entry.id,'entry',timeFormatted(new Date()).date,timeFormatted(new Date()).time);
		
			createObjectACS('entries', { id: entry.id, record_id: entry.record_id, main_entry: main_entry.value, 
											date: entry.date, location: location.value, });
		}
		else {
			updateEntryLocal(entry.id,main_entry.value,entry.date,location.value);
			updateRecordTimesForEntryLocal(entry.id, timeFormatted(new Date()).date, timeFormatted(new Date()).time);
		}
		
		entry.main_entry = main_entry.value;
		entry.location = location.value;
		win.result = entry;
		win.close();
	});
	
	
	var table = Ti.UI.createTableView({ top: 70, separatorColor: 'transparent', });
	
	var sectionDate = Ti.UI.createTableViewSection({ headerTitle: 'When did it happen?'});
	sectionDate.add(Ti.UI.createTableViewRow({ height: 45, }));
	var dateTime_title = Titanium.UI.createLabel({ text: 'Date', left: 15, color: 'black', font: { fontWeight: 'bold', fontSize: 18, }, });
	var dateTime = Titanium.UI.createLabel({ text: entry.date, color: 'black', width: '50%', left: '35%' });
	sectionDate.rows[0].add(dateTime_title);
	sectionDate.rows[0].add(dateTime);
	
	var sectionMain = Ti.UI.createTableViewSection({ headerTitle: 'Main entry(required)'});
	sectionMain.add(Ti.UI.createTableViewRow({ height: 160 })); 
	var main_entry = Titanium.UI.createTextArea({ hintText: 'Enter here', value: entry.main_entry, width: '100%', top: 5, font: { fontSize: 17 }, height: 140, borderRadius: 10 });
	sectionMain.rows[0].add(main_entry);
	
	var sectionLocation = Ti.UI.createTableViewSection({ headerTitle: 'Where did it occur?' });
	sectionLocation.add(Ti.UI.createTableViewRow());
	var location_title = Titanium.UI.createLabel({ text: 'Location', left: 15, color: 'black', font: { fontWeight: 'bold', fontSize: 18, }, });
	var location = Titanium.UI.createTextField({ hintText: 'eg: home', value: entry.location, width: '50%', left: '35%' });
	sectionLocation.rows[0].add(location_title);
	sectionLocation.rows[0].add(location);
	
	
	table.data = [sectionDate, sectionMain, sectionLocation];
	
	win.add(table);
	

dateTime.addEventListener('click', function(e) {
	
	modalPicker = require('ui/common/helpers/modalPicker');
	var modalPicker = new modalPicker(Ti.UI.PICKER_TYPE_DATE,'incident',dateTime.text); 

	modalPicker.showDatePickerDialog({
	  value: new Date(dateTime.text),
	  callback: function(e) {
	    if (e.cancel) {
	      
	    } else {
	      dateTime.text = timeFormatted(e.value).date;
	      entry.date = dateTime.text;
	    }
	  }
	}); 
});


return win;	
	
}

module.exports = entry_form;
