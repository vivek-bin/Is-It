angular.module('MyApp')
.controller('MainCtrllr',function($scope,$http,$location,InputService){
	$scope.largeHeading=false
	
	$http.get('/checkresponse')
	.then(function(res){
		InputService.acceptedInput=res.data.acceptInput;
		InputService.acceptedInputChecked=true;
		if(res.data.acceptInput){
			$location.path('/overall')
		}
		console.log("input service init")
	}
	,function(error){
		console.log('AJAX failed while checking');
	})
})

.controller('SendInputCtrllr',function($scope,$location,InputService){
	console.log('in send ip ctrllr')
	$scope.$parent.largeHeading=true
	
	if(InputService.acceptedInputChecked && InputService.acceptedInput){
		$location.path('/overall')
	}
	
	$scope.sendInput=function(userResponse){
		if(!(InputService.acceptedInputChecked && InputService.acceptedInput)){
			console.log('sending response ');
			$http.post('/sendinput',{'userResponse' : userResponse})
			.then(function(res){
				InputService.acceptedInput=true;
				$location.path('/overall')
			}
			,function(error){
				console.log('AJAX failed while sending');
			})
		}
	}
})

.controller('OverallDataCtrllr',function($scope,$http,OverallDataService,InputService){
	console.log('in overall data ctrllr')
	
	$scope.backAllowed=!(InputService.acceptedInputChecked && InputService.acceptedInput)
	console.log("back allwd "+InputService.acceptedInputChecked+InputService.acceptedInput)
	$scope.$parent.largeHeading=false
	$scope.overallData=OverallDataService.overallData
	if(! OverallDataService.overallData.present){
		$http.get('/overallscr')
		.then(function(res){
			OverallDataService.overallData.present=true
			if(res.data.overallData.worldData.length > 0)
				OverallDataService.overallData.worldDataSource.data=[]
			for(var responseObj of res.data.overallData.worldData){
				OverallDataService.overallData.worldDataSource.data.push({
					label: (responseObj.Response?"Yes":"No"),
					value: responseObj.NumResponse
				})
			}
			if(res.data.overallData.countryData.length > 0)
				OverallDataService.overallData.countryDataSource.data=[]
			for(var responseObj of res.data.overallData.countryData){
				OverallDataService.overallData.countryDataSource.data.push({
					label: (responseObj.Response?"Yes":"No"),
					value: responseObj.NumResponse
				})
			}
			if(res.data.overallData.userData.length > 0)
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

.controller('DetailedDataCtrllr',function($scope,$http,$routeParams,DetailedDataService){
	console.log('in detail data ctrllr')
	
	$scope.$parent.largeHeading=false
	var present
	var dataOf=$routeParams.dataOf.substr(1)
	var setValues=function(){
		DetailedDataService.prepareData(dataOf)
		$scope.monthlyDataSource=DetailedDataService.detailedData.monthlyDataSource
		$scope.weeklyDataSource=DetailedDataService.detailedData.weeklyDataSource
		$scope.hourlyDataSource=DetailedDataService.detailedData.hourlyDataSource
	}
	setValues()
	if(dataOf=='world'){
		present=DetailedDataService.detailedData.worldData.present;
	}
	if(dataOf=='country'){
		present=DetailedDataService.detailedData.countryData.present;
	}
	if(dataOf=='user'){
		present=DetailedDataService.detailedData.userData.present;
	}
	console.log(dataOf)
	if(! present){
		console.log(dataOf+' fetching')
		$http.get('/detailedscr',{params:{'dataOf' : dataOf}})
		.then(function(res){
			if(dataOf=='world'){
				DetailedDataService.detailedData.worldData.present=true;
				for(var responseObj of res.data.detailedData.monthlyData){
					DetailedDataService.detailedData.worldData.monthlyData.dataset[responseObj.Response].data[responseObj.Month-1].value=responseObj.NumResponse
				}
				for(var responseObj of res.data.detailedData.weeklyData){
					DetailedDataService.detailedData.worldData.weeklyData.dataset[responseObj.Response].data[responseObj.WeekDay].value=responseObj.NumResponse
				}
				for(var responseObj of res.data.detailedData.hourlyData){
					DetailedDataService.detailedData.worldData.hourlyData.dataset[responseObj.Response].data[responseObj.Hour].value=responseObj.NumResponse
				}
			}
			if(dataOf=='country'){
				DetailedDataService.detailedData.countryData.present=true;
				for(var responseObj of res.data.detailedData.monthlyData){
					DetailedDataService.detailedData.countryData.monthlyData.dataset[responseObj.Response].data[responseObj.Month-1].value=responseObj.NumResponse
				}
				for(var responseObj of res.data.detailedData.weeklyData){
					DetailedDataService.detailedData.countryData.weeklyData.dataset[responseObj.Response].data[responseObj.WeekDay].value=responseObj.NumResponse
				}
				for(var responseObj of res.data.detailedData.hourlyData){
					DetailedDataService.detailedData.countryData.hourlyData.dataset[responseObj.Response].data[responseObj.Hour].value=responseObj.NumResponse
				}
			}
			if(dataOf=='user'){
				DetailedDataService.detailedData.userData.present=true;
				for(var responseObj of res.data.detailedData.monthlyData){
					DetailedDataService.detailedData.userData.monthlyData.dataset[responseObj.Response].data[responseObj.Month-1].value=responseObj.NumResponse
				}
				for(var responseObj of res.data.detailedData.weeklyData){
					DetailedDataService.detailedData.userData.weeklyData.dataset[responseObj.Response].data[responseObj.WeekDay].value=responseObj.NumResponse
				}
				for(var responseObj of res.data.detailedData.hourlyData){
					DetailedDataService.detailedData.userData.hourlyData.dataset[responseObj.Response].data[responseObj.Hour].value=responseObj.NumResponse
				}
			}
			setValues()
		}
		,function(error){
			console.log('AJAX failed getting detailed data')
		})
	}
})
