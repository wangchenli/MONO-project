const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = require("path");//设置路径
//  /api/users
let booksData ={};

fs.readFile(path.join(__dirname, '../data/books.json'), (error, data) => {
	  booksData = {
	    list: JSON.parse(data.toString())
	  }
})

router.get("/books",(req,res)=>{
	//获取到get请求的数据

	let {random,userName} = req.query;
	res.send({	
		code:0,
		message:"数据请求成功",	
		data:booksData
	});
});

module.exports = router;