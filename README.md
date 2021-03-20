# FullStackProject
> 在NISHIMU電子工業株式会社实习的时候学来的皮毛，打算之后再深入学习，完善项目。
> 
> 传统日企的实习一般时常比较短，也对技术要求不是很高，主要以体验职场环境为主。
> 在该项目之前，我连 js 是什么东西都不知道（比如会问js和java什么关系？）
> 所以虽然功能实现了，但是这个代码写得实在是千奇百怪。
> 不过经过复盘，也能加深了相关知识的理解。

## 1 需求分析
> mentor 没有给我提出项目的任务，而是问我想做一个什么样子的项目...所以这部分的需求是我自己提出来的。
> 项目背景：
> 我们研究室的研究和 vr 相关，涉及到人的眼动、手脚行为等大量数据，因此我希望能有一个全研究室能共享的数据库，通过局域网可访问，并且前端界面简洁明了。
> 此外，在进行 VR 的实验时，采集的数据能自动上传到数据库。
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
在 Express 框架下，通过 pg.connect() 访问数据库
### 3.4 实现各页面
1.为了区分「新增实验」和「查找数据」，设置两个二级路由
