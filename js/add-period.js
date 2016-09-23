$(function() {
    "use strict";

	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	var studentsTable = client.getTable('student');
	var sectionTable = client.getTable('section');
	var subjectTable = client.getTable('subject');
	var timetableTable = client.getTable('timetable');
	
	var params = (window.location.href).split("?");
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");
	
	var isLoggedIn = false;
	
	
	function _fix() {
		
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height();
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
	
	
	function addPeriod() {
		
		var period_number = $('#period_number').val();
		var dow = $('#dow_text').val();
		var subject = (($("#subject").val()).split('-'))[0];
		var subjectCode = (($("#subject").val()).split('-'))[1];
		
		timetableTable.insert({ school_id: schoolId, section_id: sectionId, subject: subject, subject_code: subjectCode, period_number: period_number, day_of_week_number: dow }).then(function(e) {
				alert("Done.");
			}, function(e) {
				alert(e);
		});
	}
	
	function checkLoginAdd() {
		if(sessionStorage.getItem("UserId")) {
            var uId = sessionStorage.getItem("UserId");
            
            //Check if names exist
            if((sessionStorage.getItem("First_Name")) != null && (sessionStorage.getItem("Last_Name") != null)) {
				replaceName();
				document.getElementById("mainCanvas").style.display = 'block';
				addPeriod();
				
            } else {
                
            }
            
        } else {
            alert('Not logged in.');
            window.location = '..';
        }
	}
	
	//Replace name in sidebar
	function replaceName() {
        $('#nameBox') .html('Hello ' + sessionStorage.getItem('First_Name'));
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
            window.location = '../../';
        }
    }
		
	function populateSelect() {
		
		var q = subjectTable.where({ });
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
	populateSelect();
	function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = '../../';
	}
	
	$("#addPeriod").click(function() {
		checkLoginAdd();
	});
		
	$('#logout').click(function(e){
		logout();
	});
	
	// Side-bar HREFs
	$('#a_dashboard').click(function(e) {
		window.location = '../dashboard';
	});
	
	$('#a_homework').click(function(e) {
		window.location = '../homework';
	});
	
	$('#a_assig').click(function(e) {
		window.location = '../assignments';
	});
	
	$('#a_exams').click(function(e) {
		window.location = '../examinations';
	});
	
	$('#a_timet').click(function(e) {
		window.location = '../timetable';
	});
	
	$('#a_notif').click(function(e) {
		window.location = '../notifications';
	});	
	
	$('#a_settings').click(function(e) {
		window.location = '../settings';
	});
	
});