var express=require('express');
var cookieParser=require('cookie-parser');
var mysql=require('mysql');

var app=express();
app.use(cookieParser());

var date= new Date();
var curDate= date.toLocaleDateString('en-GB');
var curTime= date.toLocaleTimeString('en-GB');

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

app.get('/initApp',function(req,res){
//check if user has responded for today
	userId=req.cookies.userId;
	userCountry=req.cookies.userCountry;
	if(userId or userCountry){
		connection.query('SELECT MAX(User_ID) AS Max_Id from userresponses;',function(err,rows,fields){
			if(err){
				console.log('error getting new id for user');
			}
			else{
				if(rows.length==0){
					userID=100;
				}
				else{
					userId=rows[0].Max_Id + 1;
				}
				res.cookie('userId',userId);
			}
		}
		userCountry='IN';//get user country from site
		res.cookie('userCountry',userCountry);		
	}
	
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
	userId=req.cookies.userId;
	userCountry=req.cookies.userCountry;
	
	res.overallData.worldData.present=false;
	res.overallData.countryData.present=false;
	res.overallData.userData.present=false;
	query_select='SELECT Response, COUNT(Response) AS NumResponse FROM userresponses ';
	query_groupby=' GROUP BY Response;';
	connection.query(query_select + query_groupby, function(err, rows, fields) {
		if(err){
			console.log('error while getting world totals');
		}
		else{
			res.overallData.worldData.present=true;
			res.overallData.worldData.yeses=0;
			res.overallData.worldData.noeses=0;
			for(row in rows){
				if(row.Response){
					res.overallData.worldData.yeses=row.NumResponse;
				}
				else{
					res.overallData.worldData.noes=row.NumResponse;
				}
			}
		}
	});
	if(userCountry){
		query_where='WHERE User_Country = ' + userCountry;
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting country totals');
			}
			else{
				res.overallData.countryData.present=true;
				res.overallData.countryData.yeses=0;
				res.overallData.countryData.noeses=0;
				for(row in rows){
					if(row.Response){
						res.overallData.countryData.yeses=row.NumResponse;
					}
					else{
						res.overallData.countryData.noes=row.NumResponse;
					}
				}
			}
		});
	}
	
	if(userId){
		query_where='WHERE User_ID = ' + userId;
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting user totals');
			}
			else{
				res.overallData.userData.present=true;
				res.overallData.userData.yeses=0;
				res.overallData.userData.noeses=0;
				for(row in rows){
					if(row.Response){
						res.overallData.userData.yeses=row.NumResponse;
					}
					else{
						res.overallData.userData.noes=row.NumResponse;
					}
				}
			}
		});
	}
	
});

app.get('/detailedscr',function(req,res){
	userId=req.cookies.userId;
	userCountry=req.cookies.userCountry;
	
	if(req.dataOf=='world'){
		query_where='';
	}else if(req.dataOf=='country'){
		query_where='WHERE User_Country = ' + userCountry;
	}
	else if(req.dataOf=='user'){
		query_where='WHERE User_ID = ' + userId;
	}
	
	query_select='SELECT ?, Response, COUNT(Response) AS NumResponse FROM userresponses ';
	query_groupby=' GROUP BY Response, ?;';
	
	connection.query(query_select + query_where + query_groupby ,'MONTH(Resp_Date) AS Month', 'MONTH(Resp_Date)', function(err, rows, fields) {
		if(err){
			console.log('error while getting monthly detailed');
		}
		else{
			for(i in {1,2,3,4,5,6,7,8,9,10,11,12}){
				res.detailedData.monthly[i].yeses=0;
				res.detailedData.monthly[i].noeses=0;
			}
			for(row in rows){
				if(row.Response){
					res.detailedData.monthly[row.Month].yeses=row.NumResponse;
				}
				else{
					res.detailedData.monthly[row.Month].noes=row.NumResponse;
				}
			}
		}
	});
	
	connection.query(query_select + query_where + query_groupby ,'WEEKDAY(Resp_Date) AS WeekDay', 'WEEKDAY(Resp_Date)', function(err, rows, fields) {
		if(err){
			console.log('error while getting weekly detailed');
		}
		else{
			for(i in {0,1,2,3,4,5,6}){
				res.detailedData.weekly[i].yeses=0;
				res.detailedData.weekly[i].noeses=0;
			}
			for(row in rows){
				if(row.Response){
					res.detailedData.weekly[row.WeekDay].yeses=row.NumResponse;
				}
				else{
					res.detailedData.weekly[row.WeekDay].noes=row.NumResponse;
				}
			}
		}
	});
	
	connection.query(query_select + query_where + query_groupby ,'HOUR(Resp_Time) AS Hour', 'HOUR(Resp_Time)', function(err, rows, fields) {
		if(err){
			console.log('error while getting hourly detailed');
		}
		else{
			for(i in {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23}){
				res.detailedData.hourly[i].yeses=0;
				res.detailedData.hourly[i].noeses=0;
			}
			for(row in rows){
				if(row.Response){
					res.detailedData.hourly[row.Hour].yeses=row.NumResponse;
				}
				else{
					res.detailedData.hourly[row.Hour].noes=row.NumResponse;
				}
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

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})