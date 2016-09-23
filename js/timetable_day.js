$(function() {
    "use strict";
		
	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	var sessionsTable = client.getTable('loginsessions');
	var timetableTable = client.getTable('timetable');
	
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");
	
	var dayOfTheWeek = 0;
	var isLoggedIn = false;
	
	function _fix() {
		
        //Get window height and the wrapper height
        var height = $(window).height() - $("body >.header").height();
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
		
		
		if (content > height)
            //Set sidebar height to the wrapper
            
		$(".left-side, html, body").css("min-height", content + "px");
        else {
            //Set the sidebar to the height of the window
            
		$(".left-side, html, body").css("min-height", height + "px");
        }
    }
    
	//Enable sidebar toggle
    $("[data-toggle='offcanvas']").click(function(e) {
        e.preventDefault();

        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
			_fix();
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
			_fix();
        }
    });

	_fix();
    
	$(".wrapper").resize(function() {
        _fix();
    });	
	
	function spaces(i, element) {
		for(var a = 0; a < i; a++) {
			element.append("&nbsp;")
		}
	}
		
	
	var url = document.URL;
	var param = url.split('day=')[1];
	var title = $("#header_title");

	switch(param)
	{
		case 'monday':
			title.text("");
			spaces(4, title);
			title.append(" Monday");
			dayOfTheWeek = 1;
			break;
			
		case 'tuesday':
			title.text("");
			spaces(4, title);
			title.append(" Tuesday");
			dayOfTheWeek = 2;
			break;
			
		case 'wednesday':
			title.text("");
			spaces(4, title);
			title.append(" Wednesday");
			dayOfTheWeek = 3;
			break;
		
		case 'thursday':
			title.text("");
			spaces(4, title);
			title.append(" Thursday");
			dayOfTheWeek = 4;
			break;
		
		case 'friday':
			title.text("");
			spaces(4, title);
			title.append(" Friday");
			dayOfTheWeek = 5;
			break;
		
		case 'saturday':
			title.text("");
			spaces(4, title);
			title.append(" Saturday");
			dayOfTheWeek = 6;
			break;
	}
	

	function addElement(subject, subjectCode) {
  		var sec = document.getElementById('container_div');
  		var tile = document.createElement('div');
  		tile.setAttribute('class',"col-xs-3 card hovercard");
  		tile.setAttribute('style',"margin-right:10px; background-color:rgba(250,250,250,1); height:150px; border-top: 2px solid rgba(0,50,200,1)");
		tile.innerHTML += '<div class="row">';
		tile.innerHTML += '<div class = "info">';
		tile.innerHTML += '<div class="title" style="padding:10px">';
		tile.innerHTML += '<p style="padding-top:0px; font-size:20px;">' + subject + '</p>';
		tile.innerHTML += '<p style="padding-top:10px; font-size:16px;">' + subjectCode +'</p>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		sec.appendChild(tile);
	}
	
	function populateTimeTable() {
		
		switch($("#header_title").text()) {
			case ' Monday':
				dayOfTheWeek = 1;
				
			case ' Tuesday':
				dayOfTheWeek = 2;
				
			case ' Wednesday':
				dayOfTheWeek = 3;
				
			case ' Thursday':
				dayOfTheWeek = 4;
				
			case ' Friday':
				dayOfTheWeek = 5;
				
			case ' Saturday':
				dayOfTheWeek = 6;
		}
		
		var query = timetableTable.where({ school_id: schoolId, section_id: sectionId, day_of_week_number: dayOfTheWeek });
		
		query.orderBy("period_number").read().then(function(items) {
			for(var i = 0; i < items.length; i++)
				addElement(items[i].subject, items[i].subject_code, i);
		});
	}
	
	function populateData() {
		populateTimeTable();
	}
	
	// Side-bar HREFs
	$('#a_dashboard').click(function(e) {
		window.location = '../../dashboard';
	});
	
	$('#a_homework').click(function(e) {
		window.location = '../../homework';
	});
	
	$('#a_assig').click(function(e) {
		window.location = '../../assignments';
	});
	
	$('#a_exams').click(function(e) {
		window.location = '../../examinations';
	});
	
	$('#a_timet').click(function(e) {
		window.location = '../../timetable';
	});
	
	$('#a_notif').click(function(e) {
		window.location = '../../notifications';
	});	
	
	$('#a_settings').click(function(e) {
		window.location = '../../settings';
	});
	
	//Replace name in sidebar
	function replaceName() {
        $('#nameBox').html('Hello ' + sessionStorage.getItem('First_Name'));
    }
	
	//Check if user is logged in
    function toggleLogin() {
        if(sessionStorage.getItem("UserId")) {
            var uId = sessionStorage.getItem("UserId");
            
            //Check if names exist
            if((sessionStorage.getItem("First_Name")) != null && (sessionStorage.getItem("Last_Name") != null)) {
				replaceName();
				document.getElementById("main_canvas").style.display = 'block';
				populateData();
				
            } else {
                
            }
            
        } else {
            alert('Not logged in.');
            window.location = '../../../';
        }
    }
	
	function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
	
        window.location = '../../../';
	}
	
	function edit() {
		var url = document.URL;
		var param = url.split('day=')[1];
		window.location = "../../edit_timetable?" + param;
	}
	
	$('#logout').click(function(e){
		logout();
	});
	
	$('#editBtn').click(function(e){
		edit();
	});
	
	toggleLogin();
	
})(window.jQuery || window.Zepto);