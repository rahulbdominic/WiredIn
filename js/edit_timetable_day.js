$(function() {
    "use strict";
		
	var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
	var timetableTable = client.getTable('timetable');
	var studentsTable = client.getTable('student');
	var sectionTable = client.getTable('section');
	
	var params = (window.location.href).split("?");
	var day = params[1];
	var uId = sessionStorage.getItem("UserId");
	var sectionId = sessionStorage.getItem("Section_Id");
	var schoolId = sessionStorage.getItem("School_Id");
	
	var dayOfTheWeek = 0;
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
	
	function spaces(i, element) {
		for(var a = 0; a < i; a++) {
			element.append("&nbsp;")
		}
	}
	
	
	var url = document.URL;
	var param = url.split('?')[1];
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
	
	function delClicked(evt) {
		var senderId = $(evt.target).attr('id');
		var id = $('#p_' + senderId.split('_')[1]).html();
		alert(id);
		
		timetableTable.del({ id: id }).then(function() {
			location.reload();
		}, function(e){
			alert(e);
		});
	}
	
	function addElement(id, subject, subjectCode, i) {
  		var sec = document.getElementById('container_div');
  		var tile = document.createElement('div');
  		tile.setAttribute('class',"col-xs-3 card hovercard");
  		tile.setAttribute('style',"margin-right:10px; background-color:rgba(250,250,250,1); height:200px; border-top: 2px solid rgba(0,50,200,1)");
		tile.innerHTML += '<div class="row">';
		tile.innerHTML += '<div class = "info">';
		tile.innerHTML += '<div class="title" style="padding:10px">';
		tile.innerHTML += '<p style="padding-top:0px; font-size:20px;">' + subject + '</p>';
		tile.innerHTML += '<p style="padding-top:10px; font-size:16px;">' + subjectCode + '</p>' + '<p id="p_' + i + '" style="display:none">' + id + '</p>';
		tile.innerHTML += '<button id="del_' + i + '" class="btn btn-danger" style="margin-top:10px"><i id="a_' + i + '" class="fa fa-minus pull-left" style="font-size:12px; padding-top:5px"></i><span id="b_' + i + '" class="pull-left" style="padding-left:5px">Remove period</span></button></div>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		tile.innerHTML += '</div>';
		sec.appendChild(tile);
		
		document.getElementById('del_' + i)
						.addEventListener('click', delClicked, false);
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
				addElement(items[i].id, items[i].subject, items[i].subject_code, i);
		});
	}
	
	function populateData() {
		populateTimeTable();
	}
	
	$("#addPeriod").click(function(){
		window.location = "../add-period";
	});
	
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
		window.location = '../../';
	}
	
	$('#logout').click(function(e){
		logout();
	});
	
})(window.jQuery || window.Zepto);