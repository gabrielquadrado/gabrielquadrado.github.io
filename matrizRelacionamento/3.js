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
        "&fields=id, key, issuelinks";
      else
        var url = "https://gabrielquadrado.atlassian.net/rest/api/latest/search?"+userAndPassword+"&maxResults="+total+
        "&fields=id, key, issuelinks"+"&jql=project="+selected;
        $.getJSON(url, function(data){
          var j = 0;
            for(i=0; i<total; i++){
              if(data.issues[i].fields.issuelinks.length==0)
                continue;
              issues[j]=data.issues[i];
              j++;
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
    if(issues[i].fields.issuelinks.length>1)
        orderLinks(issues[i]);
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
      else{
        if(issues[i].fields.issuelinks[j].inwardIssue.key == issues[last].key){
          row.insertCell().innerHTML=issues[i].fields.issuelinks[j].type.inward;
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

function orderLinks(issue){
  var i, j, temp, menor;
  var links = issue.fields.issuelinks;
  for(i=0; i<links.length-1; i++){
    menor = i;
    for(j=i+i; j<links.length; j++){
      if(links[menor].hasOwnProperty("outwardIssue")){
        if(links[j].hasOwnProperty("outwardIssue")){
          if(links[j].outwardIssue.key<menor.outwardIssue.key){
            menor = j;
          }
        }
        if(links[j].hasOwnProperty("inwardIssue")){
          if(links[j].inwardIssue.key<menor.outwardIssue.key){
            menor = j;
          }
        }
      }
      if(links[menor].hasOwnProperty("inwardIssue")){
          if(links[j].hasOwnProperty("outwardIssue")){
            if(links[j].outwardIssue.key<menor.inwardIssue.key){
              menor = j;
            }
          }
          if(links[j].hasOwnProperty("inwardIssue")){
            if(links[j].inwardIssue.key<menor.inwardIssue.key){
              menor = j;
            }
          }
        }
      temp = links[i];
      links[i] = links[menor];
      links[menor] = temp;
    }
  }
}
    /*for(i=0; i<issue.fields.issuelinks.length; i++){
    if(issue.fields.issuelinks[i].hasOwnProperty("outwardIssue")==true){
      for(j=i; j>=0; j--){
        if(typeof(issue.fields.issuelinks[j+1])!='undefined'){
          if(issue.fields.issuelinks[j+1].hasOwnProperty("outwardIssue")==true){
            if(issue.fields.issuelinks[j+1].outwardIssue.key<issue.fields.issuelinks[j].outwardIssue.key){
              temp = issue.fields.issuelinks[j];
              issue.fields.issuelinks[j]=issue.fields.issuelinks[j+1];
              issue.fields.issuelinks[j+1]=temp;
            }
          }
          else{
            if(issue.fields.issuelinks[j+1].inwardIssue.key<issue.fields.issuelinks[j].outwardIssue.key){
              temp = issue.fields.issuelinks[j];
              issue.fields.issuelinks[j]=issue.fields.issuelinks[j+1];
              issue.fields.issuelinks[j+1]=temp;
            }
          }
        }
      }
    }
    else{
      for(j=i; j>=0; j--){
        if(typeof(issue.fields.issuelinks[j+1])!='undefined'){
          if(issue.fields.issuelinks[j+1].hasOwnProperty("outwardIssue")==true){
            if(issue.fields.issuelinks[j+1].outwardIssue.key<issue.fields.issuelinks[j].inwardIssue.key){
              temp = issue.fields.issuelinks[j];
              issue.fields.issuelinks[j]=issue.fields.issuelinks[j+1];
              issue.fields.issuelinks[j+1]=temp;
            }
          }
          else{
            if(issue.fields.issuelinks[j+1].inwardIssue.key<issue.fields.issuelinks[j].inwardIssue.key){
              temp = issue.fields.issuelinks[j];
              issue.fields.issuelinks[j]=issue.fields.issuelinks[j+1];
              issue.fields.issuelinks[j+1]=temp;
            }
          }
        }
      }
    }
  }*/