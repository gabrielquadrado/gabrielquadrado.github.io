angular.module('app').controller('locationCtrl', function($rootScope, $scope, $location){
	$('div.jvectormap-tip').remove();
	$('.parallax').parallax();
	jQuery.scrollSpeed(100, 800);
	console.log('location',$scope.region);
});