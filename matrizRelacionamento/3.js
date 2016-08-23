var issues = [];
var urls = [];
var row = document.getElementById("table1").insertRow(0);
var userAndPassword = "os_username=quadrado&os_password=atlassian123";
var total;

$("#dropProjetos").change(function(){
  var i;
  arrayReset();
  var selected = $("#dropProjetos").val();
  $(document).ready(function(){
    if(selected=='all')
      var url = 'https://monitoratecnologia.atlassian.net/rest/api/latest/search?fields=id&'+userAndPassword;
    else
      var url = 'https://monitoratecnologia.atlassian.net/rest/api/latest/search?fields=id&jql=project='+selected+'&'+userAndPassword;
    $.getJSON(url, function(ids){
      total = ids.total;
      console.log("Total: "+total);
      var max=Math.ceil(total/1000);
      var i, j;
      for(i=0; i<=max; i++){
        if(selected=='all')
          var url = "https://monitoratecnologia.atlassian.net/rest/api/latest/search?"+userAndPassword+"&fields=id,key,issuelinks&maxResults=1000&startAt="+i*1000;
        else
          var url = "https://monitoratecnologia.atlassian.net/rest/api/latest/search?"+userAndPassword+"&maxResults=1000&fields=id,key,issuelinks"+"&jql=project="+selected+"&startAt="+i*1000;
        urls.push(url);
      }
      console.log(urls);
      next();
    });
      //createTable();
        /*$.getJSON(url, function(data){
          var j = 0;
            for(i=0; i<total; i++){
              if(data.issues[i].fields.issuelinks.length==0)
                continue;
              issues[j]=data.issues[i];
              j++;
            }
            createTable();
            console.log(data);
          });*/
  });
});

function arrayReset(){
  issues = [];
  restURLs = [];
}

function resquest(url){
  $.getJSON(url,function(data){
    for(i=0; i<data.length; i++){
      if(data.issues[i].fields.issuelinks.length==0)
        continue;
      issues.push(data.issues[i]);
    }
    setTimeout(next,1);
  });
}

function next(){
  var url = urls.shift();
  if(!url) {
    console.log("Issues: "+issues)
  }
  resquest(url);
}

function createTable(){
  $("#table1").empty();
  var i, j, k, l, count, a;
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
      //a=0;
      if(issues[i].fields.issuelinks[j].hasOwnProperty("outwardIssue")==true){
        if(issues[i].fields.issuelinks[j].outwardIssue.key == issues[last].key){
          //if(a==0){
            row.insertCell().innerHTML='<div class="dropdown"><button class="dropbtn">'+issues[i].fields.issuelinks[j].type.outward+
            '</button><div class="dropdown-content" id="drop'+i+'"></div></div>';
            //a++;
          //}
          l=j+1;
          while(typeof(issues[i].fields.issuelinks[l])!='undefined'){
            if(issues[i].fields.issuelinks[l].hasOwnProperty("outwardIssue")){
              if(issues[i].fields.issuelinks[l].outwardIssue.key == issues[last].key){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.outward+'</option>');
                l++;
                j++;
                //a++;
              }
              else{
                break;
              }
            }
            else{
              if(issues[i].fields.issuelinks[l].inwardIssue.key == issues[last].key){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.inward+'</option>');  
                l++;
                j++;
                //a++;
              }
              else{
                break;
              }
            } 
          }
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
          //if(a==0){
            row.insertCell().innerHTML='<div class="dropdown"><button class="dropbtn">'+issues[i].fields.issuelinks[j].type.inward+
            '</button><div class="dropdown-content" id="drop'+i+'"></div></div>';   
          //}
          l=j+1;
          while(typeof(issues[i].fields.issuelinks[l])!='undefined'){
            if(issues[i].fields.issuelinks[l].hasOwnProperty("outwardIssue")){
              if(issues[i].fields.issuelinks[l].outwardIssue.key == issues[last].key){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.ouyward+'</option>');
                l++;
                j++;
                //a++;
              }
              else{
                break;
              }
            }
            else{
              //while(typeof(issues[i].fields.issuelinks[l])!='undefined'){
                if(issues[i].fields.issuelinks[l].inwardIssue.key == issues[last].key){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.inward+'</option>');  
                l++;
                j++;
                //a++;
                }
                else{
                  break;
                }
              }
            //}
          }
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
  for(i=0; i<issue.fields.issuelinks.length-1; i++){
    menor = i;
    for(j=(i+1); j<issue.fields.issuelinks.length; j++){
      if(issue.fields.issuelinks[menor].hasOwnProperty("outwardIssue")){
        if(issue.fields.issuelinks[j].hasOwnProperty("outwardIssue")){
          if(getJiraNumber(issue.fields.issuelinks[j].outwardIssue.key)<getJiraNumber(issue.fields.issuelinks[menor].outwardIssue.key)){
            menor = j;
          }
        }
        if(issue.fields.issuelinks[j].hasOwnProperty("inwardIssue")){
          if(getJiraNumber(issue.fields.issuelinks[j].inwardIssue.key)<getJiraNumber(issue.fields.issuelinks[menor].outwardIssue.key)){
            menor = j;
          }
        }
      }
      if(issue.fields.issuelinks[menor].hasOwnProperty("inwardIssue")){
        if(issue.fields.issuelinks[j].hasOwnProperty("outwardIssue")){
          if(getJiraNumber(issue.fields.issuelinks[j].outwardIssue.key)<getJiraNumber(issue.fields.issuelinks[menor].inwardIssue.key)){
            menor = j;
          }
        }
        if(issue.fields.issuelinks[j].hasOwnProperty("inwardIssue")){
          if(getJiraNumber(issue.fields.issuelinks[j].inwardIssue.key)<getJiraNumber(issue.fields.issuelinks[menor].inwardIssue.key)){
            menor = j;
          }
        }
      }
    }
    temp = issue.fields.issuelinks[i];
    issue.fields.issuelinks[i] = issue.fields.issuelinks[menor];
    issue.fields.issuelinks[menor] = temp;
  }
}

function getJiraNumber(str){
  return parseInt(str.split("-")[1])
}
