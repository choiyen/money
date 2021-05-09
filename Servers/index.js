
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
const mysql = require('mysql');
const http = require('http');
const { request, response } = require('../app')
http.createServer((request,response) => {

}).listen(8080);

app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazqaz@369',
    database: 'user_db'
});

connection.connect();


//더 이상 가져올 데이터가 없을 때 실행되는 함수.
router.post('/member', function (req, res) {

    var body = req.body;
    var memberid = body.userId;
    var password = body.password1;
    var nickname = body.nickname;
    var phone = body.mobile;
    var email = body.mail;
    var sua = body.suba;
    var sub = body.subb;


    var sqlQuery = "INSERT INTO member SET ?"; 
	var post = {memberid: memberid, password : password, nickname : nickname, mail : email, phone : phone, passwordfind : sua, passwordanswer : sub};
    connection.query(sql, post, (error, rows) => {
        if (error) {
            console.log('user infor is:', error);
        }
        else {
            console.log(rows.insertid);

        }
    });
});
module.exports = router;