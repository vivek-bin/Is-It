app.controller('MainCtrllr',function($scope,$location){
	$scope.acceptInput=false;
	$scope.acceptInputChecked=false;
	$scope.overallDataFetched=false;
	$scope.detailedDataFetched['country']=false;
	$scope.detailedDataFetched['world']=false;
	$scope.detailedDataFetched['user']=false;

	$scope.input=false;

	$http.get("/inputscr")
	.success(function(data,status,headers,config) {
		$scope.acceptInputChecked=true;
		$scope.acceptInput=data.acceptInput;
	})
	.error(function(data,status,headers,config){
		console.log("AJAX failed while checking");
	});

	if($scope.acceptInput==true){
		$location.path='/overall';
	}
	else{
		$location.path='/home';
	}
});

app.controller("SendInputCtrllr",function($scope,$http,$location){
	if($scope.acceptInput==false){
		$http.post("/sendinput",{ 
				input: $scope.input 
				})
		.success(function(data,status,headers,config){
			$scope.acceptInput=true;

			$scope.overallDataFetched=false;
			$scope.detailedDataFetched['country']=false;
			$scope.detailedDataFetched['world']=false;
			$scope.detailedDataFetched['user']=false;
		})
		.error(function(data,status,headers,config){
			console.log("AJAX failed while sending");
		});
	}
	if($scope.acceptInput==true){
		$location.path='/overall';
	}
});

app.controller("OverallDataCtrllr",function($scope,$http){
	$scope.overallData.worldData.present=false;
	$scope.overallData.countryData.present=false;
	$scope.overallData.userData.present=false;

	if($scope.overallDataFetched==false){
		$http.get("/overallscr")
		.success(function(data,status,headers,config){
			$scope.overallData.worldData.present=true;
			$scope.overallData.worldData.total=data.overallData.worldData.total;
			$scope.overallData.worldData.yeses=data.overallData.worldData.yeses;
			$scope.overallData.worldData.noes=data.overallData.worldData.noes;

			if(data.overallData.countryData.present==true){
				$scope.overallData.countryData.present=true;
				$scope.overallData.countryData.total=data.overallData.countryData.total;
				$scope.overallData.countryData.yeses=data.overallData.countryData.yeses;
				$scope.overallData.countryData.noes=data.overallData.countryData.noes;
			}

			if(data.overallData.userData.Present==true){
				$scope.overallData.userData.present=true;
				$scope.overallData.userData.total=data.overallData.userData.total;
				$scope.overallData.userData.yeses=data.overallData.userData.yeses;
				$scope.overallData.userData.noes=data.overallData.userData.noes;
			}
			$scope.overallDataFetched=true;
		})
		.error(function(data,status,headers,config){
			console.log("AJAX failed getting overall data");
		});
	}
	
});

app.controller("DetailedDataCtrler",function($scope,$http){
	if($scope.detailedDataFetched[$scope.detailedData.dataOf]==false){
		$http.get("/detailedscr",{dataOf : $scope.detailedData.dataOf})
		.success(function(data,status,headers,config){
			$scope.detailedDataFetched[$scope.detailedData.dataOf]=true;
			$scope.detailedData.monthly.total=data.detailedData.monthly.total;
			$scope.detailedData.monthly.yeses=data.detailedData.monthly.yeses;
			$scope.detailedData.monthly.noes=data.detailedData.monthly.noes;

			$scope.detailedData.weekly.total=data.detailedData.weekly.total;
			$scope.detailedData.weekly.yeses=data.detailedData.weekly.yeses;
			$scope.detailedData.weekly.noes=data.detailedData.weekly.noes;

			$scope.detailedData.hourly.total=data.detailedData.hourly.total;
			$scope.detailedData.hourly.yeses=data.detailedData.hourly.yeses;
			$scope.detailedData.hourly.noes=data.detailedData.hourly.noes;
		})
		.error(function(data,status,headers,config){
			console.log("AJAX failed getting detailed data");
		});
	}
});
