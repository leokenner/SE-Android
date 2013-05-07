


function help_questions()
{
	Ti.include('ui/common/database/database.js');
	Ti.include('ui/common/login_logout.js');
	
	var window = Titanium.UI.createWindow({
  		title: 'Help Questions',
  		backgroundColor: 'white',
  		navBarHidden: true,
  		height: 'auto',
  		top: 0,
  		left: 0,
  		zIndex: 1
	});

	var windowTitleBar = require('ui/handheld/windowNavBar');
	windowTitleBar = new windowTitleBar('100%', 'Help Questions', null, 'Done');
	window.add(windowTitleBar);
	
	var close_btn = windowTitleBar.rightNavButton;
	
	close_btn.addEventListener('click', function() {
		window.close();
	});
	
	helpSection_table = Ti.UI.createTableView({
		backgroundColor: 'white',
		borderColor: 'black',
		top: 70,
	});
	
	
	helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true, height: 50, }));
	helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true, height: 50, }));
	helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true, height: 50, }));
	helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true, height: 50, }));
	helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true, height: 50, }));
	helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true, height: 50, }));
	//helpSection_table.appendRow(Ti.UI.createTableViewRow({ hasChild: true,, height: 50, }));
	
	var question0 = Ti.UI.createLabel({ text: "How do I view a patient's profile", color: 'black', left: 5, top: 10, width: '90%', });
	var question1 = Ti.UI.createLabel({ text: "How do I add a new entry", left: 5, color: 'black', top: 10, width: '90%', });
	var question2 = Ti.UI.createLabel({ text: "How do I view a different patient's records", color: 'black', left: 5, top: 10, width: '90%', });
	var question3 = Ti.UI.createLabel({ text: "How do I work with appointments", color: 'black', left: 5, top: 10, width: '90%', });
	var question4 = Ti.UI.createLabel({ text: "How do I add/view activities/treatments", color: 'black', left: 5, top: 10, width: '90%', });
	var question5 = Ti.UI.createLabel({ text: "How do I share on Facebook", color: 'black', left: 5, top: 10, width: '90%', });
	var question6 = Ti.UI.createLabel({ text: "Contact Us", color: 'black', left: 5, top: 10, width: '90%', });
	
	helpSection_table.data[0].rows[0].add(question0);
	helpSection_table.data[0].rows[1].add(question1);
	helpSection_table.data[0].rows[2].add(question2);
	helpSection_table.data[0].rows[3].add(question3);
	helpSection_table.data[0].rows[4].add(question4);
	helpSection_table.data[0].rows[5].add(question5);
	//helpSection_table.data[0].rows[6].add(question6);

	window.add(helpSection_table);
	
	helpSection_table.addEventListener('click', function(e) {
		var answerWindow = Titanium.UI.createWindow({
				backgroundColor: 'white',
				navBarHidden: true,
				layout: 'vertical',
			});
			
		var main_view = Ti.UI.createView({ top: 90, layout: 'vertical', backgroundColor: 'transparent', });
			
		switch(e.index) {
			case 0:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
	
				var image = Ti.UI.createImageView({
					image: "/help_questions/records_page.png", //"help_questions/personalCard.png",
					//top: 70+20,
					width: '50%',
				});
				var text = Ti.UI.createLabel({
					text: "On the main(records) page, simply tap a patient's name at the bottom of the screen "+
							"and the page will scroll down to the patient's Personal Card. This is a quick view of "+
							"the patient's basic information. Click the Edit button to view and edit additional details about the patient.",
					textAlign: 'center',
					width: '95%',
					top: 20,
					color: 'black',
				});
				break;
				
			case 1:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
				answerWindow.add(windowTitleBar);
	
				var image = Ti.UI.createImageView({
					image: "/help_questions/SE_newEntry.png",
					//top: 70+20,
					width: '60%',
					//height: '20%',
				});
				var text = Ti.UI.createLabel({
					text: "Simply click the New Entry button at the top of the Records page for the patient. After that you can "+
							"fill out the form and save it and a new entry will be created. ",
					textAlign: 'center',
					color: 'black',
					width: '95%',
					top: 20,
				});
				break;
				
			case 2:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
				answerWindow.add(windowTitleBar);
				
				var image = Ti.UI.createImageView({
					image: "/help_questions/sidemenu.png", //"help_questions/SE_logout.png",
					top: 70+20,
					width: '50%',
					//height: '50%',
				});
				var text = Ti.UI.createLabel({
					text: "Simply click the Menu button on the top left of the main screen and you will see the menu. "+
							"This is where you can do many actions such as creating a new patient or switching to a different "+
							"patient. You can also Logout using this menu by tapping Logout",
					textAlign: 'center',
					color: 'black',
					width: '95%',
					top: 350,
				});
				break;
				
			case 3:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
				answerWindow.add(windowTitleBar);
			
				var image = Ti.UI.createImageView({
					image: "/help_questions/SE_appointment_view.png",
					top: 70+20,
				});
				
				var text = Ti.UI.createLabel({
					text: "Under every entry snippet is a New Appointment button that allows you to record an appointment; "+
							"after which you will see the appointment snippet like the one above. The status on "+
							"the bottom right will show the number of activities/treatments you have recorded; when you have declared "+
							"the appointment complete.",
					textAlign: 'center',
					color: 'black',
					width: '95%',
					top: 350,
				});
				break;
				
			case 4:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
				answerWindow.add(windowTitleBar);
			
				var image = Ti.UI.createImageView({
					image: "/help_questions/SE_actions_list.png",
					top: 70+20,
					width: '50%',
				});
				
				var text = Ti.UI.createLabel({
					text: "Tap the status on the bottom right of the entry or appointment snippet(post completion) to get the Actions "+
							"window as seen above. Here you can list activities and treatments. "+
							"Actions are color coded: yellow/in progress, red/incomplete and white/complete. "+	
							" For actions that you have administered without consulting a professional, list them under "+
							"the entry, else list them under the corresponding appointment. ",
					textAlign: 'center',
					color: 'black',
					width: '95%',
					top: 350,
				});
				break;
				
			case 5:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
				answerWindow.add(windowTitleBar);
			
				var image = Ti.UI.createImageView({
					image: "/help_questions/SE_sharing.png",
					top: 70+20,
					width: '50%',
				});
				
				var text = Ti.UI.createLabel({
					text: "Once you declare an activity/treatment successful, the share button will turn blue as shown above. "+
							"Tap it and share the successful activity/treatment with loved ones on facebook.",
					textAlign: 'center',
					color: 'black',
					width: '95%',
					top: 350,
				});
				break;
				
			case 6:
				var windowTitleBar = require('ui/handheld/windowNavBar');
				windowTitleBar = new windowTitleBar('100%', '', 'Back', null);
				answerWindow.add(windowTitleBar);
			
				var image = Ti.UI.createImageView();
				
				var text = Ti.UI.createLabel({
					text: "You can find StarsEarth at\n www.starsearth.com\n\n You can also find StarsEarth on facebook at\n "+
							"www.facebook.com/starsearth\n\n Please like the page in order to be up to date with StarsEarth news.",
					textAlign: 'center',
					color: 'black',
					width: '95%',
					top: 350,
				});
				
			/*	var like_btn = Ti.UI.createButtonBar({
					top: 20,
					width: '50%',
					style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
					height: 50,
				});
				
				like_btn.addEventListener('click', function() {
					Ti.Facebook.requestWithGraphPath("me/og:likes?object=https://www.facebook.com/msdofficial&access_token="+
												Ti.Facebook.getAccessToken()+'"', {}, 'POST', function(e) {
													if(e.success) alert('it works');
													else if(e.error) alert(e.error);
												});
				});
				
				Ti.Facebook.requestWithGraphPath('me/likes/118306468218564', {}, 'GET', function(e) {
					if(e.success) {
						var result = JSON.parse(e.result); 
						if(result.data.length > 0) {
							like_btn.labels = ['Liked, Thank you!'];
							like_btn.color = 'black';
							like_btn.backgroundColor = 'white';
						}
						else if(result.data.length == 0) {
							like_btn.labels = ['Like'];
							like_btn.color = 'white';
							like_btn.backgroundColor = 'blue';
						}
					} else if(e.error) alert(e.error);
				});
				break; */
				
			default: break;
		}
		
		var close_btn = windowTitleBar.leftNavButton;
		
		close_btn.addEventListener('click', function() {
			answerWindow.close();
		});
		
		
		answerWindow.add(windowTitleBar);
		main_view.add(image);
		main_view.add(text);
		answerWindow.add(main_view);
		//answerWindow.add(image);
		//answerWindow.add(text);
		answerWindow.open();
	});
	
	return window;
}

module.exports = help_questions;