angular.module('MyApp')
.controller('MainCtrllr',function($scope,$http,$location){
	$scope.acceptInput=false;
	$scope.acceptInputChecked=false;
	$scope.overallDataFetched=false;
	$scope.detailedDataFetched={};
	$scope.detailedDataFetched['country']=false;
	$scope.detailedDataFetched['world']=false;
	$scope.detailedDataFetched['user']=false;

	$http.get('/initApp')
	.success(function(data) {
		$scope.acceptInputChecked=true;
		$scope.acceptInput=data.acceptInput;
	})
	.error(function(data){
		console.log('AJAX failed while checking');
	});

	if($scope.acceptInput==true){
		$location.path='/overall';
	}
	else{
		$location.path='/home';
	}
})

.controller('SendInputCtrllr',function($scope,$http,$location){
	if($scope.acceptInput==true){
		$location.path='/overall';
	}
	var sendInput=function(userResponse){	
		if($scope.acceptInput==false){
			$http.post('/sendinput',{ 
					input: userResponse 
					})
			.success(function(data){
				$scope.acceptInput=true;
	
				$scope.overallDataFetched=false;
				$scope.detailedDataFetched['country']=false;
				$scope.detailedDataFetched['world']=false;
				$scope.detailedDataFetched['user']=false;
			})
			.error(function(data){
				console.log('AJAX failed while sending');
			});
		}
		if($scope.acceptInput==true){
			$location.path='/overall';
		}
		else{
			console.log('Response already recorded for today');
		}
	}
})

.controller('OverallDataCtrllr',function($scope,$http){
	$scope.overallData.worldData.present=false;
	$scope.overallData.countryData.present=false;
	$scope.overallData.userData.present=false;

	if($scope.overallDataFetched==false){
		$http.get('/overallscr')
		.success(function(data){
			$scope.overallData.worldData.present=true;
			$scope.overallData.worldData.yeses=data.overallData.worldData[true];
			$scope.overallData.worldData.noes=data.overallData.worldData[false];

			if(data.overallData.countryData.present==true){
				$scope.overallData.countryData.present=true;
				$scope.overallData.countryData.yeses=data.overallData.countryData[true];
				$scope.overallData.countryData.noes=data.overallData.countryData[false];
			}

			if(data.overallData.userData.present==true){
				$scope.overallData.userData.present=true;
				$scope.overallData.userData.yeses=data.overallData.userData[true];
				$scope.overallData.userData.noes=data.overallData.userData[false];
			}
			$scope.overallDataFetched=true;
		})
		.error(function(data){
			console.log('AJAX failed getting overall data');
		});
	}
	
})

.controller('DetailedDataCtrller',function($scope,$http){
	if($scope.detailedDataFetched[$scope.detailedData.dataOf]==false){
		$http.get('/detailedscr',{dataOf : $scope.detailedData.dataOf})
		.success(function(data){
			$scope.detailedDataFetched[$scope.detailedData.dataOf]=true;
			$scope.detailedData.monthly.yeses=data.detailedData.monthly[true];
			$scope.detailedData.monthly.noes=data.detailedData.monthly[false];

			$scope.detailedData.weekly.yeses=data.detailedData.weekly[true];
			$scope.detailedData.weekly.noes=data.detailedData.weekly[false];

			$scope.detailedData.hourly.yeses=data.detailedData.hourly[true];
			$scope.detailedData.hourly.noes=data.detailedData.hourly[false];
		})
		.error(function(data){
			console.log('AJAX failed getting detailed data');
		});
	}
});

