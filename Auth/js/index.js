$(function() {
    "use strict";
	
    var client = new WindowsAzure.MobileServiceClient('https://wiredindev.azure-mobile.net/', 'uCAISNNsfIrfPJXwdDOhIjtGgrTYXM45');
	
    var StudentTable = client.getTable('student');
    var IdentitiesTable = client.getTable('identities');

    function ErrorHandle(e) {
        alert(e);
    }
	
	function authenticateSignIn() {
        client.login("google").then(authCompleteSignIn, function(error) {
			alert(error);
		});
    }
    
    function authCompleteSignIn() {
        //Check if user is logged in
        var isLoggedIn = client.currentUser !== null;
        //Get userid and truncate
		var str = client.currentUser.userId;
		var n = str.replace("Google:", "");
		if(isLoggedIn) {
			signIn(n);
		}
        
    }
	
	
    function authenticateSignUp() {
        client.login("google").then(authCompleteSignUp, function(error) {
			alert(error);
		});
    }
    
    function authCompleteSignUp() {
        //Check if user is logged in
        var isLoggedIn = client.currentUser !== null;
        //Get userid and truncate
		var str = client.currentUser.userId;
		var n = str.replace("Google:", "");
		
		if(isLoggedIn) {
			signUp(n);
		}
        
    }
    
    function signUp(uid) {
        
		var studentquery = StudentTable.where({ student_id: uid, isactive: 'active' });
        
        studentquery.read().then(function(results) {
            //Check if only one account with that uid is present else throw exceptions
            if(results.length == 1) {
                alert("Account already exists.");
            } else if(results.length == 0) {
                
                //Set uid in session
                sessionStorage.setItem("UserId", uid);
                
                //Get access token for gmail to get user information
                var token = "";
				var q = IdentitiesTable.where({ });
				q.read().then(function(items) {
					var data = JSON.stringify(items);
								
					var s = data.replace('[{"identities":{"google":{"userId":"Google:'+ uid +'","accessToken":"', "");
					
					var accessToken = s.replace('"}}}]', "");
                    
				    //Query google access code with ajax
					$.ajax({
        				url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken,
						data: null,
        				success: function(response) {  
            				var dat = JSON.stringify(response);
                            
                            //Query user data with ajax
							$.ajax({
        						url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + accessToken,
								data: null,
        						success: function(response) {		
									var dat = response.name;
                                    var names = dat.split(" ");
                                    
                                    //Set name data in storage
                                    sessionStorage.setItem("First_Name", names[0]);
                                    sessionStorage.setItem("Last_Name", names[1]);
                                    
                                    sessionStorage.loggedInUser = JSON.stringify(client.currentUser);
                                    window.location = "selectschool";
        				        },
        				        error: function(error) {
							         alert(error)
        				        },
       							dataType: "jsonp"
							});
        				},  
        				error: function(error) {
							alert(error)
        				},
        				dataType: "jsonp" 
					});
				});
                
            } else {
                alert("Error occured with 1900 code. Contact support.");
            }
        });
    }
    
	function signIn(uId) {
		var query = StudentTable.where({ student_id: uId, isactive: 'active' });
		query.read().then(function(items) {
			if(items.length == 1) {
				
				sessionStorage.setItem("Section_Id", items[0].section_s_id);
				sessionStorage.setItem("School_Id", items[0].school_s_id);
				sessionStorage.setItem("First_Name", items[0].first_name); 
				sessionStorage.setItem("Last_Name", items[0].last_name); 
				sessionStorage.setItem("Subjects", items[0].subject_codes);
				sessionStorage.setItem("UserId", uId);
				
				window.location = '../pages/dashboard?';
			} else {
				alert("Account not created. Try creating an account.");
			}
		});
	}
	
	$('#signupgmail').click(function(evt) {
		
		authenticateSignUp();
	});
	
	$('#login').click(function(evt) {
		authenticateSignIn();
	});
	
});