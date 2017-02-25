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

.controller('SendInputCtrllr',function($scope,$http,$location,InputService){
	console.log('in send ip ctrllr')
	$scope.$parent.largeHeading=true
	
	if(InputService.acceptedInputChecked && InputService.acceptedInput){
		$location.path('/overall')
	}
	
	$scope.sendInput=function(userResponse){
		console.log('sending ip')
		if(! (InputService.acceptedInputChecked && InputService.acceptedInput)){
			console.log('sending response ');
			$http.post('/sendinput',{'userResponse' : userResponse})
			.then(function(res){
				InputService.acceptedInput=true;
				InputService.refreshOverall=true;
				InputService.refreshDetailed=true;
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
	
	if(InputService.refreshOverall===true){
		InputService.refreshOverall=false
		OverallDataService.overallData.present=false
	}
	$scope.$parent.largeHeading=false
	$scope.overallData=OverallDataService.overallData
	if(! OverallDataService.overallData.present){
		$http.get('/overallscr')
		.then(function(res){
			OverallDataService.overallData.present=true
			
			OverallDataService.overallData.worldData.yes=0;
			OverallDataService.overallData.worldData.no=0;
			for(var responseObj of res.data.overallData.worldData){
				if(responseObj.Response){
					OverallDataService.overallData.worldData.yes=responseObj.NumResponse
				}
				else{
					OverallDataService.overallData.worldData.no=responseObj.NumResponse
				}
			}
			OverallDataService.overallData.worldData.angle=90
			if(OverallDataService.overallData.worldData.no+OverallDataService.overallData.worldData.yes > 0){
				OverallDataService.overallData.worldData.angle=180*OverallDataService.overallData.worldData.yes
				OverallDataService.overallData.worldData.angle/=OverallDataService.overallData.worldData.no+OverallDataService.overallData.worldData.yes
			}
			
			OverallDataService.overallData.countryData.yes=0;
			OverallDataService.overallData.countryData.no=0;
			OverallDataService.overallData.countryData.country='/img/flags/'+res.data.overallData.country+'.jpg';
			for(var responseObj of res.data.overallData.countryData){
				if(responseObj.Response){
					OverallDataService.overallData.countryData.yes=responseObj.NumResponse
				}
				else{
					OverallDataService.overallData.countryData.no=responseObj.NumResponse
				}
			}
			OverallDataService.overallData.countryData.angle=90
			if(OverallDataService.overallData.countryData.no+OverallDataService.overallData.countryData.yes > 0){
				OverallDataService.overallData.countryData.angle=180*OverallDataService.overallData.countryData.yes;
				OverallDataService.overallData.countryData.angle/=OverallDataService.overallData.countryData.no+OverallDataService.overallData.countryData.yes;
			}
			OverallDataService.overallData.userData.yes=0;
			OverallDataService.overallData.userData.no=0;
			for(var responseObj of res.data.overallData.userData){
				if(responseObj.Response){
					OverallDataService.overallData.userData.yes=responseObj.NumResponse
				}
				else{
					OverallDataService.overallData.userData.no=responseObj.NumResponse
				}
			}
			OverallDataService.overallData.userData.angle=90
			if(OverallDataService.overallData.userData.no+OverallDataService.overallData.userData.yes > 0){
				OverallDataService.overallData.userData.angle=180*OverallDataService.overallData.userData.yes;
				OverallDataService.overallData.userData.angle/=OverallDataService.overallData.userData.no+OverallDataService.overallData.userData.yes;
			}
			
			$scope.overallData=OverallDataService.overallData
		}
		,function(error){
			console.log('AJAX failed getting overall data');
		})
	}
})

.controller('DetailedDataCtrllr',function($scope,$http,$routeParams,DetailedDataService,InputService){
	console.log('in detail data ctrllr')
	
	$scope.$parent.largeHeading=false
	
	var dataOf=$routeParams.dataOf.substr(1)
	
	if(InputService.refreshDetailed===true){
		InputService.refreshDetailed=false
		DetailedDataService.detailedData.worldData.present=false
		DetailedDataService.detailedData.countryData.present=false
		DetailedDataService.detailedData.userData.present=false
	}
	
	var setValues=function(){
		DetailedDataService.prepareData(dataOf)
		$scope.monthlyDataSource=DetailedDataService.detailedData.monthlyDataSource
		$scope.weeklyDataSource=DetailedDataService.detailedData.weeklyDataSource
		$scope.hourlyDataSource=DetailedDataService.detailedData.hourlyDataSource
	}
	setValues()
	
	var present
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

