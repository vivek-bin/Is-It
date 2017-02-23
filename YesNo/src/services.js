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
				showlabels: 1,
				showValues: 0,
				palettecolors: "#111111,#f9bd19",
				enableSmartLabels : 0,
				
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
				showlabels: 1,
				showValues: 0,
				palettecolors: "#111111,#f9bd19",
				enableSmartLabels : 0,
			},
			data: [{
				label: "Nothin'",
				value: 0.00001
			}]
		},
		userDataSource: {
			chart: {
				defaultCenterLabel: "User",
				centerLabel: "$value",
				centerLabelFontSize: 20,
				centerLabelColor: "#999999",
				centerlabelhovercolor: "#999999",
				bgColor: "#0000",
				bgAlpha: "80",
				pieRadius: 180,
				valueFontSize: 18,
				showlabels: 1,
				showValues: 0,
				palettecolors: "#111111,#f9bd19",
				enableSmartLabels : 0,
			},
			data: [{
				label: "Nothin'",
				value: 0.00001
			}]
		}
	}
})

.service('DetailedDataService',function(){
	this.detailedData={
		monthlyDataSource: {
			chart: {
				xAxisName: "MONTH",
				paletteColors: "#0075c2,#1aaf5d"
			},
			categories: [{
				category: [{
					label: "Jan"
				},{
					label: "Feb"
				},{
					label: "Mar"
				},{
					label: "Apr"
				},{
					label: "May"
				},{
					label: "Jun"
				},{
					label: "Jul"
				},{
					label: "Aug"
				},{
					label: "Sep"
				},{
					label: "Oct"
				},{
					label: "Nov"
				},{
					label: "Dec"
				}]
			}],
			dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
		]},
		weeklyDataSource: {
			chart: {
				xAxisName: "WEEK",
				paletteColors: "#0075c2,#1aaf5d"
			},
			categories: [{
				category: [{
					label: "Mon"
				},{
					label: "Tue"
				},{
					label: "Wed"
				},{
					label: "Thur"
				},{
					label: "Fri"
				},{
					label: "Sat"
				},{
					label: "Sun"
				}]
			}],
			dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
		]},
		hourlyDataSource: {
			chart: {        
				xAxisName: "Hour",
				paletteColors: "#0075c2,#1aaf5d"
			},
			categories: [{
				category: [{
					label: "00"
				},{
					label: "01"
				},{
					label: "02"
				},{
					label: "03"
				},{
					label: "04"
				},{
					label: "05"
				},{
					label: "06"
				},{
					label: "07"
				},{
					label: "08"
				},{
					label: "09"
				},{
					label: "10"
				},{
					label: "11"
				},{
					label: "12"
				},{
					label: "13"
				},{
					label: "14"
				},{
					label: "15"
				},{
					label: "16"
				},{
					label: "17"
				},{
					label: "18"
				},{
					label: "19"
				},{
					label: "20"
				},{
					label: "21"
				},{
					label: "22"
				},{
					label: "23"
				}]
			}],
			dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
		]},
		
		worldData: {
			present: false,
			monthlyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]},
			weeklyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]},
			hourlyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]}
		},
		countryData: {
			present: false,
			monthlyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]},
			weeklyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]},
			hourlyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]}
		},
		userData: {
			present: false,
			monthlyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]},
			weeklyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]},
			hourlyData: {
				dataset: [{
				seriesname: "No",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			},{
				seriesname: "Yes",
				data: [{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				},{
					value: "0"
				}]
			}
			]}
		}
	
	}
	
	console.log(this.detailedData)
	this.prepareData=function(dataOf){
		if(dataOf=='world'){
			this.detailedData.monthlyDataSource.dataset=this.detailedData.worldData.monthlyData.dataset
			this.detailedData.weeklyDataSource.dataset=this.detailedData.worldData.weeklyData.dataset
			this.detailedData.hourlyDataSource.dataset=this.detailedData.worldData.hourlyData.dataset		
		}
		if(dataOf=='country'){
			this.detailedData.monthlyDataSource.dataset=this.detailedData.countryData.monthlyData.dataset
			this.detailedData.weeklyDataSource.dataset=this.detailedData.countryData.weeklyData.dataset
			this.detailedData.hourlyDataSource.dataset=this.detailedData.countryData.hourlyData.dataset
		}
		if(dataOf=='user'){
			this.detailedData.monthlyDataSource.dataset=this.detailedData.userData.monthlyData.dataset
			this.detailedData.weeklyDataSource.dataset=this.detailedData.userData.weeklyData.dataset
			this.detailedData.hourlyDataSource.dataset=this.detailedData.userData.hourlyData.dataset
		}
	}
});
