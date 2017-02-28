angular.module('MyApp')
.config(['$routeProvider','$locationProvider','$animateProvider',function($routeProvider,$locationProvider,$animateProvider){
	$animateProvider.classNameFilter(/ng-animate-enabled/)
	
	$routeProvider
	.when('/',{
		templateUrl:'/views/input.html',
		controller:'SendInputCtrllr'
	})
	.when('/overall',{
		templateUrl:'/views/overall.html',
		controller:'OverallDataCtrllr'
	})
	.when('/detailed/:dataOf',{
		templateUrl:'/views/detailed.html',
		controller:'DetailedDataCtrllr'
	})
	.otherwise({
		redirectTo:'/overall'
	});
	$locationProvider.hashPrefix('');
}]);

