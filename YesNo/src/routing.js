angular.module('MyApp',[ngRoute,ngAnimate]);
app.config(["$routeProvider",function($routeProvider){
	$routeProvider
	.when("/input",{
		templateURL:"views/input.html"
		controller:"SendInputCtrllr"
	})
	.when("/overall",{
		templateURL:"views/overall.html"
		controller:"OverallDataCtrllr"
	})
	.when("/detailed",{
		templateURL:"views/detailed.html"
		controller:"DetailedDataCtrllr"
	})
	.otherwise({
		redirect:"/overall"
	});

}]);

