var app = angular.module('app',['ngRoute']);
app.config(function($routeProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/Tripper/login',{
		templateUrl:'/Tripper/app/login/login.html',
		controller:'loginCtrl',
	})
	.when('/Tripper/dashboard',{
		templateUrl:'/Tripper/app/dashboard/dashboard.html',
		controller:'dashboardCtrl',
	});
});