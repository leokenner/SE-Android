

function mainCover() {
var Cloud = require('ti.cloud');

	Ti.include('/ui/common/cloud/appcelerator/users_acs.js');
	Ti.include('/ui/common/cloud/appcelerator/objects.js');

	//create module instance
	var self = Ti.UI.createWindow({
		backgroundColor: 'white',
		navBarHidden: true,
		orientationModes: [Ti.UI.PORTRAIT],
	});
	
	var style;
	if (Ti.Platform.name === 'iPhone OS'){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else {
	  style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	}
	var activityIndicator = Ti.UI.createActivityIndicator({
	  color: '#CCC',
	  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	  message: 'Loading...',
	  style:style,
	  top: '40%', //'30 dp',
	  left:'30%',
	  height:Ti.UI.SIZE,
	  width:Ti.UI.SIZE,
	  zIndex: 3,
	});
	
	// The activity indicator must be added to a window or view for it to appear
	self.add(activityIndicator);
	
	Ti.App.addEventListener('databaseLoaded', function() {
		activityIndicator.hide();
	});
	
	var name = Ti.UI.createLabel({
		text: 'StarsEarth',
		color: 'black',
		top: 50,
		font: { fontSize: 40, fontFamily: 'DroidSans', },
		textAlign: 1,
	});
	self.add(name);
	
	var about = Ti.UI.createLabel({
		text: 'About',
		textAlign: 1,
		font: { fontSize: 15, },
		color: 'black',
		top: 100,
	});
	self.add(about);
	
	var starsearth_description = function() {
		var modalWindow = Ti.UI.createWindow({
			modal: true,
			title: 'About StarsEarth',
			backgroundColor: 'white',
			navBarHidden: true,
		});
		
		var windowTitleBar = require('ui/handheld/windowNavBar');
		windowTitleBar = new windowTitleBar('100%', 'About StarsEarth', null, 'Done');
		modalWindow.add(windowTitleBar);
		
		var done_btn = windowTitleBar.rightNavButton;
		
		done_btn.addEventListener('click', function() {
			modalWindow.close();
		});
		
		var main_txt = Ti.UI.createLabel({
			top: 90,
			color: 'black',
			textAlign: 'center',
			width: '95%',
			font: { fontSize: '15 dp', },
			text: "StarsEarth is a mobile journal that allows you to track your child's development. "+
					"You can use StarsEarth to record issues that you see in your child's daily life, "+
					"from medical to social to academic. StarsEarth allows you to record any story, as "+
					"well as any event that takes place around that story, such as appointments with specialists, "+
					"or activities or treatments that have been planned to help solve the issue.\n\n"+
					"With StarsEarth, all the important information regarding your child's growth and development is "+
					"just a click away.",
		});
		modalWindow.add(main_txt);
		
		modalWindow.open();
	}
	
	name.addEventListener('click', starsearth_description);
	about.addEventListener('click', starsearth_description);
	
	var background_img = Ti.UI.createImageView({
		image: '/familia.png',
		bottom: 0,
		left: 0,
		width: '100%',
	});
	self.add(background_img);  
	
	
	var fblogin_new = Titanium.UI.createView({
	height: 40,
	width: '70%',
	top: '55%',
	backgroundColor: 'blue',
	borderColor: 'black',
	borderRadius: 5,
	borderWidth: 1,
	});
	
	var fblogin_new_label = Titanium.UI.createLabel({
		text: 'Login with Facebook',
		font: { fontSize: 15, },
		color: 'white',
	});
	
	fblogin_new.add(fblogin_new_label);

	fblogin_new.addEventListener('touchstart', function() {
		if(!Titanium.Network.online) {
			alert('You are not connected to the internet');
			return;
		}
		fblogin_new.backgroundColor = 'black';
		if(Titanium.Facebook.loggedIn) { Ti.Facebook.logout(); }
		Titanium.App.Properties.setObject('loggedInUser', null);
		var url = 'https://login.facebook.com';
		var client = Titanium.Network.createHTTPClient();
		client.clearCookies(url);
		Ti.Facebook.authorize();
	});
	fblogin_new.addEventListener('touchend', function() {
		fblogin_new.backgroundColor = 'blue';
	});
	self.add(fblogin_new);
	
	Ti.App.addEventListener('FBloginsuccessful', function() {
		activityIndicator.show();
	});
	
	var login_btn = Ti.UI.createView({
		height: 30,
		width: '25%',
		top: '70%',
		left: '20%',
		backgroundColor: 'blue',
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 5,
	});
	
	var login_btn_txt = Ti.UI.createLabel({
		text: 'Login',
		color: 'white',
		font: { fontSize: 15, },
	});
	login_btn.add(login_btn_txt);
	self.add(login_btn);
	
	var signup_btn = Ti.UI.createView({
		height: 30,
		width: '25%',
		top: '70%',
		left: '55%',
		backgroundColor: 'blue',
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 5,
	});
	
	var signup_btn_txt = Ti.UI.createLabel({
		text: 'Signup',
		color: 'white',
		font: { fontSize: 15, },
	});
	signup_btn.add(signup_btn_txt);
	self.add(signup_btn);
	
	login_btn.addEventListener('click', function() {
		var window = Ti.UI.createWindow({
			modal: true,
			navBarHidden: true,
			title: 'Login',
			backgroundColor: 'white',
		});
		
		var windowTitleBar = require('ui/handheld/windowNavBar');
		windowTitleBar = new windowTitleBar('100%', 'Login', 'Cancel', null);
		window.add(windowTitleBar);
		
		var cancel_btn = windowTitleBar.leftNavButton;
		
		cancel_btn.addEventListener('click', function() {
			window.close();
		});
		
		var table = Ti.UI.createTableView({
			width: 250,
			top: 90,
			height: 135,
			separatorColor: 'transparent',
			backgroundColor: 'white',
		});
		
		var main_section = Ti.UI.createTableViewSection();
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		
		var login_lbl = Ti.UI.createLabel({
			text: 'Login',
			color: 'white',
		});
		
		var login_email = Ti.UI.createTextField({ hintText: 'Email', color: 'black', width: '100%', left: 0, });
		var login_password = Ti.UI.createTextField({ hintText: 'Password', color: 'black', width: '100%', left: 0, passwordMask: true, });
		
		main_section.rows[0].add(login_email);
		main_section.rows[1].add(login_password);
		
		table.appendSection(main_section);
		
		var button = Ti.UI.createView({
			width: 250,
			backgroundColor: 'blue',
			borderColor: 'black',
			borderRadius: 5,
			height: 50,
			top: 235,
		});
		button.add(login_lbl);
		
		
		button.addEventListener('click', function() {
			if(!Titanium.Network.online) {
				alert('Error: \n You are not connected to the internet');
				return;
			}
			
			if(login_email.value == null || login_email.value == '') {
				alert('You have not entered an email');
				return;
			}
			if(login_password.value == null || login_password.value == '') {
				alert('You have not entered a password');
				return;
			}
			loginUserACS(login_email.value, login_password.value);
			window.close();  
		});
		
		window.add(table);
		window.add(button);
		
		window.open();
		
	});
	
	
	signup_btn.addEventListener('click', function() {
		var window = Ti.UI.createWindow({
			modal: true,
			title: 'Signup',
			navBarHidden: true,
			backgroundColor: 'white',
		});
		
		var windowTitleBar = require('ui/handheld/windowNavBar');
		windowTitleBar = new windowTitleBar('100%', 'Signup', 'Cancel', null);
		window.add(windowTitleBar);
		
		var cancel_btn = windowTitleBar.leftNavButton;
		
		cancel_btn.addEventListener('click', function() {
			window.close();
		});
		
		var table = Ti.UI.createTableView({
			width: 250,
			top: 90,
			height: 270,
			backgroundColor: 'white',
			separatorColor: 'transparent',
		});
		
		var main_section = Ti.UI.createTableViewSection();
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		main_section.add(Ti.UI.createTableViewRow({ height: 45, }));
		
		var signup_login = Ti.UI.createLabel({
			text: 'Signup and Login',
			color: 'white',
		});
		
		var first_name = Ti.UI.createTextField({ hintText: 'First Name', color: 'black', width: '100%', left: 0, });
		var last_name = Ti.UI.createTextField({ hintText: 'Last Name', color: 'black', width: '100%', left: 0, });
		var signup_email = Ti.UI.createTextField({ hintText: 'Email', color: 'black', width: '100%', left: 0, });
		var signup_password = Ti.UI.createTextField({ hintText: 'Password', color: 'black', width: '100%', left: 0, passwordMask: true, });
		var password_confirm = Ti.UI.createTextField({ hintText: 'Confirm password', color: 'black', width: '100%', left: 0, passwordMask: true, });
		
		main_section.rows[0].add(first_name);
		main_section.rows[1].add(last_name);
		main_section.rows[2].add(signup_email);
		main_section.rows[3].add(signup_password);
		main_section.rows[4].add(password_confirm);
		
		table.appendSection(main_section);
		
		var button = Ti.UI.createView({
			width: 250,
			backgroundColor: 'blue',
			borderColor: 'black',
			borderRadius: 5,
			height: 50,
			top: 380,
		});
		button.add(signup_login);
		
		button.addEventListener('click', function() {
			if(!Titanium.Network.online) {
				alert('Error: \n You are not connected to the internet');
				return;
			}
			
			if(first_name.value == null || first_name.value == '') {
				alert('You have not entered a first name');
				return;
			}
			if(last_name.value == null || last_name.value == '') {
				alert('You have not entered a last name');
				return;
			}
			if(signup_email.value == null || signup_email.value == '') {
				alert('You have not entered an email');
				return;
			}
			if(signup_password.value == null || signup_password.value == '') {
				alert('You have not entered a password');
				return;
			}
			if(password_confirm.value == null || password_confirm.value == '') {
				alert('You have not confirmed your password');
				return;
			}
			createAndLoginUserACS(last_name.value, first_name.value, signup_email.value, signup_password.value, password_confirm.value);
			window.close();
		});
		
		window.add(table);
		window.add(button);
		
		window.open();
		
	});
	  
	
	return self;
};

module.exports = mainCover;