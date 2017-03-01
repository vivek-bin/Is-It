angular.module('MyApp')
.controller('MainCtrllr',function($scope,InputService){
	$scope.largeHeading=false
	InputService.checkResponded()
})

.controller('SendInputCtrllr',function($scope,InputService){
	console.log('in send ip ctrllr')
	$scope.$parent.largeHeading=true
	
	InputService.routeToOverall();
	
	$scope.sendInput=function(userResponse){
		InputService.sendInput(userResponse)
	}
})

.controller('OverallDataCtrllr',function($scope,InputService,OverallDataService){
	console.log('in overall data ctrllr')
	
	$scope.backAllowed=InputService.backAllowed()
	
	if(InputService.refreshOverall===true){
		InputService.refreshOverall=false
		OverallDataService.refreshData()
	}
	$scope.$parent.largeHeading=false

	$scope.overallData={};
	
	OverallDataService.getOverallData()
	.then(function(data){
		$scope.overallData=data
	}
	,function(error){
		console.log('AJAX failed getting overall data');
	})

})

.controller('DetailedDataCtrllr',function($scope,$routeParams,InputService,DetailedDataService){
	console.log('in detail data ctrllr')
	
	$scope.$parent.largeHeading=false
	
	$scope.series=['NO', 'YES']
	$scope.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	$scope.weekdays=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
	$scope.hours=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
	
	var dataOf=$routeParams.dataOf.substr(1)
	
	if(InputService.refreshDetailed===true){
		InputService.refreshDetailed=false
		DetailedDataService.detailedData.worldData.present=false
		DetailedDataService.detailedData.countryData.present=false
		DetailedDataService.detailedData.userData.present=false
	}
	
	if(dataOf=='country'){
		DetailedDataService.getCountryData()
		.then(function(data){
			$scope.detailedData=data;
		},
		function(error){
			console.log('error while setting country data to scope')
		});
	}
	else if(dataOf=='user'){
		DetailedDataService.getUserData()
		.then(function(data){
			$scope.detailedData=data;
		},
		function(error){
			console.log('error while setting user data to scope')
		});
	}
	else{
		DetailedDataService.getWorldData()
		.then(function(data){
			$scope.detailedData=data;
		},
		function(error){
			console.log('error while setting world data to scope')
		});
	}
})

