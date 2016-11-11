angular.module('app').controller('loginCtrl', function($rootScope, $scope, $location){
	$(document).ready(function(){
		$scope.name='';
		$scope.email='';
		$scope.password='';
		console.log('ESCOPO: ',$scope);

	   	$scope.login = function(){
	   		$scope.registerMode=false;
	   		firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
	   		  Materialize.toast(error.message, 4000,'');
	   		  firebase.auth().signOut().then(function() {});
	   		}).then(function(){
	   			firebase.auth().onAuthStateChanged(function(user) {
				if(user){
					Materialize.toast('Login successful', 4000,'');
					$location.path('/dashboard');
			   		$scope.name='';
			   		$scope.email='';
			   		$scope.password='';
			   		$scope.$apply();
				}
				});
	   		});
	   	}

	   	$scope.register = function(){
	   		$scope.registerMode=true;
	   		$('.login-box-content #btn-register').on('click',function(){
	   			firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
	   				Materialize.toast(error.message, 4000,'');
	   				firebase.auth().signOut().then(function() {});
	   			}).then(function(){
	   				firebase.auth().onAuthStateChanged(function(user) {
	   					if(user){
	   						Materialize.toast('Signup successful', 4000,'');
	   						$location.path('/dashboard');
			   		   		$scope.name='';
			   		   		$scope.email='';
			   		   		$scope.password='';
			   		   		$scope.registerMode=false;
			   		   		$scope.$apply();
	   					}
	   				});
	   			});
	   		});
	   	}

	   	$('.login-box-footer .back-link').on('click',function(){
	   		$scope.registerMode=false;
	   		$scope.name='';
	   		$scope.email='';
	   		$scope.password='';
	   		$scope.$apply();
	   	});
	});
});