var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'qazqaz@369',
    database : 'user_db'
});
 connection.connect();
 
 //더 이상 가져올 데이터가 없을 때 실행되는 함수.
 router.post('/',function(req, res){
 	 
	 var body = req.body;
	 var memberid =  body.userId;
	 var password  =  body.password1;
	 var nickname =  body.nickname;
	 var phone =  body.mobile;
	 var email =  body.mail;
	 var sua  =  body.suba;
	 var sub =  body.subb;
	 
	 
	 var sqlQuery = "INSERT INTO member SET ?"; 
	 var post = {memberid: memberid, password : password, nickname : nickname, phone : phone, email : email, sua : sua, sub : sub};
	 var query = connection.query(sqlQuery, post, callback);

	 con.query(sql, function(err,rows,fields){
	     if(err){
	       console.log(err);
	     }else{
	       console.log(rows);
	       res.json(rows);
	     }
	   })
 	
 });
 

module.exports = router;

