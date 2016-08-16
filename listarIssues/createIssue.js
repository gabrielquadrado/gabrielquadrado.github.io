$(document).ready(function(){
	$.getJSON('https://gabrielquadrado.github.io/listarIssues/issue.json', function(issue){
  	$.post('https://gabrielquadrado.atlassian.net/rest/api/latest/issue',issue);
  	});
});