angular.module('Tripper',[]).controller('loginCtrl', function($scope){
	$(document).ready(function(){
		$scope.name='';
		$scope.email='';
		$scope.password='';
	   	$('.parallax').parallax();
	   	jQuery.scrollSpeed(100, 800);
		console.log('ESCOPO: ',$scope);

	   	$scope.login = function(){
	   		firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
	   		  Materialize.toast(error.message, 4000,'');
	   		}).then(function(){
	   			firebase.auth().onAuthStateChanged(function(user) {
				if(user){
					Materialize.toast('Login successful', 4000,'');
					firebase.auth().signOut().then(function() {
					  Materialize.toast('Logout successful', 4000,'');
					}, function(error) {
					  Materialize.toast(error.message, 4000,'');
					});
			   		$scope.name='';
			   		$scope.email='';
			   		$scope.password='';
			   		$scope.$apply();
				}
				});
	   		});
	   	}

	   	$scope.register = function(){
	   		$('.login-box-content .hide').removeClass('hide');
	   		$('.login-box-footer a').addClass('hide');
	   		$('.login-box-content #btn-login').addClass('hide');
	   		$('.login-box-content #btn-register').on('click',function(){
	   			firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).catch(function(error) {
	   				Materialize.toast(error.message, 4000,'');
	   			}).then(function(){
	   				firebase.auth().onAuthStateChanged(function(user) {
	   					if(user){
	   						Materialize.toast('Signup successful', 4000,'');
	   						firebase.auth().signOut().then(function() {
	   						  Materialize.toast('Logout successful', 4000,'');
	   						}, function(error) {
	   						  Materialize.toast(error.message, 4000,'');
	   						});
	   						$('div.input-field.col.s12.animated.fadeIn').addClass('hide');
			   		   		$('.login-box-footer a').removeClass('hide');
			   		   		$('.login-box-content #btn-login').removeClass('hide');
			   		   		$('.login-box-content #btn-register').addClass('hide');
			   		   		$scope.name='';
			   		   		$scope.email='';
			   		   		$scope.password='';
			   		   		$scope.$apply();
	   					}
	   				});
	   			});
	   		});
	   	}
	});
});