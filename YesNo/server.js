var express=require('express')
var cookieParser=require('cookie-parser')
var mysql=require('mysql')
var bodyParser=require('body-parser');
var http=require('http')

var app=express()
app.use(cookieParser())
app.use(bodyParser.json());

app.use(function(req,res,next){
	console.log(req.cookies.userId)
	console.log(req.cookies.userCountry)
	if(!req.cookies.userId){
		var connection = mysql.createConnection({
		  host: 'localhost',
		  port: '3306',
		  user: 'IsIt',
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
					res.cookie('userId',rows[0].MaxId + 3, { maxAge: (5 * 365 * 24 * 60 * 60 * 1000), httpOnly: true })
				}
				else{
					res.cookie('userId',100, { maxAge: (5 * 365 * 24 * 60 * 60 * 1000), httpOnly: true })
				}
				connection.end(function (err){
					if(err)		console.log('error while ending connection')
					else		console.log('connection ended successfully')
				})
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
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		console.log(ip)
		var options = {
		  hostname: 'freegeoip.net',
		  path: '/json/' + ip,
		  method: 'GET'
		};

		var req = http.request(options, function(response){
			var body=''
			response.setEncoding('utf8');
			response.on('data', function(data){
				body+=data
			});
			response.on('end', function(){
				var country=JSON.parse(body).country_code
				if(country==''){
					country='00'
				}
				res.cookie('userCountry',country, { maxAge: (5 * 24 * 60 * 60 * 1000), httpOnly: true })
				console.log('new user country');
				next()
			});
		});
		req.on('error', function(e){
			console.log('problem with request:' + e.message);
		});
		req.end();
	}
	else{
		next()
	}
})

app.get('/checkresponse',function(req,res){
	//check if user has responded for today
	console.log('in initapp path    '+req.cookies.userCountry+'    '+req.cookies.userId)

	var connection = mysql.createConnection({
	  host: 'localhost',
	  port: '3306',
	  user: 'IsIt',
	  password: 'mysql',
	  database: 'db1'
	})
	connection.connect(function(err){
		if (err) console.log('error connecting...')
		else console.log('You are now connected...')
	})
	connection.query('SELECT Resp_Date FROM userresponses WHERE Resp_Date>=CURRENT_DATE and User_ID='+req.cookies.userId+';',function(err, rows, fields) {
		if(err){
			console.log('error while getting current reponse status')
		}
		else{
			res.send({acceptInput: (rows.length>0)})
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
		  user: 'IsIt',
		  password: 'mysql',
		  database: 'db1'
		})

		connection.connect(function(err) {
			if (err) console.log('error connecting...')
			else console.log('You are now connected...')
		})
		console.log(req.body);
		var query='INSERT INTO userresponses (Resp_Date,Resp_Time,User_ID,User_Country,Response) VALUES('
				+ 'CURRENT_DATE' + ',' 
				+ 'CURRENT_TIME' + ',"'
				+ req.cookies.userId + '","'
				+ req.cookies.userCountry + '",'
				+ req.body.userResponse + ');'
		console.log(query);
		connection.query(query,function(err,rows,fields){
			if(err){
				console.log('error while inserting new response')
			}
			else{
				console.log('reponse recorded')
			}
			res.end()
			connection.end(function (err){
				if(err)		console.log('error while ending connection')
				else		console.log('connection ended successfully')
			})
		})
	}
})

app.get('/overallscr',function(req,res){
	console.log('in overall path')
	
	var overallData={};
	
	query_select='SELECT Response, COUNT(Response) AS NumResponse FROM userresponses '
	query_groupby=' GROUP BY Response;'
	
	query_where=''
	
	var connection = mysql.createConnection({
	  host: 'localhost',
	  port: '3306',
	  user: 'IsIt',
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
			overallData.present=true;
			overallData.worldData=rows;
		}
		console.log('got world data')
	})
	
	if(req.cookies.userCountry){
		overallData.country=req.cookies.userCountry
		query_where='WHERE User_Country = "' + req.cookies.userCountry + '"'
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting country totals')
			}
			else{
				overallData.countryData=rows;
			}
			console.log('got country data')
		})
	}
	
	if(req.cookies.userId){
		query_where='WHERE User_ID = "' + req.cookies.userId + '"'
		connection.query(query_select + query_where + query_groupby, function(err, rows, fields) {
			if(err){
				console.log('error while getting user totals')
			}
			else{
				overallData.userData=rows;
			}
			console.log('got user data')

			res.send({overallData: overallData})
			connection.end(function (err){
				if(err)		console.log('error while ending connection')
				else		console.log('connection ended successfully')
			})
		})
	}
})

app.get('/detailedscr',function(req,res){
	console.log('in detailed path')
	
	var query_where=''
	var detailedData={};
	
	if(req.query.dataOf=='world'){
		query_where=''
	}else if(req.query.dataOf=='country'){
		query_where='WHERE User_Country = "' + req.cookies.userCountry + '"'
		detailedData.country=req.cookies.userCountry
	}
	else if(req.query.dataOf=='user'){
		query_where='WHERE User_ID = "' + req.cookies.userId + '"'
	}

	
	var connection = mysql.createConnection({
	  host: 'localhost',
	  port: '3306',
	  user: 'IsIt',
	  password: 'mysql',
	  database: 'db1'
	})
	connection.connect(function(err) {
		if (err) console.log('error connecting...')
		else console.log('You are now connected...')
	})
	query_select='SELECT MONTH(Resp_Date) AS Month, Response, COUNT(Response) AS NumResponse FROM userresponses '
	query_groupby=' GROUP BY Response, MONTH(Resp_Date);'
	connection.query(query_select + query_where + query_groupby , function(err, rows, fields) {
		if(err){
			console.log('error while getting monthly detailed')
		}
		else{
			detailedData.present=true
			detailedData.monthlyData=rows;
		}
	})
	
	query_select='SELECT WEEKDAY(Resp_Date) AS WeekDay, Response, COUNT(Response) AS NumResponse FROM userresponses '
	query_groupby=' GROUP BY Response, WEEKDAY(Resp_Date);'
	connection.query(query_select + query_where + query_groupby , function(err, rows, fields) {
		if(err){
			console.log('error while getting weekly detailed')
		}
		else{
			detailedData.weeklyData=rows;
		}
	})
	
	query_select='SELECT HOUR(Resp_Time) AS Hour, Response, COUNT(Response) AS NumResponse FROM userresponses '
	query_groupby=' GROUP BY Response, HOUR(Resp_Time);'
	connection.query(query_select + query_where + query_groupby , function(err, rows, fields) {
		if(err){
			console.log('error while getting hourly detailed')
		}
		else{
			detailedData.hourlyData=rows;
		}
		console.log("detailedData sending")
		res.send({detailedData: detailedData})
		connection.end(function (err){
			if(err)		console.log('error while ending connection')
			else		console.log('connection ended successfully')
		})
		
	})
})

app.get('/',function(req,res){
//	console.log('in home path'+__dirname + "/main.html")
	res.sendFile(__dirname + "/main.html")
})

app.get('*',function(req,res){
//	console.log('in '+ __dirname + req.path +' path')
	res.sendFile(__dirname + req.path)
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
