var issues = [];
var restURLs = [];
var row = document.getElementById("tableIssues").insertRow(0);
var userAndPassword = "os_username=admin&os_password=atlassian123";

$("#dropProjetos").change(function(){
  var i;
  arrayReset();
  var selected = $("#dropProjetos").val();
  $(document).ready(function(){
    var url = ""
    $.getJSON("https://gabrielquadrado.atlassian.net/rest/api/latest/search?fields=id&"+userAndPassword, function(ids){
      var total = ids.total;
      $.getJSON("https://gabrielquadrado.atlassian.net/rest/api/latest/search?"+userAndPassword+"&maxResults="+total+
        "&fields=id, key, issuetype, summary, description, status", function(data){
          for(i=0; i<total; i++){
            issues[i]=data.issues[i];
          }
          createTable();
          console.log(data);
        })
    })
    /*if(selected=='all')
      var url = 'https://gabrielquadrado.atlassian.net/rest/api/latest/search?fields=id&'+userAndPassword
    else
      var url = 'https://gabrielquadrado.atlassian.net/rest/api/latest/search?fields=id&jql=project='+selected+'&'+userAndPassword
    $.getJSON(url, function(allIssueId){
      var i;
      for(i=0; i<allIssueId.issues.length; i++){
        restURLs[i] = "https://gabrielquadrado.atlassian.net/rest/api/latest/issue/"+allIssueId.issues[i].id+"?"+userAndPassword+
        "&fields=id, key, issuetype, summary, description, status";
      }
      next();
    });*/

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
  })
}

function next(){
  var url = restURLs.shift();
  if(!url) {
    createTable();
  }
  resquest(url);
}

function createTable(){
  $("#tableIssues").empty();
  var i;
  for(i=0; i<issues.length; i++){
    row = document.getElementById("tableIssues").insertRow(0);
    row.insertCell(0).innerHTML=issues[i].id;
    row.insertCell(1).innerHTML=issues[i].key;
    row.insertCell(2).innerHTML=issues[i].fields.issuetype.name;
    row.insertCell(3).innerHTML=issues[i].fields.summary;
    row.insertCell(4).innerHTML=issues[i].fields.description;
    row.insertCell(5).innerHTML=issues[i].fields.status.name;
    if(i==issues.length-1){
      row = document.getElementById("tableIssues").insertRow(0);
      row.insertCell(0).innerHTML="ID";
      row.insertCell(1).innerHTML="KEY";
      row.insertCell(2).innerHTML="TIPO";
      row.insertCell(3).innerHTML="SUMÁRIO";
      row.insertCell(4).innerHTML="DESCRIÇÃO";
      row.insertCell(5).innerHTML="STATUS";
      $("#tableIssues tr")[0].bgColor="#808080"
    }
  }
}