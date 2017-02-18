var express=require('express')
var cookieParser=require('cookie-parser')
var mysql=require('mysql')

var app=express()
app.use(cookieParser())

app.use(function(req,res,next){
	if(!req.cookies.userId){
		var connection = mysql.createConnection({
		  host: 'localhost',
		  port: '3306',
		  user: 'root',
		  password: 'mysql',
		  database: 'db1'
		})

		connection.connect(function(err) {
			if (err) console.log('error connecting...')
			else console.log('You are now connected...')
		})
		
		req.cookies.userId=0
		connection.query('SELECT MAX(User_ID) AS MaxId from userresponses;',function(err,rows,fields){
			if(err){
				console.log('error getting new id for user')
			}
			else{
				if(rows.length){
					res.cookie('userId',rows[0].MaxId + 3)
				}
				else{
					res.cookie('userId',100)
				}
				
				console.log('new user id');
			}
			next()
		})
	}
	else{
		next()
	}
})

app.use(function(req,res,next){
	if(!req.cookies.userCountry){
		res.cookie('userCountry','IN')
		console.log('new user country');
		next()
	}
	else{
		next()
	}
})

app.get('/initApp',function(req,res){
//check if user has responded for today
	console.log('in initapp path    '+req.cookies.userCountry+'    '+req.cookies.userId)

	var connection = mysql.createConnection({
	  host: 'localhost',
	  port: '3306',
	  user: 'root',
	  password: 'mysql',
	  database: 'db1'
	})

	connection.connect(function(err) {
		if (err) console.log('error connecting...')
		else console.log('You are now connected...')
	})

	connection.query('SELECT Resp_Date FROM userresponses WHERE Resp_Date >= CURRENT_DATE and User_ID = '+ req.cookies.userId +';', function(err, rows, fields) {
		if(err){
			console.log('error while getting current reponse status')
		}
		else{
			res.acceptInput=false
			if(rows.length>0){
				res.acceptInput=true
			}
		}
		connection.end(function (err){
			if(err)		console.log('error while ending connection')
			else		console.log('connection ended successfully')
		})
	})
})

app.post('/sendinput',function(req,res){
	console.log('in sendinput path')
	
	if(req.cookies.userId){
		var connection = mysql.createConnection({
		  host: 'localhost',
		  port: '3306',
		  user: 'root',
		  password: 'mysql',
		  database: 'db1'
		})

		connection.connect(function(err) {
			if (err) console.log('error connecting...')
			else console.log('You are now connected...')
		})
		
		var query='INSERT INTO userresponses (Resp_Date,Resp_Time,User_ID,User_Country,Response) VALUES('
				+ 'CURRENT_DATE' + ',' 
				+ 'CURRENT_TIME' + ',"'
				+ req.cookies.userId + '","'
				+ req.cookies.userCountry + '","'
				+ req.input + '");'
		connection.query(query,function(err,rows,fields){
			if(err){
				console.log('error while inserting new response')
			}
			else{
				console.log('reponse recorded')
			}
			connection.end(function (err){
				if(err)		console.log('error while ending connection')
				else		console.log('connection ended successfully')
			})
		})
	}
})

