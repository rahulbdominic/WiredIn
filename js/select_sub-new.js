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
            //Check if subject code is valid
			if(e.length == 1) {
				addToGrid(e[0].subject_id, e[0].name, parseInt($('#items').html()));
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
				window.location = "../../pages/settings";
			}, ErrorHandle);	
		}, ErrorHandle);
        
	});

	function delClicked(evt) {
		var element = "#" + (($(evt.target).attr('id')).replace('del', '')).replace('_', '') + '_tile';
		$(element).remove();
		$('#items').html((parseInt($('#items').html()) - 1).toString());
	}
	
	function addToGrid(subjectCode, subject, i) {
  		var sec = document.getElementById('container_div');
  		var tile = document.createElement('div');
		tile.setAttribute('id', i + '_tile')
  		tile.setAttribute('class',"col-xs-3 card hovercard");
  		tile.setAttribute('style',"margin-right:10px; background-color:rgba(250,250,250,1); height:200px; border-top: 2px solid rgba(0,50,200,1)");
		tile.innerHTML += '<div class="row">';
		tile.innerHTML += '<div class = "info">';
		tile.innerHTML += '<div class="title" style="padding:10px">';
		tile.innerHTML += '<p style="padding-top:0px; font-size:20px;">' + subject + '</p>';
		tile.innerHTML += '<p id="subject_item_' + i + 'smallt" style="padding-top:10px; font-size:16px;">' + subjectCode + '</p>' + '<p style="display:none"></p>';
		tile.innerHTML += '<button id="del_' + i + '" class="btn btn-danger" style="margin-top:10px"><i id="a_' + i + '" class="fa fa-minus pull-left" style="font-size:12px; padding-top:5px"></i><span id="b_' + i + '" class="pull-left" style="padding-left:5px">Remove period</span></button></div>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		sec.appendChild(tile);
		
		$('#items').html(parseInt(i) + 1);
		
		document.getElementById('del_' + i)
						.addEventListener('click', delClicked, false);
	}
	
	function populateSelect() {
		
		var q = SubjectTable.where({ });
		var str = "";
		var z = 0;
		q.read().then(function(items) {
			for(var i = 0; i < items.length; i++)
			{
				z = $('#items').html();
				str = (items[i].name + "-" + items[i].subject_id);
				var uId = sessionStorage.getItem("UserId");
				var query = StudentTable.where({ student_id: uId });
				var codes = sessionStorage.getItem("Subjects");
				if(codes.search(items[i].subject_id) > -1) {
					addToGrid(items[i].subject_id, items[i].name, z);
					z++;
				}
				
				$('#subject').append(($('<option>', {
					value: str,
    				text: str
				})));
			}
		});
		
	}
	
	function populateGrid() {
		
	}
	
	$('#search_button').click(function(evt) {
		toggleLogin();
	});
    
    function ErrorHandle(e) {
        alert(e);
    }
    
	populateSelect();

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