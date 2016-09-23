$(function() {
    "use strict";

    var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	var sessionsTable = client.getTable('loginsessions');
	var homeworkTable = client.getTable('homework');
	var assignmentTable = client.getTable('assignment');
	var testTable = client.getTable('test');
	var loginSessions = client.getTable('loginsessions');
	var notificationTable = client.getTable('notifications');
	var studentTable = client.getTable('student');
	
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");
	
	var homeworkL = 0;
	var assignmentL = 0;
	var examL = 0;
	
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
	
	function populateNotifications() {
		var query = notificationTable.where({ section_id: sectionId, school_id: schoolId });
		
		query.orderBy("date").read().then(function(items) {
			if(items.length == 0) {
				$("#status_label").css("display", "inline-block");
			} else {
				for(var i = items.length - 1; i > 0; i--) {
					var sec = document.getElementById('notif_section');
					var item = document.createElement('div');
					var dd = new Date(items[i].date);
					
					item.setAttribute('class', 'row');
					
					item.innerHTML += '<div class="notification-row">'
									+ '<small class="pull-right notif-date">' 
									+ dd.getDate() + '/' + (parseInt(dd.getMonth()) + 1).toString() + '/' + dd.getFullYear() + '</small>'
									+ '<small class="pull-left">'
									+ items[i].description  + '</small>'
									+ '</div></div>';
					sec.appendChild(item);
				}
			}
		});
	}
	
	function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = "../../";
	}
	
	function populateData() {
		populateNotifications();
	}
	
	function getDayDiff(first, second) {
		return daydiff(parseDate(first), parseDate(second));
	}
	
	
	function parseDate(str) {
		var mdy = str.split('/')
    	return new Date(mdy[2], mdy[1]-1, mdy[0]);
	}

	
	function daydiff(first, second) {
    	return (second-first)/(1000*60*60*24)
	}
	
	$('#add').click(function(e){
		
		window.location = '../add-notification';
		
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
	
	//Check if Null or WhiteSpace
    function isNullOrWhiteSpace(str) {
        return str === null || str.match(/^ *$/) !== null;
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
				document.getElementById("mainCanvas").style.display = 'block';
				populateData();
				
            } else {
                
            }
            
        } else {
            alert('Not logged in.');
            window.location = '../../';
        }
    }
	
	toggleLogin();
	
})(window.jQuery || window.Zepto);