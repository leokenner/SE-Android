

function completeRecordsTableView()
{
	Ti.include('/ui/common/database/users_db.js');
	Ti.include('/ui/common/database/children_db.js');
	Ti.include('/ui/common/database/relationships_db.js');
	Ti.include('/ui/common/database/records_db.js');
	Ti.include('/ui/common/database/entries_db.js');
	Ti.include('/ui/common/database/activities_db.js');
	Ti.include('/ui/common/database/appointments_db.js');
	Ti.include('/ui/common/database/treatments_db.js');
	
	function loadTable()
	{
		//var records_length = table.data[0]?table.data[0].rowCount:0;     //sectionRecords.rowCount;
		//for(var i=records_length-1 ; i > -1; i--) table.deleteRow(i);
		if(table.data[0]) table.deleteSection(0);
		
		var records = getRecordsForChildLocal(child.id);

		for(var i=0;i<records.length;i++) {
			if(records[i].current_type == 'entry') {
				var entry = getEntryLocal(records[i].current);
				entry = entry[0];
				var record = require('ui/common/views/recordView');
				var view = new record({ entry: entry });
			}
				var row = Ti.UI.createTableViewRow();
				row.add(view);
				
				row.setHeight(view.height+40);
				table.appendRow(row);
		}

	}

	var child = getChildLocal(Titanium.App.Properties.getString('child'));
	child = child[0];
	
	var self = Ti.UI.createView();
	
	var newEntry_btn = Ti.UI.createLabel({
		text: 'New Entry',
		textAlign: 'center',
		font: { fontSize: 20, fontWeight: 'bold' },
		borderColor: 'black',
		borderWidth: 1,
		color: 'black',
		height: 45,
		backgroundColor: 'white',
		top: 0,
		width: '100%',
		left: 0,
		zIndex: 2
	});
	self.add(newEntry_btn);
	
	var table = Ti.UI.createTableView({
		backgroundColor: '#CCC',
		width: '90%',
		separatorColor: 'transparent',
		zIndex: 1,
		top: 45
	});
	
	table.addEventListener('eventAdded', function(e) {
		var section = table.data[0];
		var row = section.getRows()[e.index];
		var view = row.getChildren()[0];
		row.setHeight(view.height+40);
	});
	
	
	var personalCard = require('ui/common/user/personalCard');
	var personalCardView = new personalCard();
	table.setFooterView(personalCardView);
	self.add(table); 
	
	var childName_btn = Ti.UI.createLabel({
		text: child.first_name+' '+child.last_name,
		textAlign: 'center',
		font: { fontSize: 20, fontWeight: 'bold' },
		borderColor: 'black',
		borderWidth: 1,
		color: 'black',
		backgroundColor: 'white',
		height: 45,
		bottom: 0,
		width: '100%',
		zIndex: 2,
	});
	self.add(childName_btn);
	
	childName_btn.addEventListener('click', function() {
		var sum=0;
		var section = table.data[0];
		for(var i=0; i < section.rowCount; i++) {
			sum += section.rows[i].height;
		}
		table.scrollToTop(sum);
	});
	
	//This changes the child name label if the child name is changed using the form
	Ti.App.addEventListener('profileChanged', function() {
		child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		childName_btn.text = child.first_name + ' '+ child.last_name;
	});
	
	
	newEntry_btn.addEventListener('click', function() {
		var entry = require('ui/common/forms/entry_form');
		entry = new entry({ id: null });
		entry.open();
		
		entry.addEventListener('close', function() {
			if(entry.result != null) {
				var record = require('ui/common/views/recordView');
				var view = new record({ entry: entry.result });
			
				var row = Ti.UI.createTableViewRow();
				row.add(view);
				
				row.setHeight(view.height+40);
				
				//If another appointment is added, increase the height of the row
				Ti.App.addEventListener('eventAdded', function() {  
					row.setHeight(view.height+40);
				});
				
				var section = table.data[0]?table.data[0]:Titanium.UI.createTableViewSection();
				var temp_rows = table.data[0]?table.data[0].getRows():[];
				temp_rows.unshift(row);
				section.rows = temp_rows;
				table.deleteSection(0);
				table.appendSection(section);
				//table.data = [sectionRecords, sectionPersonal];
				table.scrollToIndex(0);
				
				loadTable();
			}
		}); 
	});
	
	loadTable();
	
	//This is triggered if the user is changed from the side menu
	Ti.App.addEventListener('changeUser', function() {
		child = getChildLocal(Titanium.App.Properties.getString('child'));
		child = child[0];
		childName_btn.text = child.first_name + ' '+ child.last_name;
		loadTable();
	});
	
	
	
	return self;
}

module.exports = completeRecordsTableView;