var express=require('express');
var cookieParser=require('cookie-parser');
var mysql=require('mysql');

var app=express();
app.use(cookieParser());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'DB1'
})

//get cookie data;create new cookie if new user

app.get('/initApp',function(req,res){
//check if user has responded for today
	connection.connect(function(err) {
  		if (err) throw err
  		console.log('You are now connected...')
	})
	
	
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})