


function personalCard() {
	Ti.include('/ui/common/database/users_db.js');
	Ti.include('/ui/common/database/children_db.js');
	Ti.include('/ui/common/database/relationships_db.js');
	Ti.include('/ui/common/helpers/dateTime.js');
	
	var child=null;
	
	function normalView()
	{
		child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		
		var user = getUserLocal(child.user_id);
		user = user[0];
		
		var relation = getRelationshipLocal(user.id, child.id);
		var relationship = {
			id: user.id,
			name: user.first_name+' '+user.last_name,
			relation: relation?relation:'Relation Unknow: Tap to change',
		}
		child.relationship = relationship; 

		
		name.text = child.first_name+' '+child.last_name;
		sex.text = child.sex?child.sex:'Unknown';
		calculated_age = child.date_of_birth?calculateAge(new Date(child.date_of_birth),new Date()):'Unknown';
		age.text = calculated_age;
		diagnosis.text = child.diagnosis?child.diagnosis:'Unknown';
	}
	
	var main_view = Ti.UI.createView();
	
	var table = Ti.UI.createTableView({
		top: 0,
		backgroundColor: 'white',
		borderColor: 'black',
	});
	main_view.add(table);
	
	var row = Ti.UI.createTableViewRow({ backgroundColor: 'blue', height: 45, });
	var personalCard_txt = Ti.UI.createLabel({ 
		text: 'Personal Card', 
		backgroundColor: 'blue', 
		color: 'white',   
		height: 45,
		font: { fontWeight: 'bold', fontSize: 20, },
		left: 5 
		});
		
	var right_btn = Ti.UI.createView({ 
		backgroundColor: 'blue', 
		borderColor: 'white',
		borderWidth: 1,  
		height: 46,
		width: 60,
		right: 0 ,
		});
		
	var rightBtn_txt = Ti.UI.createLabel({
		text: 'Edit',
		color: 'white',
		font: { fontWeight: 'bold', },
	});
	right_btn.add(rightBtn_txt);
		
	right_btn.addEventListener('click', function() { 
			var profile = require('ui/common/forms/profile_form');
			profile = new profile(child);
			profile.open();
			
			profile.addEventListener('close', function() {
				if(profile.result) {
					child = profile.result;
					
					name.text = profile.result.first_name+' '+profile.result.last_name;
					sex.text = child.sex?child.sex:'Unknown';
					age.text = child.date_of_birth?calculateAge(new Date(child.date_of_birth),new Date()):'Unknown';
					diagnosis.text = child.diagnosis?child.diagnosis:'Unknown';
				}
			}); 
	});	
	
	row.add(personalCard_txt);	
	row.add(right_btn);
	table.appendRow(row);
	table.appendRow(Ti.UI.createTableViewRow({ title: 'Name', height: 45, }));
	table.appendRow(Ti.UI.createTableViewRow({ title: 'Sex', height: 45, }));
	//table.appendRow(Ti.UI.createTableViewRow({ title: 'Age', height: 45, }));
	table.appendRow(Ti.UI.createTableViewRow({ title: 'Diagnosis', height: 45, }));
	
	var name_lbl = Ti.UI.createLabel({
						color: 'black',
						left: 5,
						text: 'Name',
						});
	var name = Ti.UI.createLabel({
						color: 'black', 
						left: '45%', 
						width: '55%' 
						});
	var sex_lbl = Ti.UI.createLabel({
						color: 'black',
						left: 5,
						text: 'Sex',
						});					
	var sex = Ti.UI.createLabel({
						color: 'black', 
						left: '45%', 
						width: '55%' 
						});	
	var age_lbl = Ti.UI.createLabel({
						color: 'black',
						left: 5,
						text: 'Age',
						});									
	var age = Ti.UI.createLabel({
						color: 'black', 
						left: '45%', 
						width: '55%' 
						});
	var diagnosis_lbl = Ti.UI.createLabel({
						color: 'black',
						left: 5,
						text: 'Diagnosis',
						});					
	var diagnosis = Ti.UI.createLabel({
						color: 'black', 
						left: '45%', 
						width: '55%' 
						});
	
	table.sections[0].rows[1].add(name_lbl);
	table.sections[0].rows[1].add(name);
	table.sections[0].rows[2].add(sex_lbl);
	table.sections[0].rows[2].add(sex);
	//table.sections[0].rows[3].add(age_lbl);
	//table.sections[0].rows[3].add(age);
	table.sections[0].rows[3].add(diagnosis_lbl);
	table.sections[0].rows[3].add(diagnosis);
	
	table.setHeight(table.sections[0].rows.length*45);
	
	main_view.setHeight(table.height+70);
	
	normalView();
	
	Ti.App.addEventListener('changeUser', function() {
		normalView();
	});
	
	
	//return table;
	return main_view;
	
}

module.exports = personalCard;
