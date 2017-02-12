angular.module('MyApp')
.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/home',{
		templateURL:'./views/input.html',
		controller:'SendInputCtrllr'
	})
	.when('/overall',{
		templateURL:'./views/overall.html',
		controller:'OverallDataCtrllr'
	})
	.when('/detailed',{
		templateURL:'./views/detailed.html',
		controller:'DetailedDataCtrllr'
	})
	.otherwise({
		redirect:'/input'
	});

}]);

