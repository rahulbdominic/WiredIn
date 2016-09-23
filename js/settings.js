$(function() {
    "use strict";

	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	var	studentsTable = client.getTable('student');
	var loginSessions = client.getTable('loginsessions');
	
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");
	
	
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
	
	
	//Check if Null or WhiteSpace
    function isNullOrWhiteSpace(str) {
        return str === null || str.match(/^ *$/) !== null;
    }
	
	//Replace name in sidebar
	function replaceName() {
		var names = name.split('_');
		$('#nameBox').html('Hello ' + names[0]);
	}
	replaceName();
	//Check if user is logged in
    function toggleLogin() {
        if(sessionStorage.getItem("UserId")) {
            var uId = sessionStorage.getItem("UserId");
            
            //Check if names exist
            if((sessionStorage.getItem("First_Name")) != null && (sessionStorage.getItem("Last_Name") != null)) {
				replaceName();
				document.getElementById("mainCanvas").style.display = 'block';
				populateData();
				
            } else {
                
            }
            
        } else {
            alert('Not logged in.');
            window.location = '../../';
        }
    }
	
	function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = "../../";
	}
	
	function changeEmail(newEmail) {
		var query = studentsTable.where({ student_id: uId, school_s_id: schoolId, section_s_id: sectionId });
		
		query.read().then(function(items) {
			if(items.length == 1) {
				studentsTable.update({ id: items[0].id, email_id: newEmail });
			} else {
				alert('error');
			}
		});
	}
	
	function changePhoneNumber(newNumber) {
		var query = studentsTable.where({ student_id: uId, school_s_id: schoolId, section_s_id: sectionId });
		
		query.read().then(function(items) {
			if(items.length == 1) {
				studentsTable.update({ id: items[0].id, telephone: newNumber });
			} else {
				alert('error');
			}
		});
	}
	
	$('#logout').click(function(e){
		logout();
	});
	
	$('#emailBtn').click(function(e){
		changeEmail($('#emailTextBox').val());
	});
	
	$('#numberBtn').click(function(e){
		changePhoneNumber($('#phoneTextBox').val());
	});
	
	$('#changeSchool').click(function(e) {
		window.location = "../selectschool";
	});
	
	$('#changeSubject').click(function(e) {
		window.location = "../select_subjects_1";
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
	

})(window.jQuery || window.Zepto);