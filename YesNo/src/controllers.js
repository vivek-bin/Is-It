angular.module('MyApp')
.controller('SendInputCtrllr',function($scope,$http,$location,InputService){
	console.log('in send ip ctrllr')
	
	$http.get('/checkresponse')
	.then(function(res){
		console.log(res.data.acceptInput)
		InputService.acceptInput=res.data.acceptInput;
		InputService.acceptInputChecked=true;
		if(InputService.acceptInput){
			$location.path('/overall')
		}
	}
	,function(error){
		console.log('AJAX failed while checking');
	})
	
	$scope.sendInput=function(userResponse){
		console.log('sending response ' + InputService.acceptInput + InputService.acceptInputChecked);
		if((! InputService.acceptInput) && (InputService.acceptInputChecked)){
			console.log('sending response ');
			$http.post('/sendinput',{
					'userResponse' : userResponse 
					})
			.then(function(res){
				InputService.acceptInput=true;
				$location.path('/overall')
			}
			,function(error){
				console.log('AJAX failed while sending');
			})
		}
	}
})

.controller('OverallDataCtrllr',function($scope,$http,OverallDataService){
	console.log('in overall data ctrllr');
	if(! OverallDataService.overallData.present){
		$http.get('/overallscr')
		.then(function(res){
			OverallDataService.overallData=res.data.overallData;
		}
		,function(error){
			console.log('AJAX failed getting overall data');
		})
	}
})

.controller('DetailedDataCtrllr',function($scope,$http,DetailedDataService){
	console.log('in detail data ctrllr');
	
	if(! DetailedDataService.categoryGet($scope.detailedData.dataOf).detailedData.present){
		$http.get('/detailedscr',{dataOf : $scope.detailedData.dataOf})
		.then(function(res){
			if($scope.detailedData.dataOf=='world'){
				DetailedDataService.worldData.present=true;
				DetailedDataService.worldData.detailedData=res.data.detailedData;
			}
			if($scope.detailedData.dataOf=='country'){
				DetailedDataService.countryData.present=true;
				DetailedDataService.countryData.detailedData=res.data.detailedData;
			}
			if($scope.detailedData.dataOf=='user'){
				DetailedDataService.userData.present=true;
				DetailedDataService.userData.detailedData=res.data.detailedData;
			}
		}
		,function(error){
			console.log('AJAX failed getting detailed data')
		})
	}
})

.controller('GraphingCtrllr', function ($scope,OverallDataService) {
	console.log('in graph ctrllr')
	
	$scope.worldDataSource = {
		chart: {
				caption: "World",
			},
			data:[{
				label: "Nothin'",
				value: 0.00001
			}]
	}
	$scope.countryDataSource = {
		chart: {
				caption: "Country",
			},
			data:[{
				label: "Nothin'",
				value: 0.00001
			}]
	}
	$scope.userDataSource = {
		chart: {
				caption: "User",
			},
			data:[{
				label: "Nothin'",
				value: 0.00001
			}]
	}
	
	$scope.populateData=function(){
		$scope.worldDataSource.data=[];
		for(var responseObj of OverallDataService.overallData.worldData){
			$scope.worldDataSource.data.push({
				label: (responseObj.Response?"YES":"NO"),
				value: responseObj.NumResponse
			})
		}
		$scope.countryDataSource.data=[];
		for(var responseObj of OverallDataService.overallData.countryData){
			$scope.countryDataSource.data.push({
				label: (responseObj.Response?"YES":"NO"),
				value: responseObj.NumResponse
			})
		}
		$scope.userDataSource.data=[];
		for(var responseObj of OverallDataService.overallData.userData){
			$scope.userDataSource.data.push({
				label: (responseObj.Response?"YES":"NO"),
				value: responseObj.NumResponse
			})
		}
	}
});

