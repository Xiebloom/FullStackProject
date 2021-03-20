# FullStackProject
> 在NISHIMU電子工業株式会社实习的时候学来的皮毛，打算之后再深入学习，完善项目。
> 
> 传统日企的实习一般时常比较短，也对技术要求不是很高，主要以体验职场环境为主。
> 在该项目之前，我连 js 是什么东西都不知道（比如会问js和java什么关系？）
> 所以虽然功能实现了，但是这个代码写得实在是千奇百怪。
> 不过经过复盘，也能加深了相关知识的理解。

## 1 需求分析
> mentor 没有给我提出项目的任务，而是问我想做一个什么样子的项目...所以这部分的需求是我自己提出来的。
> 
> 项目背景：
> 我们研究室的研究和 vr 相关，涉及到人的眼动、手脚行为等大量数据，因此我希望能有一个全研究室能共享的数据库，通过局域网可访问，并且前端界面简洁明了。
> 此外，在进行 VR 的实验时，采集的数据能自动上传到数据库。
> 
> 由此，抽象出以下项目需求
* 实现一个实验数据记录系统，可为每位实验参与者自动编号，并在实验结束后，将实验数据上传至研究室内的服务器。此外，能通过查询页面快速访问实验记录。
※ 但是在实习过程中没有进行实验，也没有局域网，因此本项目的所有内容均是在本地完成。

## 2 技术方案
* 数据库：postgreSQL
* 本地服务器：NodeJS(Express) 框架
* Express框架渲染模板：pug

## 3 各阶段任务
### 3.1 完成系统设计
* 需求确认
* 系统技术栈确认
* 各画面及画面迁移设计
* 数据结构设计：各库数据种类，主键等
### 3.2 开发环境构筑
进行了数据库 postgreSQL、nodeJS、Express框架的安装
### 3.3 实现对数据库的增删改查
在 Express 框架下，通过 `pg.connect()` 访问数据库
### 3.4 完成各页面及其功能
1.主页 index
* 包含实验介绍，问卷问题等 
2.录入新数据 create
* 输入实验参与者姓名，自动生成对应 ID，主要作为数据库的主键使用
* 由于没有进行真正的实验，在后台生成随机数作为实验数据，录入数据库(INSERT)
* 最后进行网页的问卷调查，结果也一并录入数据库
3.查找已有数据 select
* 输入参与者姓名，在数据库中查找，并返回实验数据
### 3.5 优化页面设计和功能健全性
* 优化主页设计
* 增加表单提交检测

---

## 4 经过半年后复盘所发现的不足之处
### 4.1 HTML 没有骨架
- HTML 文件没有明显的骨架(header / footer / main等)
- HTML 的语义化基本没有，全靠的 div
- 排版竟然靠的 br
### 4.2 CSS 使用混乱
- 内嵌，内联，外联三者混用
- 各类的排序混乱，维护非常不方便
- 重复定义，不合标准等无效的语句过多
### 4.3 Express 路由的理解与使用错误
- 本来 create / select 两个二级路由即可，但是实际上居然每个页面都设置了一个 router，然后引入到了 app.js
- 命名为 create.js 的文件，里面居然写着
```
app.post('/ques', function(){...});
```
※ 我甚至开始怀疑我是不是把文件名标错了？
### 4.4 JS 回调地狱
例如查找数据的功能中，一共有以下 **5** 层缩进
```
1. 连接数据库 pgPool.connect({})
  2. 若 error，则抛出， else{}
    3. 将数据写入数据库 client.query({})
      4. 如果无法写入则抛出，else{}
        5. 处理逻辑
```

