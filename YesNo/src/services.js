angular.module('MyApp')
.service('InputService',function(){
	this.acceptInput=false;
	this.acceptInputChecked=false;
})

.service('OverallDataService',function(){
	this.overallData={
		present: false,
		worldDataSource: {
			chart: {
				defaultCenterLabel: "WORLD",
				centerLabel: "$value",
				centerLabelFontSize: 18,
				centerLabelColor: "#999999",
				centerlabelhovercolor: "#999999",
				bgColor: "#0000",
				bgAlpha: "80",
				pieRadius: 140,
				valueFontSize: 15,
				placeValuesInside: 1,
				anchorAlpha: "10",
				showlabels: 1,
				showValues: 0,
				palettecolors: "#111111,#f9bd19",
				enableSmartLabels : 0,
				labelDistance : "1",
				
			},
			data: [{
				label: "Nothin'",
				value: 0.00001
			}]
		},
		countryDataSource: {
			chart: {
				defaultCenterLabel: "COUNTRY",
				centerLabel: "$value",
				centerLabelFontSize: 18,
				centerLabelColor: "#999999",
				centerlabelhovercolor: "#999999",
				bgColor: "#0000",
				bgAlpha: "80",
				pieRadius: 140,
				valueFontSize: 15,
			},
			data: [{
				label: "Nothin'",
				value: 0.00001
			}]
		},
		userDataSource: {
			chart: {
				defaultCenterLabel: "User",
				centerLabel: "User",
				centerLabelFontSize: 20,
				centerLabelColor: "#999999",
				centerlabelhovercolor: "#999999",
				pieRadius: 200,
				valueFontSize: 18,
				bgColor: "#111"
			},
			data: [{
				label: "Nothin'",
				value: 0.00001
			}]
		}
	}
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
