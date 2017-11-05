const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = require("path");//设置路径
//  /api/users
let movieData ={};

fs.readFile(path.join(__dirname, '../data/movie.json'), (error, data) => {
	console.log(data)
	  movieData = {
	    list: JSON.parse(data.toString())
	  }
})

router.get("/movie",(req,res)=>{
	//获取到get请求的数据

	console.log(req.query);

	let {random,userName} = req.query;
	res.send({	
		code:0,
		message:"数据请求成功",	
		data:movieData
	});
});

/*router.get("/",(req,res)=>{
	//获取到get请求的数据

	console.log(req.query);

	res.send({
		data:movieData
	});
});
*/

// /api/post-users
router.post("/post-users",(req,res)=>{
	console.log(req.body);//{userName:"Lily"}
	let {userName} = req.body;
	res.send({
		code:0,
		message:"ok"
	});
});

module.exports = router;