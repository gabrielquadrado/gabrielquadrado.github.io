var userAndPassword = "os_username=quadrado&os_password=atlassian123";
$(document).ready(function(){
	$.getJSON('https://gabrielquadrado.atlassian.net/rest/api/latest/project?'+userAndPassword, function(projects){
	    var i;
	    $.each(projects, function (k, v) {
	        $('#dropProjetos').append($('<option>', { 
	            value: v.key,
	            text : v.name
	        }));
	    });
  	});

});
