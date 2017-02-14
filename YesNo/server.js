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
		connection.query('SELECT MAX(User_Id) AS Max_Id from userresponses;',function(err,rows,fields){
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
	
	connection.query('SELECT Resp_Date FROM userresponses WHERE Resp_Date>=? and User_Id=?;',curDate,userId, function(err, rows, fields) {
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
		var query='INSERT INTO userresponses (Resp_Date,Resp_Time,User_Id,User_Country,Response) VALUES('
				+ curDate + ',' 
				+ curTime + ','
				+ userId + ','
				+ userCountry + ','
				+ req.input + ');';
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

app.get('/overall',function(req,res){
	userId=req.cookies.userId;
	userCountry=req.cookies.userCountry;
	connection.query('SELECT Response, COUNT(Response) AS NumResponse FROM userresponses GROUP BY Response;',curDate,userId, function(err, rows, fields) {
		if(err){
			console.log('error while getting current reponse status');
		}
		else{
			res.overallData.worldData.yeses=0;
			res.overallData.worldData.noeses=0;
			for(row in rows){
				if(row.Response){
					res.overallData.worldData.yeses=row.NumResponse;
				}
				if(!row.Response){
					res.overallData.worldData.noes=row.NumResponse;
				}
			}
			res.acceptInput=false;
			if(rows.length>0){
				res.acceptInput=true;
			}
		}
	});
	
});


connection.end(function (err){
	if(err){
		console.log('error while ending connection');
	}
	console.log('connection ended successfully');
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})