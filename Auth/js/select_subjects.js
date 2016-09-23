$(function() {
    "use strict";
    
    //Init client
	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	//Get tables
	var SubjectTable = client.getTable('subject');
	var SchoolTable = client.getTable('section');
	var StudentTable = client.getTable('student');
    
	//Check if Null or WhiteSpace
    function isNullOrWhiteSpace(str) {
        return str === null || str.match(/^ *$/) !== null;
    }
	
    //Check if user is logged in
    function toggleLogin() {
        if(sessionStorage.getItem("UserId")) {
            var uId = sessionStorage.getItem("UserId");
            
            //Check if names exist
            if((sessionStorage.getItem("First_Name")) != null && (sessionStorage.getItem("Last_Name") != null)) {
                addItem();
            } else {
                
            }
            
        } else {
            alert('Not logged in.');
            window.location = '..';
        }
    }
    
    function addItem() {
		var z = $('#subject').val();
		var code = (z.split('-'))[1];
		//Query subject table with subject code
		var query = SubjectTable.where({ subject_id: code });
		
		query.read().then(function(e) {
			var txt = parseInt($('#items').html());
			$('#items').html( txt + 1 );
            //Check if subject code is valid
			if(e.length == 1) {
				var sec = document.getElementById('container_div');
				var item = document.createElement('div');
                //Adding elements to list
				item.setAttribute('class', 'row');
                item.innerHTML += '<div class="notification-row" id="subject_item_' 
									+ txt +
									'"><i class="pull-left fa fa-ex-triangle"></i>&nbsp;&nbsp;&nbsp;&nbsp;<small class = "pull-left school-object" style="margin-left:20px">' 
									+ e[0].name + 
									'</small> &nbsp;&nbsp;&nbsp;&nbsp; <small class = "pull-left school-object" id="subject_item_' + txt + 'smallt" style="display:block; color:rgba(0,0,0,0)">' 
									+ e[0].subject_id + 
									'</small>' + '</div>';
					
				sec.appendChild(item);
			} else {
				alert('Subject code not found. Check code and try again.')
			}
		}, null);
	}
						  
	$('#nextBtn').click(function(e) {
        //Gets item count
		var items = parseInt($('#items').html());
        
		var subjectCodes = '';
        
		//Get data
        var firstName = sessionStorage.getItem("First_Name");
        var lastName = sessionStorage.getItem("Last_Name");
        var schoolId = sessionStorage.getItem("School_Id");
        var secId = sessionStorage.getItem("Section_Id");
        var uId = sessionStorage.getItem("UserId");
        
		
        //Adds subject codes to list
		if(items == 0)
			alert("No subjects selected. You will not be able to receive any information unless you select subjects. You can change this in the settings panel.");
		var names = name.split('_');
		for(var i = 0; i < items; i++) {
			if(i != items - 1)
				subjectCodes += $('#subject_item_' + i + 'smallt').html() + ',';
			else
				subjectCodes += $('#subject_item_' + i + 'smallt').html();
		}
        
        sessionStorage.setItem("Subjects", subjectCodes);
        
		var q = StudentTable.where({ student_id: uId });
        
        //Update student information
		q.read().then(function(item) {
			StudentTable.update({ id: item[0].id, subject_codes: subjectCodes }).then(function(){
				window.location = "../../pages/dashboard";
			}, ErrorHandle);	
		}, ErrorHandle);
        
	});

	function populateSelect() {
		
		var q = SubjectTable.where({ });
		var str = "";
		q.read().then(function(items) {
			for(var i = 0; i < items.length; i++)
			{
				str = (items[i].name + "-" + items[i].subject_id);
				$('#subject').append(($('<option>', {
					value: str,
    				text: str
				})));
			}
		});
		
	}
	
	$('#search_button').click(function(evt) {
		toggleLogin();
	});
    
    function ErrorHandle(e) {
        alert(e);
    }
    
	populateSelect();
	
});