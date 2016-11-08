var app = angular.module('app',['ngRoute']);
app.config(function($routeProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/login',{
		templateUrl:'/Tripper/app/login/login.html',
		controller:'loginCtrl',
	})
	.when('/dashboard',{
		templateUrl:'/Tripper/app/dashboard/dashboard.html',
		controller:'dashboardCtrl',
	})
	.otherwise ({ redirectTo: '/' });
});