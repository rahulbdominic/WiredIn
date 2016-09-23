$(function() {
    "use strict";
    
	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
    //Get tables from database
	var SectionTable = client.getTable('section');
	var StudentTable = client.getTable('student');
    
    //Define variables
    var firstName, lastName, schoolId;
    var uId;
    
    //Check if Null or WhiteSpace
    function isNullOrWhiteSpace(str) {
        return str === null || str.match(/^ *$/) !== null;
    }
    
    function populateData(schoolId) {
        //Get all classes
		schoolId = (document.URL.split('?'))[1];
        var schoolQuery = SectionTable.where({ school_p_id: schoolId });
        schoolQuery.orderBy("class_name").read().then(function(results) {
            //List all classes
            var sec = document.getElementById('container_div');
			for(var i = 0; i < results.length; i++) {
				var item = document.createElement('div');
				item.setAttribute('class', 'row');
				item.innerHTML += '<div class="notification-row" id="classOption_' 
									+ i + 
									'"><i class="pull-left fa fa-ex-triangle"></i>&nbsp;&nbsp;&nbsp;&nbsp;<small class = "pull-left school-object" style="margin-left:20px">' 
									+ results[i].class_name + " " + results[i].section_name + 
									'</small><small id="classOption_' + i + 'smallt" class = "pull-left school-object" style="display:block; color:rgba(0,0,0,0)">' 
									+ results[i].id + 
									'</small>';
				
				item.innerHTML += '</div>';
				item.innerHTML += '</div>';
				
				sec.appendChild(item);
				//Set click event handler
				
				$('#classOption_' + i).on("click", optionClicked);
				
			}
        }, ErrorHandle);
    }
    
    function optionClicked(evt) {
		var senderId = $(evt.target).attr('id');
		//Get Section Id
        var secId = document.getElementById(senderId + 'smallt').innerHTML;
        
        sessionStorage.setItem("Section_Id", secId);    
        
		
        firstName = sessionStorage.getItem("First_Name");
        lastName = sessionStorage.getItem("Last_Name");
        schoolId = sessionStorage.getItem("School_Id");
        uId = sessionStorage.getItem("UserId");
		
		var q = StudentTable.where({ student_id: uId });
        
        //Update student information
		q.read().then(function(item) {
        	StudentTable.update({ id: item[0].id, first_name: firstName, 
							  last_name: lastName,
							  school_s_id: schoolId, 
							  section_s_id: secId,
							  student_id: uId, isactive: "active"  }).then(
        	function(e) {
				window.location = "../select_subjects";
            	alert("Done");
       		}, ErrorHandle);
		});
	}
					  
	    
                                                            
    //Check if user is logged in
    function toggleLogin() {
        if(sessionStorage.getItem("UserId")) {
            uId = sessionStorage.getItem("UserId");
            
            //Check if names exist
            if((sessionStorage.getItem("First_Name")) != null && (sessionStorage.getItem("Last_Name") != null)) {
                
                //Load schools into list
                populateData(schoolId);
            } else {
                
            }
            
        } else {
            alert('Not logged in.');
            window.location = '..';
        }
    }
    
    function ErrorHandle(e) {
        alert(e);
    }
    
    toggleLogin();
});