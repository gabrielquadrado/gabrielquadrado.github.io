$(document).ready(function(){
   $('.parallax').parallax();
   jQuery.scrollSpeed(100, 800);

   $('#btn-resposta').on("click", function(){
   	$('#modal-resposta').openModal();
   });

   $(".button-collapse").sideNav();
});