app.get('/overallscr',function(req,res){
	console.log('in overall path')
	
	res.overallData.worldData.present=false
	res.overallData.countryData.present=false
	res.overallData.userData.present=false
	query_select='SELECT Response, COUNT(Response) AS NumResponse FROM userresponses '
	query_groupby=' GROUP BY Response;'
	
	query_where=''
	
	var connection = mysql.createConnection({
	  host: 'localhost',
	  port: '3306',
	  user: 'root',
	  password: 'mysql',
	  database: 'db1'
	})

	connection.connect(function(err) {
		if (err) console.log('error connecting...')
		else console.log('You are now connected...')
	})
	
	
	connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
		if(err){
			console.log('error while getting world totals')
		}
		else{
			res.overallData.worldData.present=true
			res.overallData.worldData[true]=0
			res.overallData.worldData[false]=0
			for(row in rows){
				res.overallData.worldData[row.Response]=row.NumResponse
			}
		}
	})
	
	if(req.cookies.userCountry){
		query_where='WHERE User_Country = "' + req.cookies.userCountry + '"'
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting country totals')
			}
			else{
				res.overallData.countryData.present=true
				res.overallData.countryData[true]=0
				res.overallData.countryData[false]=0
				for(row in rows){
					res.overallData.countryData[row.Response]=row.NumResponse
				}
			}
		})
	}
	
	if(req.cookies.userId){
		query_where='WHERE User_ID = "' + req.cookies.userId + '"'
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting user totals')
			}
			else{
				res.overallData.userData.present=true;
				res.overallData.userData[true]=0
				res.overallData.userData[false]=0
				for(row in rows){
					res.overallData.userData[row.Response]=row.NumResponse
				}
			}
			connection.end(function (err){
				if(err)		console.log('error while ending connection')
				else		console.log('connection ended successfully')
			})
		})
	}
	
})

app.get('/detailedscr',function(req,res){
	console.log('in detailed path')
	
	if(req.dataOf=='world'){
		query_where=''
	}else if(req.dataOf=='country'){
		query_where='WHERE User_Country = "' + req.cookies.userCountry + '"'
	}
	else if(req.dataOf=='user'){
		query_where='WHERE User_ID = "' + req.cookies.userId + '"'
	}
	
	for(var i=1;i<=12;++i){
		res.detailedData.monthly[i][0]=0
		res.detailedData.monthly[i][1]=0
	}
	for(var i=0;i<7;++i){
		res.detailedData.weekly[i][0]=0
		res.detailedData.weekly[i][1]=0
	}
	for(var i=0;i<24;++i){
		res.detailedData.hourly[i][0]=0
		res.detailedData.hourly[i][1]=0
	}
	
	var connection = mysql.createConnection({
	  host: 'localhost',
	  port: '3306',
	  user: 'root',
	  password: 'mysql',
	  database: 'db1'
	})
	connection.connect(function(err) {
		if (err) console.log('error connecting...')
		else console.log('You are now connected...')
	})
	
	query_select='SELECT ?, Response, COUNT(Response) AS NumResponse FROM userresponses '
	query_groupby=' GROUP BY Response, ?;'
	
	connection.query(query_select + query_where + query_groupby ,'MONTH(Resp_Date) AS Month', 'MONTH(Resp_Date)', function(err, rows, fields) {
		if(err){
			console.log('error while getting monthly detailed')
		}
		else{
			for(row in rows){
				res.detailedData.monthly[row.Month][row.Response]=row.NumResponse
			}
		}
	})
	
	connection.query(query_select + query_where + query_groupby ,'WEEKDAY(Resp_Date) AS WeekDay', 'WEEKDAY(Resp_Date)', function(err, rows, fields) {
		if(err){
			console.log('error while getting weekly detailed')
		}
		else{
			for(row in rows){
				res.detailedData.weekly[row.WeekDay][row.Response]=row.NumResponse
			}
		}
	})
	
	connection.query(query_select + query_where + query_groupby ,'HOUR(Resp_Time) AS Hour', 'HOUR(Resp_Time)', function(err, rows, fields) {
		if(err){
			console.log('error while getting hourly detailed')
		}
		else{
			for(row in rows){
				res.detailedData.hourly[row.Hour][row.Response]=row.NumResponse
			}
	
		}
		connection.end(function (err){
			if(err)		console.log('error while ending connection')
			else		console.log('connection ended successfully')
		})
	})
	
})

app.get('/',function(req,res){
	console.log('in home path')
	res.sendFile(__dirname + "/main.html")
})

app.get('*',function(req,res){
	console.log('in '+ __dirname + req.path +' path')
	res.sendFile(__dirname + req.path)
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