```
// 原本的代码
var querysql = {
    text:
        'SELECT starttime,finishtime,id,name FROM public."TEST_TBL" INNER JOIN public."EXAMDATA" ON public."TEST_TBL".id = public."EXAMDATA".userid  WHERE userid = $1',   //sqlのテーブル結合
    values: [id]
};

//链接DB拿开始时间，结束时间 ・　DBから開始時間と終了時間を抽出
pgPool.connect(function (err, client) {
    if (err) {
        console.log(err);
    }
    else {
        client   //获取数据
            .query(querysql, function (err, result) {
                if (err) {
                    console.log(err);
                    console.log('querySQL failed!')
                }
                else {
                    //若通过用户ID，找到了确实存在的数据　・　IDが確かに存在する場合
                    if (result.rows.length) {
                        console.log('time data Found.')
                        userName = result.rows[0].name;
                        id = result.rows[0].id;
                        foundtimedata = result.rows;  //获取数据，类型为JS对象
                        resulttobrowser = foundtimedata;   //对 JS 对象进行保存

                        //将获得的数据，分成起始时间和结束时间转化为数组
                        for (var i = 0; i < foundtimedata.length; i++) {
                            foundstarttime[i] = foundtimedata[i].starttime; //开始时间数组
                            foundfinishtime[i] = foundtimedata[i].finishtime; //结束时间数组
                        }

                        //  传送给DB的text，用户ID对应的问卷结果・　当IDのアンケート回答結果
                        console.log('find id = ' + id);
                        var querysql = {
                            text:
                                'SELECT answer FROM public."ques" WHERE ques_id = $1',
                            values: [id]
                        };

                        client   //获取アンケート結果
                            .query(querysql, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    console.log('querySQL failed!')
                                }
                                else {
                                    if (result.rows.length) {
                                        console.log(result);
                                        var quesans = new Array();

                                        for (var i = 0; i < 3; i++) {
                                            if (typeof (result.rows[i]) == "undefined") {
                                                console.log("not found;");
                                                quesans[i] = "無";
                                            }
                                            else {
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
                }
            });
    }
});
```
> 注：因为最后的渲染模板页面是同步任务，而取得数据库的数据是异步任务，所以在不使用 promise 的情况下必须层层嵌套 --> 回调地狱
> 
> 以下是修改版，因为没有实际跑过所以不知道能否正确运行，总之记录下思路吧
``` Javascript
// 连接数据库，成功则返回 client 对象
function accessDatabase() {
    return new Promise((resolve, reject) => {
        pgPool.connect(function (err, client) {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                resolve(client);
            }
        }
    }
}

// 对数据库进行操作，成功则返回取出的数据
function getData(client, querysql) {
    return new Promise((resolve, rejecct) => {
        client.query(querysql, function (err, res) {
            if (err) {
                console.log('getData failed!')
                reject(err)
            }
            else {
                resolve(res)
            }
        })
    })
}

// 总的 async 函数，内部使用 await 控制异步操作
async function renderPage() {
    try {
        let client = await accessDatabase();
        let result1 = await getData(client,querysql1);
        // 对 result1 进行正确性判断
        // ...判断函数
        let result2 = await getData(client,querysql2);
        // 对 result2 进行正确性判断
        // ...判断函数
        let data = dataFormat(result1, result2)
        routerRes.render(data);
    } catch (e) {
        console.log(e);
    }
}
```

## 5 项目总结
> 作为前端学习的启蒙项目，当时的实习，最近的复盘，一套走下来收获很大！
1. 本项目涉及到了基本的前端操作
* 利用 HTML / CSS 进行网页搭建
  * 基本的表单提交
  * 基本的样式设定
  * 糊里糊涂弄出来的轮播图和指针悬浮缩放
* 利用 JS 进行基本的逻辑判断
  * 提交表单的正确性验证
  * 非常遗憾的是，由于当时并没有跟着教程走，而是乱玩，基本的 DOM 操作等并没有涉及到
2. 基本的后端知识和操作
* 数据库知识
* 后端数据的读写
* postgreSQL 的基本使用方法
3. 全栈工程的设计流程（日本，国内应该不一样吧）
4. 经过复盘，加深了一些实际中应该会很常用的知识点
* 异步操作
* Express框架
* 前端路由等


