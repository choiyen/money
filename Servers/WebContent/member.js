var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const bodyParser = require('body-parser');
const { request } = require('express');
var _app = express();
var crypto = require('crypto');
const cookieParser = require('cookie-parser');
_app.use(express.static(__dirname + '/WebContent'));
_app.use(bodyParser.json());
_app.use(cookieParser());

// module package 설치 
var session = require('express-session'); 
      //DB에 세션ID을 저장하기 위한 미들웨어
      _app.use(bodyParser.urlencoded({extended : true}));
      _app.use(session({
          key : 'sid',
          secret : "ksdjwv@!!ssz224455mml;/.v", // 이 값을 이용해 암호화옵션
          resave : false, // 세션이 수정되지 않아도 항상 저장할지 확인하는 옵션
          saveUninitialized : true, // 세션이 uninitalized 상태로 미리 만들어서 저장하는지 묻는 옵션
          cookie : { // 쿠키에 들어가는 세션 ID값의 옵션
              maxAge : 1000 * 60 * 2 // 2분후 폭파
          }
      }));



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazqaz@369',
    database: 'user_db'
});

function blackSearch(password, nickname, phone, email)
{
    if(password.length <5||nickname.length <1||phone.length<7 || email <5)
    {
        return true
    }
    else
    {
        return false
    }

}

connection.connect();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url).query;
    var pathname = url.parse(_url).pathname;

    if (request.url == '/') {
        fs.readFile('index.html', (err, data) => {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    }
    else if (request.url == '/favicon.ico') {
        return response.writeHead(404);
    }
    else if (request.url == '/member.html') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        })
        request.on('end', function () 
        {
          
            var comand = qs.parse(body);
            var memberid = comand.userId;
            var password = comand.password1;
            var nickname = comand.nickname;
            var phone = comand.mobile;
            var email = comand.mail;
            var sua = comand.suba;
            var sub = comand.subb;

            //암호화 복호화를 위한 코드
            var key = 'myeky';
            var cipher = crypto.createCipher('aes192', key);
            var deciper = crypto.createCipher('aes192', key);

            //암호화 하는 것.
            cipher.update(password, 'utf8', 'base64');
            var cipherdOutput = cipher.final('base64');

            if (blackSearch(password, nickname, phone, email)) {
                console.log('공백');
                response.send('공백입니다');
            }
            else 
            {
                connection.query("SELECT * FROM member WHERE memberid =? OR nickname =?", [memberid, nickname], function (err, data) {


                    if (data.length == 0) 
                    {
                        var sqlQuery = "INSERT INTO member SET ?";
                        var post = { memberid: memberid, password: password, nickname: nickname, mail: email, phone: phone, passwordfind: sua, passwordanswer: sub };
                        connection.query(sqlQuery, post, (error, rows) => {
                            if (error) {
                                console.log('user infor is:', error);
                            }
                            else {
                                console.log(rows.insertid);
                            }

                            fs.readFile('member.html', function (error, data) {
                                response.writeHead(200, { 'Content-Type': 'text/html' });
                                response.end(data);
                            })

                            console.log('성공적으로 쿼리 문을 이식하였습니다.');
                        });
                    }
                    else
                    {
                        console.log('아이디와 닉네임에 중복이 존재해 회원이 되실 수 없습니다.');
                        fs.readFile('member1.html', function (error, data) {
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end(data);
                        })
                    }

                });
                deciper.update(cipherdOutput,'base64','utf8');
                var deciphedOutput = deciper.final('utf8');
                console.log('원문 :'+password);
                console.log('암호화:'+cipherdOutput);
                console.log('복호화:'+deciphedOutput);

            }

        });


    }
    else if(request.url == '/login')
    {
        var body = '';
        request.on('data', function (data) 
        {
            body = body + data;
        })
        request.on('end', function (req,res,next) 
        {
            var comand = qs.parse(body);
            var memberid = comand.userId;
            var password = comand.password1;

            connection.query('SELECT * FROM member WHERE memberid = ?',[memberid],function(error,results,fields)
            {
                
                if(error)
                {
                    console.log("err ocurred",error);
                }
                else
                {
                    console.log("The solution is :",results)
                    if(results.length >0)
                    {
                        if(results[0].password == password)
                        { 
                             console.log("로그인에 성공하였습니다.");
                        }
                        else
                        {
                            console.log("비밀번호가 다릅니다.");
                        }
                    }
                    else
                    {
                        console.log("아이디가 정확하지 않습니다.");
                    }
                }
            });

        });

    }
    else {
        response.writeHead(200);
        response.end(fs.readFileSync(__dirname + _url));
    }
});

app.listen(4000);
console.log('4000번 포트를 열어 node js 서버를 생성합니다.');

module.exports = router;


