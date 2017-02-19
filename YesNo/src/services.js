angular.module('MyApp')
.service('InputService',function(){
	this.acceptInput=false;
	this.acceptInputChecked=false;
})

.service('OverallDataService',function(){
	this.overallData={};
})

.service('DetailedDataService',function(){
	this.worldData={
		present: false,
		detailedData: {}
	}
	this.countryData={
		present: false,
		detailedData: {}
	}
	this.userData={
		present: false,
		detailedData: {}
	}
	this.categoryGet=function(dataOf){
		if(dataOf=='world'){
			return this.worldData;
		}
		if(dataOf=='country'){
			return this.countryData;
		}
		if(dataOf=='user'){
			return this.userData;
		}
	}
});
