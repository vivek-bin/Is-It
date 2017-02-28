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

.service('OverallDataService',function(){
	this.overallData={
		present: false,
		country: "",
		worldData: {
			angle: 0,
			yes: 0,
			no: 0
		},
		countryData: {
			angle: 0,
			yes: 0,
			no: 0
		},
		userData: {
			angle: 0,
			yes: 0,
			no: 0
		}
	}
})

.service('DetailedDataService',function(){
	this.detailedData={
		dataOf: '',
		monthlyDataSource: {
			labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			series: ['NO', 'YES'],
			dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0]
			]
		},
		weeklyDataSource: {
			labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
			series: ['NO', 'YES'],
			dataset: [
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0]
			]
		},
		hourlyDataSource: {
			labels: ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
			series: ['NO', 'YES'],
			dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			]
		},
		country: '',
		worldData: {
			present: false,
			monthlyData: {
				dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0]
			]},
			weeklyData: {
				dataset: [
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0]
			]},
			hourlyData: {
				dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			]}
		},
		countryData: {
			present: false,
			monthlyData: {
				dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0]
			]},
			weeklyData: {
				dataset: [
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0]
			]},
			hourlyData: {
				dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			]}
		},
		userData: {
			present: false,
			monthlyData: {
				dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0]
			]},
			weeklyData: {
				dataset: [
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0]
			]},
			hourlyData: {
				dataset: [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			]}
		}
	
	}
	
	console.log(this.detailedData)
	this.prepareData=function(dataOf){
		if(dataOf=='world'){
			this.detailedData.dataOf="world"
			this.detailedData.monthlyDataSource.dataset=this.detailedData.worldData.monthlyData.dataset
			this.detailedData.weeklyDataSource.dataset=this.detailedData.worldData.weeklyData.dataset
			this.detailedData.hourlyDataSource.dataset=this.detailedData.worldData.hourlyData.dataset		
		}
		if(dataOf=='country'){
			this.detailedData.dataOf="flags/"+this.detailedData.country
			this.detailedData.monthlyDataSource.dataset=this.detailedData.countryData.monthlyData.dataset
			this.detailedData.weeklyDataSource.dataset=this.detailedData.countryData.weeklyData.dataset
			this.detailedData.hourlyDataSource.dataset=this.detailedData.countryData.hourlyData.dataset
		}
		if(dataOf=='user'){
			this.detailedData.dataOf="user"
			this.detailedData.monthlyDataSource.dataset=this.detailedData.userData.monthlyData.dataset
			this.detailedData.weeklyDataSource.dataset=this.detailedData.userData.weeklyData.dataset
			this.detailedData.hourlyDataSource.dataset=this.detailedData.userData.hourlyData.dataset
		}
	}
});
