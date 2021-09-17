/*
 *  入口文件
 *
 */

const express = require('express');
const router = require('./router.js');
const path = require('path');
//const template = require('art-template');
const bodyParser = require('body-parser');
const app = express();

//启动静态资源服务
//app.use('/www', express.static('public'));

//设置模板的路径
//app.set('views', path.join(__dirname, 'views'));

//设置模板引擎
//app.set('view engine', 'art');

//使express兼容art-template模板引擎
//app.engine('art', require('express-art-template'));

//处理请求参数
//挂载参数处理中间件（post）, 这个主要用于form表单提交的数据处理
app.use(bodyParser.urlencoded({ extended: false }));
//处理json格式的参数，用于json数据处理
app.use(bodyParser.json());

//启动服务器功能
/*
 *
 *  服务器功能分为：
 *          1. 配置路由
 *          2. 监听端口
 */


// app.use('/', express.static('/api/private/v1/'));

//配置路由
app.use(router);

//监听端口
app.listen(3000, () => {
    console.log('Node.js 服务器已开启， 地址：http:127.0.0.1:3000/api/private/v1/');
})
