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
      for(i=0; i<max; i++){
        if(selected=='all')
          var url = "https://monitoratecnologia.atlassian.net/rest/api/latest/search?"+userAndPassword+"&fields=id,key,issuelinks&maxResults=1000&startAt="+i*1000;
        else
          var url = "https://monitoratecnologia.atlassian.net/rest/api/latest/search?"+userAndPassword+"&maxResults=1000&fields=id,key,issuelinks"+"&jql=project="+selected+"&startAt="+i*1000;
        urls.push(url);
      }
      console.log(urls);
      next();
      //console.log(issues);
    });
  });
});

function arrayReset(){
  issues = [];
  restURLs = [];
}

function resquest(url){
  var i, j;
  $.getJSON(url,function(data){
    for(i=0; i<data.issues.length; i++){
      var abort=false;
      if(data.issues[i].fields.issuelinks.length==0){
        continue;
      }
      else{
        for(j=0; j<data.issues[i].fields.issuelinks.length; j++){
          if(data.issues[i].fields.issuelinks[j].hasOwnProperty("outwardIssue")){
            if(getJiraProjectKey(data.issues[i].fields.issuelinks[j].outwardIssue.key)!=getJiraProjectKey(data.issues[i].key)){
              //abort=true;
              data.issues[i].fields.issuelinks.splice(j,1);
              j--;
              continue;
            }
          }
          else{
            if(getJiraProjectKey(data.issues[i].fields.issuelinks[j].inwardIssue.key)!=getJiraProjectKey(data.issues[i].key)){
              //abort=true;
              data.issues[i].fields.issuelinks.splice(j,1);
              j--;
              continue;
            }
          }
        }
      }
    //if(!abort)
      issues.push(data.issues[i]);
    }
  setTimeout(next,10);
  });
}

function next(){
  var url = urls.shift();
  if(!url) {
    console.log(issues)
    createTable();
  }
  resquest(url);
}

function createTable(){
  $("#table1").empty();
  var i, j, k, l, count, a;
  row = document.getElementById("table1").insertRow(0);
  row.insertCell().innerHTML="";
  if(issues.length==0){
  //  $("body").innerHTML="<h1>Não há issues com relacionamentos neste projeto.</h1>";
    //return;
  }
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
        if(getJiraNumber(issues[i].fields.issuelinks[j].outwardIssue.key) == getJiraNumber(issues[last].key)){
          row.insertCell().innerHTML='<div class="dropdown"><button class="dropbtn">'+issues[i].fields.issuelinks[j].type.outward+
          '</button><div class="dropdown-content" id="drop'+i+'"></div></div>';
          l=j+1;
          while(typeof(issues[i].fields.issuelinks[l])!='undefined'){
            if(issues[i].fields.issuelinks[l].hasOwnProperty("outwardIssue")){
              if(getJiraNumber(issues[i].fields.issuelinks[l].outwardIssue.key) == getJiraNumber(issues[last].key)){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.outward+'</option>');
                l++;
                j++;
              }
              else{
                break;
              }
            }
            else{
              if(getJiraNumber(issues[i].fields.issuelinks[l].inwardIssue.key) == getJiraNumber(issues[last].key)){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.inward+'</option>');  
                l++;
                j++;
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
        if(getJiraNumber(issues[i].fields.issuelinks[j].inwardIssue.key) == getJiraNumber(issues[last].key)){
            row.insertCell().innerHTML='<div class="dropdown"><button class="dropbtn">'+issues[i].fields.issuelinks[j].type.inward+
            '</button><div class="dropdown-content" id="drop'+i+'"></div></div>';   
          l=j+1;
          while(typeof(issues[i].fields.issuelinks[l])!='undefined'){
            if(issues[i].fields.issuelinks[l].hasOwnProperty("outwardIssue")){
              if(getJiraNumber(issues[i].fields.issuelinks[l].outwardIssue.key) == getJiraNumber(issues[last].key)){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.ouyward+'</option>');
                l++;
                j++;
              }
              else{
                break;
              }
            }
            else{
              //while(typeof(issues[i].fields.issuelinks[l])!='undefined'){
                if(getJiraNumber(issues[i].fields.issuelinks[l].inwardIssue.key) == getJiraNumber(issues[last].key)){
                $("#drop"+i).append('<option>'+issues[i].fields.issuelinks[l].type.inward+'</option>');  
                l++;
                j++;
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

function getJiraProjectKey(str){
  return str.split("-")[0]
}