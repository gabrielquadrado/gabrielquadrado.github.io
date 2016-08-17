var issues = [];
var restURLs = [];
var row = document.getElementById("table1").insertRow(0);
var userAndPassword = "os_username=admin&os_password=atlassian123";

$("#dropProjetos").change(function(){
  var i;
  arrayReset();
  var selected = $("#dropProjetos").val();
  $(document).ready(function(){
    if(selected=='all')
      var url = 'https://gabrielquadrado.atlassian.net/rest/api/latest/search?fields=id&'+userAndPassword;
    else
      var url = 'https://gabrielquadrado.atlassian.net/rest/api/latest/search?fields=id&jql=project='+selected+'&'+userAndPassword;
    $.getJSON(url, function(ids){
      var total = ids.total;
      if(selected=='all')
        var url = "https://gabrielquadrado.atlassian.net/rest/api/latest/search?"+userAndPassword+"&maxResults="+total+
        "&fields=id, key, issuetype, summary, description, status";
      else
        var url = "https://gabrielquadrado.atlassian.net/rest/api/latest/search?"+userAndPassword+"&maxResults="+total+
        "&fields=id, key, issuelinks"+"&jql=project="+selected;
        $.getJSON(url, function(data){
            for(i=0; i<total; i++){
              if(data.issues[i].fields.issues.length==0)
                continue;
              issues[i]=data.issues[i];
            }
            createTable();
            console.log(data);
          });
    });
  });
});

function arrayReset(){
  issues = [];
  restURLs = [];
}

function resquest(url){
  $.getJSON(url,function(data){
    console.log(data.id);
    issues.push(data);
    setTimeout(next,1);
  });
}

function next(){
  var url = restURLs.shift();
  if(!url) {
    createTable();
  }
  resquest(url);
}

function createTable(){
  $("#table1").empty();
  var i, j, k, count;
  row = document.getElementById("table1").insertRow(0);
  row.insertCell().innerHTML="";
  for(i=issues.length-1; i>=0; i--)
    row.insertCell().innerHTML=issues[i].key;
  $("#table1 tbody tr")[0].bgColor="#CFCFCF";
  for(i=0; i<issues.length; i++){
    count=0
    row = document.getElementById("table1").insertRow(1);
    row.insertCell().innerHTML=issues[i].key;
    row.cells[0].bgColor="#CFCFCF"
    var last=issues.length-1;
    for(j=0; j<issues[i].fields.issuelinks.length; j++){
	    if(issues[i].fields.issuelinks[j].hasOwnProperty("outwardIssue")==true){
	    	if(issues[i].fields.issuelinks[j].outwardIssue.key == issues[last].key){
	    		row.insertCell().innerHTML=issues[i].fields.issuelinks[j].type.outward;
  				last--;
  				count++;
	        }
	        else{
		        row.insertCell().innerHTML="";
		        last--;
		        count++;
		        j--;
	        }
	    }
    }
    for(j=0; j<issues.length-count; j++)
      row.insertCell().innerHTML="";
  }
  for(i=0; i<issues.length; i++){
  	row = $("#table1 tbody tr")[i+1];
  	for(j=issues.length-1; j>=0; j--){
  		if(issues[i].key==issues[j].key)
    		row.cells[j+1].bgColor="#36648B";
  	}
  }
  $("#table1 tbody tr")[issues.length].cells[issues.length].bgColor="#36648B";
}