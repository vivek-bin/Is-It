angular.module('MyApp')
.service('InputService',function($http,$location){
	var InputService=this
	InputService.acceptedInput=false;
	InputService.acceptedInputChecked=false;
	InputService.refreshOverall=false;
	InputService.refreshDetailed=false;
	
	InputService.routeToOverall=function(){
		if(InputService.acceptedInputChecked===true && InputService.acceptedInput===true){
			$location.path('/overall')
		}
	}
	
	InputService.backAllowed=function(){
		return !(InputService.acceptedInputChecked && InputService.acceptedInput);
	}
	
	InputService.checkResponded = function(){
		if(! InputService.acceptedInputChecked){
			$http.get('/checkresponse')
			.then(function(res){
				InputService.acceptedInput=res.data.acceptInput;
				InputService.acceptedInputChecked=true;
				InputService.routeToOverall();
			}
			,function(error){
				console.log('AJAX failed while checking');
			});
		}
	}
	
	InputService.sendInput=function(userResponse){
		console.log('sending ip')
		if(! (InputService.acceptedInputChecked && InputService.acceptedInput)){
			console.log('sending response ');
			$http.post('/sendinput',{'userResponse' : userResponse})
			.then(function(res){
				InputService.acceptedInput=true;
				InputService.refreshOverall=true;
				InputService.refreshDetailed=true;
				InputService.routeToOverall();
			}
			,function(error){
				console.log('AJAX failed while sending');
			})
		}
	}
})

.service('OverallDataService',function($http){
	var OverallDataService=this;
	OverallDataService.overallDataPromise=null;
	
	OverallDataService.getRotation=function(yeses,noes){
		if((noes + yeses) > 0){
			return 'rotate(' + ((180*yeses)/(noes+yeses)) + 'deg)'
		}
		else{
			return 'rotate(90deg)'
		}
	}
	
	OverallDataService.refreshData = function(){
		OverallDataService.overallDataPromise=null
	}
	
	OverallDataService.getOverallData = function(){
		if(OverallDataService.overallDataPromise===null){
			OverallDataService.overallDataPromise=$http.get('/overallscr').then(function(res){
				var overallData={
					country: '',
					worldData: {
						yes: 0,
						no: 0,
						angle: ''
					},
					countryData: {
						yes: 0,
						no: 0,
						angle: ''
					},
					userData: {
						yes: 0,
						no: 0,
						angle: ''
					}
				}
				
				overallData.country='/img/flags/' + res.data.overallData.country + '.jpg';
				for(var i=0;i<res.data.overallData.worldData.length;++i){
					if(res.data.overallData.worldData[i].Response){
						overallData.worldData.yes=res.data.overallData.worldData[i].NumResponse
					}
					else{
						overallData.worldData.no=res.data.overallData.worldData[i].NumResponse
					}
				}
				overallData.worldData.rotation=OverallDataService.getRotation(overallData.worldData.yes,overallData.worldData.no)

				for(var i=0;i<res.data.overallData.countryData.length;++i){
					if(res.data.overallData.countryData[i].Response){
						overallData.countryData.yes=res.data.overallData.countryData[i].NumResponse
					}
					else{
						overallData.countryData.no=res.data.overallData.countryData[i].NumResponse
					}
				}
				overallData.countryData.rotation=OverallDataService.getRotation(overallData.countryData.yes,overallData.countryData.no)
				
				for(var i=0;i<res.data.overallData.userData.length ;++i){
					if(res.data.overallData.userData[i].Response){
						overallData.userData.yes=res.data.overallData.userData[i].NumResponse
					}
					else{
						overallData.userData.no=res.data.overallData.userData[i].NumResponse
					}
				}
				overallData.userData.rotation=OverallDataService.getRotation(overallData.userData.yes,overallData.userData.no)
				
				return overallData;
			},
			function(error){
				return error
			});
		}
		return OverallDataService.overallDataPromise;
	}
})

