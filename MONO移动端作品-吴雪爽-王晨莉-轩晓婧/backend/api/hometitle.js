const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = require("path");//设置路径
let titleLinkData ={};

fs.readFile(path.join(__dirname, '../data/indextitlelink.json'), (error, data) => {
	console.log(data)
	  titleLinkData = {
	    list: JSON.parse(data.toString())
	  }
})

router.get("/hometitle",(req,res)=>{
	//获取到get请求的数据

	console.log(req.query);

	let {random,userName} = req.query;
	res.send({	
		code:0,
		message:"数据请求成功",	
		data:titleLinkData
	});
});

module.exports = router;