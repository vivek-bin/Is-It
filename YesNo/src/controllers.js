angular.module('MyApp')
.controller('SendInputCtrllr',function($scope,$http,InputService){
	console.log('in send ip ctrllr')
	
	$http.get('/checkresponse')
	.then(function(res){
		console.log(res.data.acceptInput)
		InputService.acceptInput=res.data.acceptInput;
		InputService.acceptInputChecked=true;
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
			.then(function(data){
				InputService.acceptInput=true;
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
		.then(function(data){
			OverallDataService.overallData=data.overallData;
		}
		,function(error){
			console.log('AJAX failed getting overall data');
		})
	}
	$scope.overallData=OverallDataService.overallData;
})

.controller('DetailedDataCtrllr',function($scope,$http,DetailedDataService){
	console.log('in detail data ctrllr');
	
	if(! DetailedDataService.categoryGet($scope.detailedData.dataOf).detailedData.present){
		$http.get('/detailedscr',{dataOf : $scope.detailedData.dataOf})
		.then(function(data){
			if($scope.detailedData.dataOf=='world'){
				DetailedDataService.worldData.present=true;
				DetailedDataService.worldData.detailedData=data.detailedData;
			}
			if($scope.detailedData.dataOf=='country'){
				DetailedDataService.countryData.present=true;
				DetailedDataService.countryData.detailedData=data.detailedData;
			}
			if($scope.detailedData.dataOf=='user'){
				DetailedDataService.userData.present=true;
				DetailedDataService.userData.detailedData=data.detailedData;
			}
		}
		,function(error){
			console.log('AJAX failed getting detailed data')
		})
	}
	$scope.detailedData=DetailedDataService.categoryGet($scope.detailedData.dataOf)
})

.controller('GraphingCtrllr', function ($scope) {
	console.log('in graph ctrllr')
	$scope.myDataSource = {
		chart: {
				caption: "Harry's SuperMart",
				subCaption: "Top 5 stores in last month by revenue",
			},
			data:[{
				label: "Bakersfield Central",
				value: "880000"
			},
			{
				label: "Garden Groove harbour",
				value: "730000"
			},
			{
				label: "Daly City Serramonte",
				value: "330000"
		}]
	}
});

