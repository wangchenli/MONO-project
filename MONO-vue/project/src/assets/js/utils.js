
let utils = (function (){
	function $(selector,context){
	//拿到第一个字符
	selector = selector.trim();  // 去除前后空格

	if(!context){  // 如果context没有接受任何值，contex为document
		context = document;
	}

	if(selector.indexOf(" ") !== -1){  // 判断是有空格，交给querySelectorAll处理
		return context.querySelectorAll(selector);
	}

	var firstChar = selector.charAt(0);

	

	if(firstChar === '#'){  // id获取
		// 截取字符串一部分
		return document.getElementById(selector.slice(1));
	}else if(firstChar === '.'){  // className获取
		return context.getElementsByClassName(selector.slice(1))
	}else{ //tagName
		return context.getElementsByTagName(selector);
	}
}

function css(element,prop,value){
	if(prop == "scale" || prop == "scaleX" 
	|| prop == "scaleY"|| prop == "scaleZ"
	|| prop == "rotate"|| prop == "rotateX"
	|| prop == "rotateY"|| prop == "rotateZ"
	|| prop == "skewX"|| prop == "skewY"
	|| prop == "translateX"|| prop == "translateY"
	|| prop == "translateZ"){
		// 如果是transform属性，就执行cssTransform这个歌函数
		return cssTransform(element,prop,value)
	}
	// 判断argumnets的length
	if(arguments.length>2){
		// 设置
		element.style[prop] = value;
	}else{
		// 获取
		return parseFloat(getComputedStyle(element)[prop]);
	}
}

function cssTransform(element,prop,value){
	if(!element.transform){
		element.transform = {};
	}
	// 判断argumnets的length
	if(arguments.length>2){
		// 设置
		element.transform[prop] = value;
		// 把设置的值同步到元素的属性中去
		// 注意写法：比如 scale() 小括号里才是value值；并且不同属性的单位不尽相同，所以要判断一下
		// element.style.WebkitTransform = element.style.transform = prop + "("+value+"deg)"
		let transformVal = "";
		for(let s in element.transform){
			switch(s){
				// 缩放没有单位
				case "scale":
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					// 属性之间加上空格，不加的话有些浏览器会自动纠错，但是有些可能不会
					transformVal += " "+ s + "("+(element.transform[s]/100)+")";
					break;
				// 旋转和斜切的单位是deg
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					transformVal += " "+ s + "("+element.transform[s]+"deg)";
					break;
				default: // 剩下的就是位移，单位是px
					transformVal += " "+ s + "("+element.transform[s]+"px)";
			}                    
		}
		element.style.WebkitTransform = element.style.transform = transformVal;
	}else{
		// 获取
		if(typeof element.transform[prop] === "undefined"){ // 如果该prop值没有被设置过（是undefined），就返回默认值
			// 注意不要直接取反（!element.transform[prop]）否则如果该prop值为0，也会被判定为true
			// 如果是缩放（scale），设置初始值为100
			switch(prop){
				case "scale":
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					element.transform[prop] = 100;
					break;
				default: // 如果不是缩放（说明是translate，rotate，skew），就设置默认值为0
					element.transform[prop] = 0;
			}
		}
		return element.transform[prop];
	}
}

/*
* t : time 已过时间
* b : begin 起始值
* c : count 总的运动值
* d : duration 持续时间
*
* 曲线方程
*
* http://www.cnblogs.com/bluedream2009/archive/2010/06/19/1760909.html
* */

//Tween.linear();

var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //*正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){//*
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}

/*
	参数：
		element 要运动的元素    *
		attr 运动的属性			*
		target 目标位置			*
		duration 持续时间 ms    *

		fx 运动形式   默认值为"linear"  []
		callBack  调函数
*/
function mTween(element,attr,target,d,fx,callback){
	var b = parseFloat(getComputedStyle(element)[attr]);  // 起始位置
	var c = target - b; //总距离
	var now = Date.now();  // 开始运动的时间

	fx = fx || 'linear'; //运动形式

	clearInterval(element.timer);  //使用之前先清除
	element.timer = setInterval(function (){
		var t = Date.now() - now; //已过去时间

		if( t > d ){
			t = d;
			clearInterval(element.timer);
			element.timer = null;
			

		}

		element.style[attr] = Tween[fx](t, b, c, d) + 'px';
		// 执行callback的时机，是在已过去时间与持续时间相同
		// 并且元素到目标位置了，再执行callback
		if(t == d){
			typeof callback === 'function' && callback();
		}
		
	},4)

}

// 获取当前屏幕的宽高
function view(){
	return {
		w: document.documentElement.clientWidth,
		h: document.documentElement.clientHeight
	}
}

/* function setRem(){
	let html = document.documentElement;
	let width = html.clientWidth;
	html.style.fontSize = width/46 +'px';
}
setRem() */

return {
	mTween,
	view,
	css,
	cssTransform
}
})()
export default utils
