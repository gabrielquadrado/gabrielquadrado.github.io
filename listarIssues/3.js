var issues = [];
var row = document.getElementById("tableIssues").insertRow(0);
var userAndPassword = "os_username=&os_password=";

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
        "&fields=id, key, issuetype, summary, description, status"+"&jql=project="+selected;
        $.getJSON(url, function(data){
            for(i=0; i<total; i++){
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