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
var path = require('path');
const cookieParser = require('cookie-parser');
_app.use('/css', express.static(path.join(__dirname, 'css')));
_app.use('/img', express.static(path.join(__dirname, 'img')));
_app.use('/script', express.static(path.join(__dirname, 'script')));

_app.use(bodyParser.json());
_app.use(cookieParser());
_app.set('port', 3000);
// module package 설치 
var session = require('express-session');
//DB에 세션ID을 저장하기 위한 미들웨어
_app.use(bodyParser.urlencoded({ extended: true }));
_app.use(session({
    key: 'sid',
    secret: "ksdjwv@!!ssz224455mml;/.v", // 이 값을 이용해 암호화옵션
    resave: false, // 세션이 수정되지 않아도 항상 저장할지 확인하는 옵션
    saveUninitialized: true, // 세션이 uninitalized 상태로 미리 만들어서 저장하는지 묻는 옵션
    cookie: { // 쿠키에 들어가는 세션 ID값의 옵션
        maxAge: 1000 * 60 * 2 // 2분후 폭파
    }
}));



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qazqaz@369',
    database: 'user_db'
});

function blackSearch(password, nickname, phone, email) {
    if (password.length < 5 || nickname.length < 1 || phone.length < 7 || email < 5) {
        return true
    }
    else {
        return false
    }

}

connection.connect();


var router = express.Router();

var appServer = http.createServer(_app);
appServer.listen(_app.get('port'), function () {
    console.log('express 웹 서버 실행' + _app.get('port'));
});

router.route('/').get(function (req, res) {
    console.log("시작화면에 진입합니다.");
    fs.readFile('index.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

router.route('/join').get(function (req, res) {
    console.log("회원가입 화면에 진입합니다.");
    fs.readFile('join.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

router.route('/member').post(function (req, res) 
{

    var comand = req.body;
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
        res.send('공백입니다');
    }
    else {
        connection.query("SELECT * FROM member WHERE memberid =? OR nickname =?", [memberid, nickname], function (err, data) {


            if (data.length == 0) {
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
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    })

                    console.log('성공적으로 쿼리 문을 이식하였습니다.');
                });
            }
            else {
                console.log('아이디와 닉네임에 중복이 존재해 회원이 되실 수 없습니다.');
                fs.readFile('member1.html', function (error, data) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                })
            }

        });
        deciper.update(cipherdOutput, 'base64', 'utf8');
        var deciphedOutput = deciper.final('utf8');
        console.log('원문 :' + password);
        console.log('암호화:' + cipherdOutput);
        console.log('복호화:' + deciphedOutput);

    }

});

router.route('/login').get(function (req, res) {
    console.log("로그인 화면에 진입합니다.");
    fs.readFile('login.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });

})

router.route('/resign').get(function (req, res) {
    console.log("회원탈퇴 화면에 진입합니다.");
    fs.readFile('resign.html', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });

});

router.route('/loginout').get(function (req, res) {
    req.session.destroy(function () {
        console.log("회원이 로그아웃하였습니다.");
        res.clearCookie('connect.sid');
        res.send("안녕하가세요. 회원님");
    });
});



router.route('/loging').post(function (req, res) {
    var comand = req.body;
    var memberid = comand.userId;
    var password = comand.password1;

    connection.query('SELECT * FROM member WHERE memberid = ?', [memberid], function (error, results, fields) {

        if (error) {
            console.log("err ocurred", error);
        }
        else {

            if (req.session.user) {
                res.send("<h1><%= nickname %>  님 또 오실려고요?</h1>");
            }
            else {
                req.session.user = req.body;
                req.session.nickname = req.body.nickname;
                req.session.user.expire = new Date();
                console.log("The solution is :", results)
                if (results.length > 0) {
                    if (results[0].password == password) {
                        console.log("로그인에 성공하였습니다.");
                        res.send("<h1> <%= nickname %> 님의 로그인 축하합니다.</h1>");

                    }
                    else {
                        console.log("비밀번호가 다릅니다.");
                    }
                }
                else {
                    console.log("아이디가 정확하지 않습니다.");
                }
            }
        }
    });
});


router.route('/resigned').post(function (req, res) {
    var comand = req.body;
    var memberid = comand.userId;
    var password1 = comand.password1;
    var password2 = comand.password2;
    connection.query('SELECT * FROM member WHERE memberid = ?', [memberid], function (error, results, fields) {

        if (error) {
            console.log("err ocurred", error);
        }
        else {
            if (results.length > 0) {
                if (results[0].password == password1) 
                {
                    if(password1 == password2)
                    {
                    console.log("회원님과 함께 할 수 있어 영광이었습니다.");
                    connection.query('DELETE FROM member WHERE memberid = ?', [memberid], function (error, results, field) {
                        if (error)
                        {
                            console.log("err ocurred", error);
                        }
                        else 
                        {

                            fs.readFile('resignA.html', (err, data) => {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(data);
                            });
                            console.log("떠나신 회원님의 앞날에 행복이 있기를....")
                        }
                    });
                   }
                   else
                   {
                    console.log("본 회사의 회원이나, 두 비밀번호가 다릅니다.");
                    fs.readFile('resignD.html', (err, data) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    });   
                   }
                }
                else 
                {
                    console.log("본 회사의 회원이나, 비밀번호가 다릅니다.");
                    fs.readFile('resignB.html', (err, data) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    });
                }
            }
            else {
                console.log("관련 아이디가 존재하지 않습니다.");
                fs.readFile('resignC.html', (err, data) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                });
            }
        }

    });
});


_app.use('/', router);
_app.all('*', function (req, res) {
    res.status(404).send('<h1> 요청페이지 없음 </h1>')
})

