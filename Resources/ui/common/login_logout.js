

function loadDatabase()
{
	//Ti.include('ui/common/database/database.js');
	
	//var parent_id = insertUserLocal(null, 'Adarsh', 'Hasija');
	var users = getAllUsersLocal();
	var user = users[0];
	Titanium.App.Properties.setString('user', user.id);
	
	getChildrenACS({ user_id: user.cloud_id });
	
	var loadFromCloud = function() {
		var children = getAllChildrenLocal();
		if(children.length == 0) {
			var row_id = insertChildLocal(user.id, 'New', 'Patient',null,null,null);
			Titanium.App.Properties.setString('child', row_id);
			createObjectACS('children', { id: row_id, user_id: user.id, first_name: 'New', last_name: 'Child', });
		}
		else {
			Titanium.App.Properties.setString('child', children[0].id);
		}
		Ti.App.fireEvent('databaseLoaded');  
	}
	
	Ti.App.addEventListener('loadFromCloudComplete', loadFromCloud);  
}


function logout()
{	
	Ti.include('/ui/common/cloud/appcelerator/users_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/objects.js');
	Ti.include('/ui/common/cloud/appcelerator/children_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/records_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/entries_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/appointments_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/activities_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/treatments_acs.js');
		
	updateChildrenACS();
	updateRecordsACS();
	updateEntriesACS();
	updateAppointmentsACS();
	updateActivitiesACS();
	updateTreatmentsACS();  

	if(Ti.Facebook.loggedIn) {
		Ti.Facebook.logout();
	}
	logoutUserACS();
	
	Ti.App.fireEvent('logoutClicked');
	
}
