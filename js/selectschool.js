$(function() {
    "use strict";
    
	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
    //Get tables from database
	var SchoolTable = client.getTable('schools');
    var IdentitiesTable = client.getTable('identities');
    
    //Define variables
    var firstName, lastName;
    var uId;
    
    //Check if Null or WhiteSpace
    function isNullOrWhiteSpace(str){
        return str === null || str.match(/^ *$/) !== null;
    }
    
    function populateData() {
        //Get all schools
        var schoolQuery = SchoolTable.where({ });
        schoolQuery.orderBy("school_long_name").read().then(function(results) {
            
            var sec = document.getElementById('container_div');
			var item = document.createElement('div');
			for(var i = 0; i < results.length; i++) {
				//List all schools
				item.setAttribute('class', 'row');
				item.innerHTML += '<div class="notification-row" id="schoolOption_' 
									+ i + 
									'" >&nbsp;&nbsp;&nbsp;&nbsp;<small class = "pull-left school-object" style="margin-left:20px">' 
									+ results[i].school_long_name + 
									'</small><small id="schoolOption_' + i + 'smallt" class = "pull-left school-object" style="display:none">' 
									+ results[i].id + 
									'</small>';
				
				item.innerHTML += '</div>';
				item.innerHTML += '</div>';
				
				sec.appendChild(item);
				
				//Set click event handler 
				
				document.getElementById('schoolOption_' + i)
						.addEventListener('click', optionClicked, false); 
            }
        }, ErrorHandle);
    }
    
    function optionClicked(evt) {
		var senderId = $(evt.target).attr('id');
        //Set school data into session
		uId = sessionStorage.getItem("UserId")
        sessionStorage.setItem("School_Id", $("#" + senderId + 'smallt').html());
        window.location = "../selectclass?" + document.getElementById(senderId + 'smallt').innerHTML;
        alert("Done");   
	}                                                    
                                                            
    //Check if user is logged in
    function toggleLogin() {
        if(sessionStorage.getItem("UserId")) {
            uId = sessionStorage.getItem("UserId");
            
            //Check if names exist
            if((sessionStorage.getItem("First_Name")) != null && (sessionStorage.getItem("Last_Name") != null)) {
                firstName = sessionStorage.getItem("First_Name");
                lastName = sessionStorage.getItem("Last_Name");
                
                //Load schools into list
                populateData();
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
	
    function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = '../../';
	}
	
	$('#logout').click(function(e){
		logout();
	});
	
});