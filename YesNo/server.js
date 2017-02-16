var express=require('express');
var cookieParser=require('cookie-parser');
var mysql=require('mysql');

var app=express();
app.use(cookieParser());

var date= new Date();
var curDate= date.toLocaleDateString('en-GB');
var curTime= date.toLocaleTimeString('en-GB');
var userId=0;
var userCountry='';

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'DB1'
})

connection.connect(function(err) {
 	if (err) throw err
 	console.log('You are now connected...')
})

app.use(function(req,res){
	userId=req.cookies.userId;
	userCountry=req.cookies.userCountry;
	if(!req.cookies.userId){
		connection.query('SELECT MAX(User_ID) AS MaxId from userresponses;',function(err,rows,fields){
			if(err){
				console.log('error getting new id for user');
			}
			else{
				userID=100;
				if(rows.length){
					userId=rows[0].MaxId + 3;
				}
			}
		}
		userCountry='IN';//get user country from site
		
		res.cookie('userCountry',userCountry);	
		res.cookie('userId',userId);
	}
});

app.get('/initApp',function(req,res){
//check if user has responded for today
	connection.query('SELECT Resp_Date FROM userresponses WHERE Resp_Date>=? and User_ID=?;',curDate,userId, function(err, rows, fields) {
		if(err){
			console.log('error while getting current reponse status');
		}
		else{
			res.acceptInput=false;
			if(rows.length>0){
				res.acceptInput=true;
			}
		}
	});
}

app.post('/sendinput',function(req,res){
	if(!req.cookies.userId){
		var query='INSERT INTO userresponses (Resp_Date,Resp_Time,User_ID,User_Country,Response) VALUES('
				+ 'CURRENT_DATE' + ',' 
				+ 'CURRENT_TIME' + ',"'
				+ userId + '","'
				+ userCountry + '","'
				+ req.input + '");';
		connection.query(query,function(err,rows,fields){
			if(err){
				console.log('error while inserting new response');
			}
			else{
				console.log('reponse recorded');
			}
			
		});
	}
});

app.get('/overallscr',function(req,res){	
	res.overallData.worldData.present=false;
	res.overallData.countryData.present=false;
	res.overallData.userData.present=false;
	query_select='SELECT Response, COUNT(Response) AS NumResponse FROM userresponses ';
	query_groupby=' GROUP BY Response;';
	
	query_where='';
	connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
		if(err){
			console.log('error while getting world totals');
		}
		else{
			res.overallData.worldData.present=true;
			res.overallData.worldData[true]=0;
			res.overallData.worldData[false]=0;
			for(row in rows){
				res.overallData.worldData[row.Response]=row.NumResponse;
			}
		}
	});
	
	if(userCountry){
		query_where='WHERE User_Country = "' + userCountry + '"';
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting country totals');
			}
			else{
				res.overallData.countryData.present=true;
				res.overallData.countryData[true]=0;
				res.overallData.countryData[false]=0;
				for(row in rows){
					res.overallData.countryData[row.Response]=row.NumResponse;
				}
			}
		});
	}
	
	if(userId){
		query_where='WHERE User_ID = "' + userId + '"';
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting user totals');
			}
			else{
				res.overallData.userData.present=true;
				res.overallData.userData[true]=0;
				res.overallData.userData[false]=0;
				for(row in rows){
					res.overallData.userData[row.Response]=row.NumResponse;
				}
			}
		});
	}
	
});

app.get('/detailedscr',function(req,res){
	if(req.dataOf=='world'){
		query_where='';
	}else if(req.dataOf=='country'){
		query_where='WHERE User_Country = "' + userCountry + '"';
	}
	else if(req.dataOf=='user'){
		query_where='WHERE User_ID = "' + userId + '"';
	}
	
	for(int i=1;i<=12;++i){
		res.detailedData.monthly[i][0]=0;
		res.detailedData.monthly[i][1]=0;
	}
	for(int i=0;i<7;++i){
		res.detailedData.weekly[i][0]=0;
		res.detailedData.weekly[i][1]=0;
	}
	for(int i=0;i<24;++i){
		res.detailedData.hourly[i][0]=0;
		res.detailedData.hourly[i][1]=0;
	}
		
	query_select='SELECT ?, Response, COUNT(Response) AS NumResponse FROM userresponses ';
	query_groupby=' GROUP BY Response, ?;';
	
	connection.query(query_select + query_where + query_groupby ,'MONTH(Resp_Date) AS Month', 'MONTH(Resp_Date)', function(err, rows, fields) {
		if(err){
			console.log('error while getting monthly detailed');
		}
		else{
			for(row in rows){
				res.detailedData.monthly[row.Month][row.Response]=row.NumResponse;
			}
		}
	});
	
	connection.query(query_select + query_where + query_groupby ,'WEEKDAY(Resp_Date) AS WeekDay', 'WEEKDAY(Resp_Date)', function(err, rows, fields) {
		if(err){
			console.log('error while getting weekly detailed');
		}
		else{
			for(row in rows){
				res.detailedData.weekly[row.WeekDay][row.Response]=row.NumResponse;
			}
		}
	});
	
	connection.query(query_select + query_where + query_groupby ,'HOUR(Resp_Time) AS Hour', 'HOUR(Resp_Time)', function(err, rows, fields) {
		if(err){
			console.log('error while getting hourly detailed');
		}
		else{
			for(row in rows){
				res.detailedData.hourly[row.Hour][row.Response]=row.NumResponse;
			}
		}
	});
	
});

connection.end(function (err){
	if(err){
		console.log('error while ending connection');
	}
	else{
		console.log('connection ended successfully');
	}
});

var get('*',function(req,res){
	res.sendfile(req.url);
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})