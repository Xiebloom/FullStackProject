var express = require('express');
var router = express.Router();
var pg = require('pg');
//var funcs = require('./funcs');

//DB 定義
var pgPool = new pg.Pool({
  database: "PJ",
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5432,
});

// 创建用户
router.post('/create', (req, res, next) => {

  var name = req.body['userName'];
  var createId;
  var date = req.body['userDate'];

  //随机生成实验数据
  var starttime = new Array();
  var finishtime = new Array();
  generatedata(starttime, finishtime);
  var slen = starttime.length;

  //新しいユーザーを登録
  pgPool.connect(function (err, client) {
    if (err) {
      console.log(err);
    } else {

      console.log('User Resgiter!');

      //まず、最新のユーザーIDを抽出
      var query = {
        text:
          'SELECT NAME,id FROM public."TEST_TBL" ORDER BY id DESC LIMIT 1',
        //values: [userName,id],
      };
      client   // 连接DB，获取用户名，ID
        .query(query, function (err, result) {

          if (err) {
            console.log(err);
          }
          else {

            console.log('finding user data...')
            //若找到了确实存在的数据
            if (result.rows.length) {
              console.log('user data Found.')
              userName = result.rows[0].name;
              //　console.log(userName);
              console.log('最新のユーザーは');
              console.log(result.rows[0].id);

              //新ID生成
              createId = setnewID(result.rows[0].id);
              console.log('new ID is ' + createId);

              //将新用户名和ID写入 用户名&ID 数据库
              var query = {
                text:
                  'INSERT INTO public."TEST_TBL" (name,id) VALUES($1,$2)',
                values: [name, createId],
              };
              client
                .query(query)
                .then(() => {
                  //res.send("Data Created.");
                })
                .catch((e) => {
                  console.error(e.stack);
                });


              //在实验数据表中，创造对应用户的实验数据 ・ 新しい実験データを作成
              for (var k = 1; k <= slen; k++) {
                var query = {
                  text:
                    'INSERT INTO public."EXAMDATA" (userid,TimeOrder,StartTime,FinishTime) VALUES($1,$2,$3,$4)',
                  values: [createId, k, starttime[k - 1], finishtime[k - 1]],
                };
                // console.log(query);
                client
                  .query(query)
                  .then(() => {
                    // res.send("Data Created.");
                  })
                  .catch((e) => {
                    console.error(e.stack);
                  });
              }

              var data = {
                title: 'DB登録完了',
                content: name + 'さんを登録しました ',
                id: createId,
              }

              //console.log(data);

              res.render('create', data);  //render函数所传递的数据必须是对象，具有｛項目：値...｝的形式。

            }
          }
        });

    }
  });



});

