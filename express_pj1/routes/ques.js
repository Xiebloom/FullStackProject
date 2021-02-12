var express = require('express');
var router = express.Router();
var pg = require('pg');

var pgPool = new pg.Pool({
    database: "PJ",
    user: "postgres",
    password: "123456",
    host: "localhost",
    port: 5432,
  });


router.post('/thanks', function (req, res, next) {

    var userid = req.body['iddata'];
    console.log('userid = ' + userid);

    var answers = new Array();

    answers[0] = req.body['Q1'];
    answers[1] = req.body['Q2'];
    answers[2] = req.body['Q3'];
    
    
    //入力してない場合
    if(answers[0]== null || answers[1] == null || answers[2] == null){
        console.log(answers);
        var data = {
            title: 'アンケート',
            content: 'すべての問題を回答してください',
            id : userid,        
          }
        res.render('ques', data);
    }
    
     else{
        var data = {
            title: '結果表示',
            content: answers[0] + answers[1] + answers[2] ,
        }
    
        pgPool.connect(function (err, client) {         
            console.log(answers);
            if (err) {
                console.log(err);
            } else {   
                for (var i = 0; i < answers.length; i++) {
                    //写入数据库
                    var query = {
                        text:
                            'INSERT INTO public."ques" (ques_id,answer,qnum) VALUES($1,$2,$3)',
                        values: [userid, answers[i],i+1],
                    };
                    client
                        .query(query)
                        .then(() => {
                            //res.send("Data Created.");
                        })
                        .catch((e) => {
                            console.error(e.stack);
                        });    
                }
                res.render('thanks', data);
            }
        });             
    }
});

module.exports = router;