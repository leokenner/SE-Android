
/*
 * creates a new navgroup starting with the new window
 * input: new window
 * output: nav group
 */
function windowNavBar(width, title, leftButtonTitle, rightButtonTitle)
{	
	var view = Ti.UI.createView({
		zIndex: 2,
		top: 0,
		left: 0,
		width: width,
		height: 70,
		backgroundColor: 'black',
		borderColor: 'white',
		borderWidth: 1,
	});
	
	
	var title = Ti.UI.createLabel({
		text: title,
		color: 'white',
		font: { fontSize: 30, },
	});
	view.add(title);
	
	if(leftButtonTitle != null) { 
		var leftNavButton = Ti.UI.createView({
			top: 0,
			left: 0,
			width: 70,
			height: 70,
			backgroundColor: 'black',
			borderColor: 'white',
			borderWidth: 1,
		});
		
		var leftButtonText = Ti.UI.createLabel({
			text: leftButtonTitle,
			font: { fontSize: 15, },
			color: 'white',
		});
		leftNavButton.add(leftButtonText);
		view.add(leftNavButton);
		
		view.leftNavButton = leftNavButton;
	}
	
	if(rightButtonTitle != null) { 
		var rightNavButton = Ti.UI.createView({
			top: 0,
			right: 0,
			width: 70,
			height: 70,
			backgroundColor: 'black',
			borderColor: 'white',
			borderWidth: 1,
		});
		
		var rightButtonText = Ti.UI.createLabel({
			text: rightButtonTitle,
			font: { fontSize: 15, },
			color: 'white',
		});
		rightNavButton.add(rightButtonText);
		view.add(rightNavButton);
		
		view.rightNavButton = rightNavButton;
	}
	
	//var mainView = Ti.UI.createView({ top: 70, });
	//var recordsView = require('ui/common/views/completeRecordsTableView');
	//recordsView = new recordsView();
	//mainView.add(recordsView);
	
	
	return view;
}

module.exports = windowNavBar;


