


function entryView(input)
{
Ti.include('/ui/common/helpers/dateTime.js');
	
	var view = Ti.UI.createView({
		backgroundColor: 'white',
		borderColor: 'black',
		borderWidth: 1,
		width: '100%',
		height: 250,
	});
	
	var dateTime = Ti.UI.createLabel({ 
		text: input.date?input.date:'',
		color: 'black',
		left: 5,
		height: 40,
		top: 0, 
		font: { fontSize: 15 },
	});
	
	var top_line = Ti.UI.createView({ width: 200, height: 2, top: 40, left: 0, borderColor: 'black', borderWidth: 1, });
	
	var main_entry = Ti.UI.createLabel({
		text: input.main_entry?input.main_entry:'No entry to display',
		textAlign: 'center',
		color: 'black',
		font: { fontSize: 15, },
		width: '90%',
		height: 160,
	});
	
	var bottom_line = Ti.UI.createView({ width: 200, height: 2, bottom: 40, right: 0, borderColor: 'black', borderWidth: 1, });
	
	var status = Ti.UI.createLabel({
		text: input.activities.length+' activities and '+input.treatments.length+' treatments',
		color: 'black',
		right: 5,
		bottom: 0,
		height: 40,
		bubbleParent: false,
		font: { fontSize: 15 },
	});
	status.setBubbleParent(false);
	
	view.add(dateTime);
	view.add(top_line);
	view.add(main_entry);
	view.add(bottom_line);
	view.add(status);
	
	view.addEventListener('click', function() {
		var entry = require('ui/common/forms/entry_form');
		var entryWindow = new entry(input);
		entryWindow.open();
		
		entryWindow.addEventListener('close', function() {
			if(entryWindow.result != null)
			{
				input = entryWindow.result;
				dateTime.text = input.date?input.date:'';
				main_entry.text = input.main_entry;	
			}
		});
	});
	
	status.addEventListener('click', function() {
		var prescription = require('ui/common/forms/prescription_form');
		var actions = {
			entry_id: input.id,
			activities: input.activities,
			treatments: input.treatments,
		}
		prescription = new prescription(actions);
		prescription.open(); 
	
		prescription.addEventListener('close', function() {
			if(prescription.result != null) { 
				input.activities = prescription.result.activities;
				input.treatments = prescription.result.treatments;
				status.text = input.activities.length+' activities and '+input.treatments.length+' treatments';
			}
		});
	});
	
	return view;	
}

module.exports = entryView;
