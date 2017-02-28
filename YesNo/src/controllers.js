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

.controller('OverallDataCtrllr',function($scope,$http,OverallDataService,InputService){
	console.log('in overall data ctrllr')
	
	$scope.backAllowed=InputService.backAllowed()
	
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
			for(var i=0;i<res.data.overallData.worldData.length;++i){
				if(res.data.overallData.worldData[i].Response){
					OverallDataService.overallData.worldData.yes=res.data.overallData.worldData[i].NumResponse
				}
				else{
					OverallDataService.overallData.worldData.no=res.data.overallData.worldData[i].NumResponse
				}
			}
			OverallDataService.overallData.worldData.rotation=90
			if(OverallDataService.overallData.worldData.no+OverallDataService.overallData.worldData.yes > 0){
				OverallDataService.overallData.worldData.rotation=180*OverallDataService.overallData.worldData.yes
				OverallDataService.overallData.worldData.rotation/=OverallDataService.overallData.worldData.no+OverallDataService.overallData.worldData.yes
			}
			OverallDataService.overallData.worldData.rotation='rotate(' + OverallDataService.overallData.worldData.rotation + 'deg)'
			
			OverallDataService.overallData.countryData.yes=0;
			OverallDataService.overallData.countryData.no=0;
			OverallDataService.overallData.countryData.country='/img/flags/' + res.data.overallData.country+'.jpg';
			for(var i=0;i<res.data.overallData.countryData.length;++i){
				if(res.data.overallData.countryData[i].Response){
					OverallDataService.overallData.countryData.yes=res.data.overallData.countryData[i].NumResponse
				}
				else{
					OverallDataService.overallData.countryData.no=res.data.overallData.countryData[i].NumResponse
				}
			}
			OverallDataService.overallData.countryData.rotation=90
			if(OverallDataService.overallData.countryData.no+OverallDataService.overallData.countryData.yes > 0){
				OverallDataService.overallData.countryData.rotation=180*OverallDataService.overallData.countryData.yes;
				OverallDataService.overallData.countryData.rotation/=OverallDataService.overallData.countryData.no+OverallDataService.overallData.countryData.yes;
			}
			OverallDataService.overallData.countryData.rotation='rotate(' + OverallDataService.overallData.countryData.rotation + 'deg)'
			
			OverallDataService.overallData.userData.yes=0;
			OverallDataService.overallData.userData.no=0;
			for(var i=0;i<res.data.overallData.userData.length ;++i){
				if(res.data.overallData.userData[i].Response){
					OverallDataService.overallData.userData.yes=res.data.overallData.userData[i].NumResponse
				}
				else{
					OverallDataService.overallData.userData.no=res.data.overallData.userData[i].NumResponse
				}
			}
			OverallDataService.overallData.userData.rotation=90
			if(OverallDataService.overallData.userData.no+OverallDataService.overallData.userData.yes > 0){
				OverallDataService.overallData.userData.rotation=180*OverallDataService.overallData.userData.yes;
				OverallDataService.overallData.userData.rotation/=OverallDataService.overallData.userData.no+OverallDataService.overallData.userData.yes;
			}
			OverallDataService.overallData.userData.rotation='rotate(' + OverallDataService.overallData.userData.rotation + 'deg)'
			
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
	if(present){
		DetailedDataService.prepareData(dataOf)
		$scope.dataOf='/img/' + DetailedDataService.detailedData.dataOf + '.jpg'
		$scope.monthlyDataSource=DetailedDataService.detailedData.monthlyDataSource
		$scope.weeklyDataSource=DetailedDataService.detailedData.weeklyDataSource
		$scope.hourlyDataSource=DetailedDataService.detailedData.hourlyDataSource
	}
	else{
		console.log(dataOf+' fetching')
		$http.get('/detailedscr',{params:{'dataOf' : dataOf}})
		.then(function(res){
			var monthly = res.data.detailedData.monthlyData
			var weekly = res.data.detailedData.weeklyData
			var hourly = res.data.detailedData.hourlyData
			if(dataOf=='world'){
				DetailedDataService.detailedData.worldData.present=true;
				for(var i=0; i<monthly.length;++i){
					DetailedDataService.detailedData.worldData.monthlyData.dataset[monthly[i].Response][monthly[i].Month-1]=monthly[i].NumResponse
				}
				for(var i=0; i<weekly.length;++i){
					DetailedDataService.detailedData.worldData.weeklyData.dataset[weekly[i].Response][weekly[i].WeekDay]=weekly[i].NumResponse
				}
				for(var i=0; i<hourly.length;++i){
					DetailedDataService.detailedData.worldData.hourlyData.dataset[hourly[i].Response][hourly[i].Hour]=hourly[i].NumResponse
				}
			}
			if(dataOf=='country'){
				DetailedDataService.detailedData.countryData.present=true;
				DetailedDataService.detailedData.country=res.data.detailedData.country;
				for(var i=0; i<monthly.length;++i){
					DetailedDataService.detailedData.countryData.monthlyData.dataset[monthly[i].Response][monthly[i].Month-1]=monthly[i].NumResponse
				}
				for(var i=0; i<weekly.length;++i){
					DetailedDataService.detailedData.countryData.weeklyData.dataset[weekly[i].Response][weekly[i].WeekDay]=weekly[i].NumResponse
				}
				for(var i=0; i<hourly.length;++i){
					DetailedDataService.detailedData.countryData.hourlyData.dataset[hourly[i].Response][hourly[i].Hour]=hourly[i].NumResponse
				}
			}
			if(dataOf=='user'){
				DetailedDataService.detailedData.userData.present=true;
				for(var i=0; i<monthly.length;++i){
					DetailedDataService.detailedData.userData.monthlyData.dataset[monthly[i].Response][monthly[i].Month-1]=monthly[i].NumResponse
				}
				for(var i=0; i<weekly.length;++i){
					DetailedDataService.detailedData.userData.weeklyData.dataset[weekly[i].Response][weekly[i].WeekDay]=weekly[i].NumResponse
				}
				for(var i=0; i<hourly.length;++i){
					DetailedDataService.detailedData.userData.hourlyData.dataset[hourly[i].Response][hourly[i].Hour]=hourly[i].NumResponse
				}
			}
			
			DetailedDataService.prepareData(dataOf)
			$scope.dataOf='/img/' + DetailedDataService.detailedData.dataOf + '.jpg'
			$scope.monthlyDataSource=DetailedDataService.detailedData.monthlyDataSource
			$scope.weeklyDataSource=DetailedDataService.detailedData.weeklyDataSource
			$scope.hourlyDataSource=DetailedDataService.detailedData.hourlyDataSource
		}
		,function(error){
			console.log('AJAX failed getting detailed data')
		})
	}
})

