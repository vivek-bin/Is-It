![Fancy](screenshots/g.gif?raw=true "Fancy")

# Is-It

This is a simple web app built with -
 - AngularJS used for the frontend
 - Express.Js framework used for the backend
 - MySQL(v5.7.17) to store responses

The app records user responses, and then presents the overall responses graphically.


## Requirements

- Node and npm (http://nodejs.org)
- MySQL: Make sure you have your local database configured in 'server.js'


## Installation

1. Clone the repository: `git clone git@github.com:vivek-bin/Is-It`
2. Place your own database connection details in `server.js`.
```
    var connection = mysql.createConnection ({
      host: 'localhost',
      port: '3306',
      user: 'IsIt',
      password: 'mysql',
      database: 'db1'
    })
```
  
3. Start the server: `node server.js`
4. View in browser at `http://localhost:8081`

(see 'To Do' if running for the first time)


## To Do

 - Currently, need to create response table manually at the beginning
 ```
	 CREATE TABLE userresponses (
     	 Resp_Date DATE
		,Resp_Time TIME
		,User_ID INT
		,User_Country CHAR(2)
		,Response TINYINT
		,PRIMARY KEY(Resp_Date,Resp_Time,User_ID,User_Country);
```

![](screenshots/s1.jpg?raw=true)

![](screenshots/s2.jpg?raw=true)

![](screenshots/s3.jpg?raw=true)