.service('DetailedDataService',function($http){
	var DetailedDataService=this
	DetailedDataService.userDetailedPromise=null
	DetailedDataService.countryDetailedPromise=null
	DetailedDataService.worldDetailedPromise=null
	
	DetailedDataService.refreshData=function(){
		DetailedDataService.userDetailedPromise=null
		DetailedDataService.countryDetailedPromise=null
		DetailedDataService.worldDetailedPromise=null
	}
	
	DetailedDataService.getCountryData=function(){
		if(DetailedDataService.countryDetailedPromise===null){
			DetailedDataService.countryDetailedPromise=$http.get('/detailedscr',{params:{'dataOf' : 'country'}})
			.then(function(res){
				var monthly = res.data.detailedData.monthlyData
				var weekly = res.data.detailedData.weeklyData
				var hourly = res.data.detailedData.hourlyData
				
				var detailedData={
					dataOf: 'flags/' + res.data.detailedData.dataOf,
					monthlyData: [ [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0] ],
					weeklyData: [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ],
					hourlyData: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ]
				}
				
				for(var i=0; i<monthly.length;++i){
					detailedData.monthlyData[monthly[i].Response][monthly[i].Month-1]=monthly[i].NumResponse
				}
				for(var i=0; i<weekly.length;++i){
					detailedData.weeklyData[weekly[i].Response][weekly[i].WeekDay]=weekly[i].NumResponse
				}
				for(var i=0; i<hourly.length;++i){
					detailedData.hourlyData[hourly[i].Response][hourly[i].Hour]=hourly[i].NumResponse
				}
				
				return detailedData;
			}
			,function(error){
				return error
			})
		}
		return DetailedDataService.countryDetailedPromise
	}
	
	DetailedDataService.getUserData=function(){
		if(DetailedDataService.userDetailedPromise===null){
			DetailedDataService.userDetailedPromise=$http.get('/detailedscr',{params:{'dataOf' : 'user'}})
			.then(function(res){
				var monthly = res.data.detailedData.monthlyData
				var weekly = res.data.detailedData.weeklyData
				var hourly = res.data.detailedData.hourlyData
				var detailedData={
					dataOf: 'user',
					monthlyData: [ [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0] ],
					weeklyData: [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ],
					hourlyData: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ]
				}
				
				for(var i=0; i<monthly.length;++i){
					detailedData.monthlyData[monthly[i].Response][monthly[i].Month-1]=monthly[i].NumResponse
				}
				for(var i=0; i<weekly.length;++i){
					detailedData.weeklyData[weekly[i].Response][weekly[i].WeekDay]=weekly[i].NumResponse
				}
				for(var i=0; i<hourly.length;++i){
					detailedData.hourlyData[hourly[i].Response][hourly[i].Hour]=hourly[i].NumResponse
				}
				
				return detailedData;
			}
			,function(error){
				return error
			})
		}
		return DetailedDataService.userDetailedPromise
	}
	
	DetailedDataService.getWorldData=function(){
		if(DetailedDataService.worldDetailedPromise===null){
			DetailedDataService.worldDetailedPromise=$http.get('/detailedscr',{params : {'dataOf' : 'world'}})
			.then(function(res){
				var monthly = res.data.detailedData.monthlyData
				var weekly = res.data.detailedData.weeklyData
				var hourly = res.data.detailedData.hourlyData
				var detailedData={
					dataOf: 'world',
					monthlyData: [ [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0] ],
					weeklyData: [ [0,0,0,0,0,0,0], [0,0,0,0,0,0,0] ],
					hourlyData: [ [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ]
				}
				
				for(var i=0; i<monthly.length;++i){
					detailedData.monthlyData[monthly[i].Response][monthly[i].Month-1]=monthly[i].NumResponse
				}
				for(var i=0; i<weekly.length;++i){
					detailedData.weeklyData[weekly[i].Response][weekly[i].WeekDay]=weekly[i].NumResponse
				}
				for(var i=0; i<hourly.length;++i){
					detailedData.hourlyData[hourly[i].Response][hourly[i].Hour]=hourly[i].NumResponse
				}
				
				return detailedData;
			}
			,function(error){
				return error
			})
		}
		return DetailedDataService.worldDetailedPromise
	}
	
});
