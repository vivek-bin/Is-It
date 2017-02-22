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
	console.log('in overall data ctrllr')
	$scope.overallData=OverallDataService.overallData
	if(! OverallDataService.overallData.present){
		$http.get('/overallscr')
		.then(function(res){
			OverallDataService.overallData.present=true
			OverallDataService.overallData.worldDataSource.data=[]
			for(var responseObj of res.data.overallData.worldData){
				OverallDataService.overallData.worldDataSource.data.push({
					label: (responseObj.Response?"Yes":"No"),
					value: responseObj.NumResponse
				})
			}
			OverallDataService.overallData.countryDataSource.data=[]
			for(var responseObj of res.data.overallData.countryData){
				OverallDataService.overallData.countryDataSource.data.push({
					label: (responseObj.Response?"Yes":"No"),
					value: responseObj.NumResponse
				})
			}
			OverallDataService.overallData.userDataSource.data=[]
			for(var responseObj of res.data.overallData.userData){
				OverallDataService.overallData.userDataSource.data.push({
					label: (responseObj.Response?"Yes":"No"),
					value: responseObj.NumResponse
				})
			}
			$scope.overallData=OverallDataService.overallData
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
				DetailedDataService.detailedData.worldData=res.data.detailedData;
			}
			if($scope.detailedData.dataOf=='country'){
				DetailedDataService.countryData.present=true;
				DetailedDataService.detailedData.countryData=res.data.detailedData;
			}
			if($scope.detailedData.dataOf=='user'){
				DetailedDataService.userData.present=true;
				DetailedDataService.detailedData.userData=res.data.detailedData;
			}
		}
		,function(error){
			console.log('AJAX failed getting detailed data')
		})
	}
})
