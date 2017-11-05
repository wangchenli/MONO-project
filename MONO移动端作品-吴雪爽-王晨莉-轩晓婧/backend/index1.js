const express = require('express');
const proxy = require('http-proxy-middleware');//引入代理中间件
const app = express();

const fs = require('fs');
const bodyParser = require('body-parser')
let path = require("path");//设置路径

//-------------------解析post配置
// for parsing application/json
app.use(bodyParser.json());  // 客户端发送过来的json格式
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 


//设置静态文件目录：
app.use(express.static('./public'));

// 添加一系列请求头:解决跨域问题
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

//将请求的接口配置放到了api文件夹下，在api文件夹下建立了一个users.js文件来配置这些接口及返回的数据
const userApi = require("./api/users.js");//将api文件夹下的users接口文件引入进来;主页请求的接口音乐请求的接口
const musicApi = require("./api/music.js");//将api文件夹下的music接口文件引入进来;音乐请求的接口
const booksApi = require("./api/books.js");//将api文件夹下的book接口文件引入进来;图书请求接口
const movieApi = require("./api/movie.js");//将api文件夹下的book接口文件引入进来;图书请求接口
const findApi = require("./api/find.js");//将api文件夹下的find接口文件引入进来;图书请求接口
const comunityApi = require("./api/comunity.js");//将api文件夹下的find接口文件引入进来;图书请求接口
app.use('/api',userApi);//中间件
app.use('/api',musicApi);//中间件musicApi
app.use('/api',booksApi);//中间件booksApi
app.use('/api',movieApi);//中间件movieApi
app.use('/api',findApi);//中间件findeApi
app.use('/api',comunityApi);//中间件comunityApi




//设置页面刷新后请求接口发送的数据,页面刷新后是在根路径下需要发送get请求，路径为“/”
let showData ={};
fs.readFile(path.join(__dirname, 'data/index.json'), (error, data) => {
	console.log(data)
  showData = {
    list: JSON.parse(data.toString())
  }
})
app.get("/",(req,res)=>{
  console.log("有请求来了");
  res.send({
		data:showData
	});
});



//192.168.0.103
let host = 'localhost';
let port = '3200'
app.listen(port,host,()=>{
    console.log('http://'+host+':'+port);
});
