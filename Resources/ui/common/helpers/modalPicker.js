

function modalPicker(type,data,selected) 
{ 
	Ti.include('/ui/common/helpers/dateTime.js');

//set the selected indexes if the picker type is not date/time
if(type == null) { 
	for(var i=0;i<data.length;i++) {
		if(data[i] == selected) { var index=i; }
	}
}

/*
done_btn.addEventListener('click', function() {
	if(type == null) { self.result = picker.getSelectedRow(0).title; }
	else if(type == 'picker_columns') { self.result = picker.getSelectedRow(0).title + ' '+picker.getSelectedRow(1).title; }
	else if(type == Ti.UI.PICKER_TYPE_DATE_AND_TIME) { self.result = picker.getValue(); }
	else if(type == Ti.UI.PICKER_TYPE_DATE) { self.result = picker.getValue(); }
	self.animate(Ti.UI.createAnimation({
		top: Titanium.Platform.displayCaps.platformHeight*0.9,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN,
		duration: 500
		}));
	self.close();
});
win.rightNavButton = done_btn;
win.hideTabBar();
*/


if(type == null) 
{ 
	var picker = Ti.UI.createPicker();
	for(var i=0;i<data.length;i++) {
	picker.add(Ti.UI.createPickerRow({ title: data[i] }));
	  if(data[i] == selected) {
	  	picker.setSelectedRow(0,i,false);
	  }
	}
}
else if(type == 'picker_columns')
{
	var picker_columns = [];
	
	for(var i=0;i<data.length;i++)
	{
		picker_columns[i] = Ti.UI.createPickerColumn();
		
		for(var j=0;j<data[i].length;j++)  //location 0 is the column title
		{
			if(typeof(data[i][j]) == 'number') { data[i][j] = data[i][j].toString(); }
			picker_columns[i].addRow(Ti.UI.createPickerRow({ title: data[i][j] }));
		}
	} 
	
	var picker = Ti.UI.createPicker({
     columns: picker_columns,
     selectionIndicator: true,
     useSpinner: true, // required in order to use multi-column pickers with Android
	});
	for(var i=0;i < data.length;i++) { picker.setSelectedRow(i, 0, false); }
}
else 
{
	var d = roundMinutes(new Date());
		
		//Its a DOB picker or incident date picker......has to be in the present/past
		if(data == 'DOB') {
			var min_date = new Date(d.getFullYear()-18,01,01);
			var max_date = new Date(d.getFullYear(),d.getMonth(),d.getDate());
			var value = new Date(selected); 
		}
		else if(data == 'incident') {
			var min_date = new Date(d.getFullYear()-18,01,01,d.getHours(),d.getMinutes(),null,null);
			var max_date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);
			var value = new Date(selected);
		}
		//Its a regular date/time picker
		else {
			var min_date = new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),null,null);;
			var max_date = new Date(d.getFullYear()+2,12,31,d.getHours(),d.getMinutes(),null,null);
  			var value = roundMinutes(new Date(selected));										
		}
  		
  		var picker = Titanium.UI.createPicker({ type: type, 
  													  minDate: min_date,
  													  maxDate: max_date, 
  													  value: value,
  													  minuteInterval: 5 });											 
  													  
  		picker.addEventListener('change',function(e) {
    		picker.setValue(e.value);
		});
}

picker.selectionIndicator = true;

return picker;

}

module.exports = modalPicker;