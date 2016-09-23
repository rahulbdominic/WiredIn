$(function() {
    "use strict";

	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	var homeworkTable = client.getTable('homework');
	var assignmentTable = client.getTable('assignment');
	var testTable = client.getTable('test');
	var subjectTable = client.getTable('subject');
	
	var params = (window.location.href).split("?");
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");
	var option = params[5];
	
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
	
	$('#add').click(function(e) {
		toggleLogin();
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
		alert();
        if(sessionStorage.getItem("UserId")) {
            var uId = sessionStorage.getItem("UserId");
            alert();
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
	
	function populateData() {
		
		var subjectName = (($("#subject_name").val()).split('-'))[0];
		var dateData = $('#date_data').val();
		var description = $('#description_data').val();
		var subjectId = (($("#subject_name").val()).split('-'))[1]
		
		var yf=dateData.split("-")[0];           
		var mf=dateData.split("-")[1];
		var df=dateData.split("-")[2];
		
		var fDate = new Date(parseInt(yf), parseInt(mf), parseInt(df));
		fDate.setFullYear(parseInt(yf), parseInt(mf) - 1, parseInt(df));
		if(subjectId != '' && subjectName != '' && dateData != '' && description != '') {
	
			if(0 == 0) {
				switch(option) {

					case 'h':
						alert();
						homeworkTable.insert({ school_id: schoolId, section_id: sectionId, subject: subjectName, subject_code: subjectId, description: description, due_date: fDate }).then(function() {
							alert('Done');
							window.location =  '../homework';
						}, function(ex) {
							alert(ex);
						});
				
						break;

					case 'a':
				
						assignmentTable.insert({ school_id: schoolId, section_id: sectionId, subject: subjectName, subject_code: subjectId, description: description, due_date: fDate }).then(function() {
							alert('Done');
							window.location =  '../assignments';
						}, function(ex) {
							alert(ex);
						});
				
						break;
			
					case 'e':
	
						testTable.insert({ school_id: schoolId, section_id: sectionId, subject: subjectName, subject_code: subjectId, description: description, due_date: fDate }).then(function() {
							alert('Done');
							window.location =  '../examinations';
						}, function(ex) {
							alert(ex);
						});
				
						break;
					}
				} else {
					alert("Subject code incorrect.");
				}
		} else {
			alert('Fill in all the areas first.');
		}
	}
	
	function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = '../../';
	}
	
	function populateSelect() {
		
		var q = subjectTable.where({ });
		var str = "";
		q.read().then(function(items) {
			for(var i = 0; i < items.length; i++)
			{
				str = (items[i].name + "-" + items[i].subject_id);
				if((str.toLocaleLowerCase()).indexOf("elective") <= -1) {
					$('#subject_name').append(($('<option>', {
						value: str,
    					text: str
					})));
				} else {
				
				}
			}
		});
		
	}
	
	populateSelect();
	
	$('#logout').click(function(e) {
		logout();
	});
	
	// Side-bar HREFs
	$('#a_dashboard').click(function(e) {
		window.location = '../dashboard?'
		
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