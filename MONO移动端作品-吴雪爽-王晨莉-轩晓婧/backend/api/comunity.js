const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = require("path");//设置路径
//  /api/users
let comunityData ={};

fs.readFile(path.join(__dirname, '../data/comunity.json'), (error, data) => {
	console.log(data)
	  comunityData = {
	    list: JSON.parse(data.toString())
	  }
})

router.get("/comunity",(req,res)=>{
	//获取到get请求的数据

	res.send({	
		code:0,
		message:"数据请求成功",	
		data:comunityData
	});
});

module.exports = router;