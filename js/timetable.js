$(function() {
    "use strict";
	
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");

	 //Enable sidebar toggle
    $("[data-toggle='offcanvas']").click(function(e) {
        e.preventDefault();

        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
    });

    function _fix() {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height();
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
            //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + "px");
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + "px");
        }
    }
    //Fire upon load
    _fix();
    //Fire when wrapper is resized
    $(".wrapper").resize(function() {
        _fix();
    });
	
	//Replace name in sidebar
	function replaceName() {
        $('#nameBox') .html('Hello ' + sessionStorage.getItem('First_Name'));
    }
	
	replaceName();
	
	//Time table HREFs
	$("#tile_mon").click(function(e) {
		window.location = "timetable_day?day=monday"
	});
	
	$("#tile_tue").click(function(e) {
		window.location = "timetable_day?day=tuesday"
	});
	
	$("#tile_wed").click(function(e) {
		window.location = "timetable_day?day=wednesday"
	});
	
	$("#tile_thu").click(function(e) {
		window.location = "timetable_day?day=thursday"
	});
	
	$("#tile_fri").click(function(e) {
		window.location = "timetable_day?day=friday"
	});
	
	$("#tile_sat").click(function(e) {
		window.location = "timetable_day?day=saturday"
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
	
	function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = "../../";
	}
	
	
	$('#logout').click(function(e){
		logout();
	});
	
	
})(window.jQuery || window.Zepto);