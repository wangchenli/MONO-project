const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = require("path");//设置路径
//  /api/users
let musicData ={};

fs.readFile(path.join(__dirname, '../data/music.json'), (error, data) => {
	  musicData = {
	    list: JSON.parse(data.toString())
	  }
})

router.get("/music",(req,res)=>{
	//获取到get请求的数据

	let {random,userName} = req.query;
	res.send({	
		code:0,
		message:"数据请求成功",	
		data:musicData
	});
});

module.exports = router;