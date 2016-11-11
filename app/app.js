var app = angular.module('app',['ngRoute']);
app.config(function($routeProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/',{
		templateUrl:'app/location/location.html',
		controller:'locationCtrl',
	})
	.when('/login',{
		templateUrl:'app/login/login.html',
		controller:'loginCtrl',
	})
	.when('/dashboard',{
		templateUrl:'app/dashboard/dashboard.html',
		controller:'dashboardCtrl',
	})
	.when('/location',{
		templateUrl:'app/location/location.html',
		controller:'locationCtrl',
	})
	.otherwise ({ redirectTo: '/' });
});