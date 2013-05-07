


function appointmentView(input) {

Ti.include('/ui/common/helpers/dateTime.js');
			
	
	var view = Ti.UI.createView({
		backgroundColor: '#0EA5E9',
		borderColor: 'black',
		borderWidth: 1,
		height: 150,
		width: '100%'
	});
	
	
	var doctor = Ti.UI.createLabel({ 
		text: input.doctor.name?'Dr. '+input.doctor.name:'Doctor Unknown', 
		color: 'black',
		left: 5,
		font: { fontSize: 15 },
		color: 'black',
		width: '100%',
		height: 45,
		top: 0
	});
	
	var top_line = Ti.UI.createView({ width: 200, height: 2, top: 45, left: 0, borderColor: 'black', borderWidth: 1, });
	
	var date = Ti.UI.createLabel({
		text: input.date,
		color: 'black',
		font: { fontSize: 30, fontWeight: 'bold' },
		top: 60,
	});
	
	var bottom_line = Ti.UI.createView({ width: 200, height: 2, bottom: 40, right: 0, borderColor: 'black', borderWidth: 1, });
	
	var status = Ti.UI.createLabel({
		text: input.complete?input.activities.length+' activities and '+input.treatments.length+' treatments':
								(isValidDateTime(new Date(input.date+' '+input.time)))?'Scheduled':'Missed',
		color: 'black',
		right: 5,
		bottom: 0,
		height: 40,
		bubbleParent: input.complete?0:1,
		font: { fontSize: 15, },
	});
	var status_bubbleParent = input.complete?false:true;
	status.setBubbleParent(status_bubbleParent);
 	
	view.add(doctor);
	view.add(top_line);
	view.add(date);
	view.add(bottom_line);
	view.add(status);
	
	
	view.addEventListener('click', function() {
		var appointmentWindow = require('ui/common/forms/appointment_form');
		appointmentWindow = new appointmentWindow(input);
		appointmentWindow.open();
		
		appointmentWindow.addEventListener('close', function() {		
			if(appointmentWindow.result != null)
			{
				input = appointmentWindow.result;
				doctor.text = input.doctor.name?'Dr. '+input.doctor.name:'Doctor Unknown';
				date.text = input.date;
				status.text = input.complete?input.activities.length+' activities and '+input.treatments.length+' treatments':
												(isValidDateTime(new Date(input.date+' '+input.time)))?'Scheduled':'Missed';
			}
			
		});
	});
	
	status.addEventListener('click', function() {
		if(status.text == 'Scheduled' || status.text == 'Missed') return;
		
		var prescription = require('ui/common/forms/prescription_form');
		var actions = {
			appointment_id: input.id,
			entry_id: input.entry_id,
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
				status_bubbleParent = input.complete?false:true;
				status.setBubbleParent(status_bubbleParent);
			}
		});
	});

	
	return view;
	
}

module.exports = appointmentView;
