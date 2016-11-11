angular.module('app').controller('dashboardCtrl', function($rootScope, $scope, $location){
	$('#world-map').vectorMap({
		map: 'world_mill',
		backgroundColor: '#aad8b0',
		onRegionClick: function(event, region){
			$rootScope.region=region;
			$location.path('/location');
		  	$scope.$apply();
		}
	});
	$scope.signout = function(){
		firebase.auth().signOut().then(function() {
		  Materialize.toast('Logout successful', 4000,'');
		  $location.path('/');
		  $scope.$apply();
		}, function(error) {
		  Materialize.toast(error.message, 4000,'');
		});
	}
});