var userAndPassword = "os_username=quadrado&os_password=gafiqua123";
$(document).ready(function(){
	$.getJSON('https://monitoratecnologia.atlassian.net/rest/api/latest/project?'+userAndPassword, function(projects){
	    var i;
	    $.each(projects, function (k, v) {
	        $('#dropProjetos').append($('<option>', { 
	            value: v.key,
	            text : v.name
	        }));
	    });
  	});

});
