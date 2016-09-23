$(function () {
    'use strict';
    var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
    var sessionsTable = client.getTable('loginsessions');
    var homeworkTable = client.getTable('homework');
    var assignmentTable = client.getTable('assignment');
    var testTable = client.getTable('test');
    var loginSessions = client.getTable('loginsessions');
    var notificationTable = client.getTable('notifications');
    var studentTable = client.getTable('student');
    var uId = sessionStorage.getItem('UserId');
    var sectionId = sessionStorage.getItem('Section_Id');
    var schoolId = sessionStorage.getItem('School_Id');
    var homeworkL = 0;
    var assignmentL = 0;
    var examL = 0;
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
	
    function populateData() {
        populateAssignments();
    }
	
    function daydiff(first, second) {
    	return (second-first)/(1000*60*60*24)
	}
	
	function parseDate(str) {
		var mdy = str.split('/')
    	return new Date(mdy[2], mdy[1]-1, mdy[0]);
	}

	function getDayDiff(first, second) {
		return daydiff(parseDate(first), parseDate(second));
	}
    function populateAssignments() {
		
		var t = false;
		
        var uId = sessionStorage.getItem('UserId');
        var sectionId = sessionStorage.getItem('Section_Id');
        var schoolId = sessionStorage.getItem('School_Id');
        var assignmentL = 0;
		var h = 0;
        var sQuery = studentTable.where({
            student_id: uId
        });
        sQuery.read().then(function (e) {
            var subjects = (e[0].subject_codes).split(',');
            for (var z = 0; z < subjects.length; z++) {
                var query = assignmentTable.where({
                    school_id: schoolId,
                    section_id: sectionId,
                    subject_code: subjects[z]
                });
                query.orderBy("due_date").read().then(function (items) {
                    assignmentL = items.length;
                    if (items.length == 0) {
						$("#status_label").css("display", "inline-block");
                    } else {
                        for (var i = 0; i < items.length; i++) {
                            var sec = document.getElementById('assignments_section');
                            var item = document.createElement('div');
                            var dd = items[i].due_date;
                            var today = new Date();
                            var month = parseInt(today.getMonth()) + 1;
                            var day = parseInt(today.getDate());
                            var year = parseInt(today.getFullYear());
                            var dayDiff = getDayDiff(day + '/' + month + '/' + year, dd.getDate() + '/' + (parseInt(dd.getMonth()) + 1) + '/' + dd.getFullYear());
							
                            if (dayDiff > 0) {
                                item.setAttribute('class', 'col-xs-3 card hovercard');
                                item.setAttribute('id', 'assignmentHover_' + i);
                                if (dayDiff > 3) {
                                    item.setAttribute('style', 'margin-right:10px; border-top-color: #04B404');
                                } else if (dayDiff > 1 && dayDiff <= 3) {
                                    item.setAttribute('style', 'margin-right:10px; border-top-color: #FF8C00');
                                } else {
                                    item.setAttribute('style', 'margin-right:10px; border-top-color: rgba(255,10,0,1)');
                                }
                                item.innerHTML += '<div class="row">'
                                + '<div class = "info">'
                                + '<div class="title" style="padding:10px">'
                                + '<h8 class="pull-left">'
                                + items[i].subject
                                + '</h8></div></div></div>'
                                + '<div class="row">'
                                + '<div class="info"'
                                + '<div class="desc">'
                                + '<p>'
                                + items[i].description
                                + '</p></div></div></div>'
                                + '<div class="bottom">'
                                + '<div class="row" style="margin-top: -10px;">Date: '
                                + dd.getDate() + '/' + (parseInt(dd.getMonth()) + 1).toString() + '/' + dd.getFullYear()
                                + '</div></div></div>';
                                sec.appendChild(item);
                                assignmentL += 1;
								t = true;
                            }
                        }
                    }
                    
                    for (var i = 0; i < assignmentL; i++)
                    if ($('#assignmentHover_' + i).height() > h)
                    h = $('#assignmentHover_' + i).height();
                    for (var i = 0; i < assignmentL; i++)
                    $('#assignmentHover_' + i).height(h);
                    _fix();
					
					if(t == true) {
						document.getElementById('status_label').style.display ='none';
					}
					
                });
            }
        });
    }
	$('#add').click(function (e) {
        window.location = '../add-item?0?0?0?0?a';
    });
    $('#logout').click(function (e) {
        logout();
    });
    // Side-bar HREFs
    $('#a_dashboard').click(function (e) {
        window.location = '../dashboard';
    });
    $('#a_homework').click(function (e) {
        window.location = '../homework';
    });
    $('#a_assig').click(function (e) {
        window.location = '../assignments';
    });
    $('#a_exams').click(function (e) {
        window.location = '../examinations';
    });
    $('#a_timet').click(function (e) {
        window.location = '../timetable';
    });
    $('#a_notif').click(function (e) {
        window.location = '../notifications';
    });
    $('#a_settings').click(function (e) {
        window.location = '../settings';
    });
    //Check if Null or WhiteSpace
    function isNullOrWhiteSpace(str) {
        return str === null || str.match(/^ *$/) !== null;
    }
	
    function logout() {
		sessionStorage.setItem("UserId", "");
		sessionStorage.setItem("Section_Id", "");
	 	sessionStorage.setItem("School_Id", "");
		window.location = '../../';
	}
	
    //Replace name in sidebar
    function replaceName() {
        $('#nameBox').html('Hello ' + sessionStorage.getItem('First_Name'));
    }
    //Check if user is logged in

    function toggleLogin() {
        if (sessionStorage.getItem('UserId')) {
            var uId = sessionStorage.getItem('UserId');
            //Check if names exist
            if ((sessionStorage.getItem('First_Name')) != null && (sessionStorage.getItem('Last_Name') != null)) {
                replaceName();
                document.getElementById('mainCanvas').style.display = 'block';
                populateData();
            } else {
            }
        } else {
            alert('Not logged in.');
            window.location = '../../';
        }
    }
	
    toggleLogin();
});