// 查找实验数据 
router.post('/select', (req, res, next) => {  //こっちの　/select　は 相対パス、Renderのところは pug の名前

  // 参照：var name = req.body['userName'];
  var id = req.body['userID'];
  var userName;
  var resulttobrowser;
  var data;

  var foundtimedata = new Array();
  var foundstarttime = new Array();
  var foundfinishtime = new Array();

  console.log('userID = ' + id);

  //  传送给DB的text，结合2个表，找出开始时间，结束时间，用户ID，用户名   
  var querysql = {
    text:
      //'SELECT NAME FROM public."TEST_TBL" WHERE id = $1 ',
      'SELECT starttime,finishtime,id,name FROM public."TEST_TBL" INNER JOIN public."EXAMDATA" ON public."TEST_TBL".id = public."EXAMDATA".userid  WHERE userid = $1',   //sqlのテーブル結合
    values: [id]
    //  values: [foundstarttime,foundfinishtime,id,userName],   //これはDBに渡すデータなんですよ
  };

  //链接DB拿开始时间，结束时间 ・　DBから開始時間と終了時間を抽出
  pgPool.connect(function (err, client) {

    if (err) {
      console.log(err);
    }
    else {
      client   //获取开始，终了时间
        .query(querysql, function (err, result) {

          //console.log(result);
          if (err) {
            console.log(err);
            console.log('querySQL failed!')
          }
          else {
            {//开始時間，结束时间处理
              console.log('finding time data...')
              //console.log(result);

              //若通过用户ID，找到了确实存在的数据　・　IDが確かに存在する場合
              if (result.rows.length) {
                console.log('time data Found.')
                userName = result.rows[0].name;
                id = result.rows[0].id;
                // console.log(userName);
                //console.log(result);

                foundtimedata = result.rows;  //获取数据，类型为JS对象
                resulttobrowser = foundtimedata;   //对 JS 对象进行保存


                //userName = result.rows[0].name;

                //将获得的数据，分成起始时间和结束时间
                for (var i = 0; i < foundtimedata.length; i++) {
                  foundstarttime[i] = foundtimedata[i].starttime; //开始时间数组
                  foundfinishtime[i] = foundtimedata[i].finishtime; //结束时间数组
                }


                //将js对象转化成json字符串，单纯好玩
                var jsonresult = JSON.stringify(resulttobrowser);

                //  传送给DB的text，用户ID对应的问卷结果・　当IDのアンケート回答結果
                console.log('find id = ' + id);
                var querysql = {
                  text:
                    'SELECT answer FROM public."ques" WHERE ques_id = $1',
                  values: [id]
                };

                client   //获取アンケート結果
                  .query(querysql, function (err, result) {

                    //console.log(result);
                    if (err) {
                      console.log(err);
                      console.log('querySQL failed!')
                    }
                    else {
                      {
                        if (true) {

                          console.log(result);
                          var quesans = new Array();

                          for (var i=0; i < 3; i++){
                            //console.log("result[" + i +"] : " + result.rows[i].answer);
                            if(typeof(result.rows[i])　== "undefined"){
                              console.log("not found;");
                              quesans[i] = "無";
                            }
                            else{
                              quesans[i] = result.rows[i].answer;
                            }
                          }
                          console.log(quesans);                

                          //传给pug数据・データをpugに渡す
                         var data = {
                            title: 'DB抽出完了',
                            content: 'idは' + id + 'の' + userName + 'さんを選択しました。',
                            resulttobrowser0: foundstarttime,
                            resulttobrowser1: foundfinishtime,
                            QuestionsAnswer: quesans,
                          }

                          res.render('select', data);
                        }

                        else {
                          console.log('data not found.')
                          var data = {
                            title: 'DB抽出完了',
                            content: 'idは' + id + 'の' + userName + 'さんを選択しました。',
                            resulttobrowser0: foundstarttime,
                            resulttobrowser1: foundfinishtime,
                            QuestionsAnswer: "無無無",
                          }
                          res.render('select', data);
                        }

                      }
                    }
                  });

              }

              //当IDが存在してない
              else {
                console.log('data not found.')
                data = {
                  title: 'DB抽出完了',
                  content: '当IDは見つけませんでした',
                  resulttobrowser0: 'データなし',
                  resulttobrowser1: 'データなし',
                  QuestionsAnswer: "無無無",
                }
                res.render('select', data);

              }

              //console.log(data);
              

            }
          }
        });

    }
  });
});



router.get('/', function (req, res, next) {
  var data = {
    title: '新規実験とデータ検索',
    content: '　',

  }
  res.render('hello', data);
});

function generatedata(starttime, finishtime) {

  var k = 0;
  var r = 0;
  for (var i = 0; i < 20; i++) {
    //保存该回生成的随机数
    r = randomnunber(i, i + 1);
    //    console.log(r);
    //    console.log(randomnunber(0,1));

    //若新的开始时间小于之前的结束时间，即为该段连续
    if (i == 0) {
      starttime[i] = randomnunber(i, i + 1);
      finishtime[i] = starttime[i] + randomnunber(0, 1);
    }
    else {
      if (r <= finishtime[k]) {
        finishtime[k] = finishtime[k] + randomnunber(0, 1);
        //        console.log('Finishtime伸びる！' + ' to ' + finishtime[k]);
      }
      //否则就是新的一段时间 
      else {
        starttime[k + 1] = r;
        finishtime[k + 1] = r + randomnunber(0, 1);
        k++;
      }
    }

    //    console.log('starttime' + k + ' = ' + starttime[k]);
    //    console.log('finishtime' + k + ' = ' + finishtime[k]);
  }
}

function randomnunber(down, up) {
  return Math.random() * (up - down) + down;
}

function setnewID(lastid) {
  var newid;
  newid = Number(lastid[1] * 100) + Number(lastid[2] * 10) + Number(lastid[3]) + 1;
  return 'M' + String(newid);
}


module.exports = router;
