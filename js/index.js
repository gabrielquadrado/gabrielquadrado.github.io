$(document).ready(function () {
    if($.browser.mobile){
    	$('body').css('background','url(./img/3.png) repeat center center fixed');
    	$('body').addClass('mobile');
    } else {
    	$(".player").mb_YTPlayer();
    }
	$('.tooltipped').tooltip({delay: 50});
});