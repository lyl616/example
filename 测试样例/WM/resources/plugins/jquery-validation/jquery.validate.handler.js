/*-------jQuery.validate验证插件扩展验证方法---------*/

jQuery.extend(jQuery.validator.messages, {
   required: "不能为空",
   remote: "输入有重复",
   email: "请输入正确格式的电子邮件",
   url: "请输入合法的网址",
   date: "请输入合法的日期",
   dateISO: "请输入合法的日期 (ISO).",
   number: "请输入合法的数字",
   digits: "只能输入整数",
   creditcard: "请输入合法的信用卡号",
   equalTo: "两次输入的密码不一致",
   accept: "请输入拥有合法后缀名的字符串",
   maxlength: jQuery.validator.format("长度最多是 {0} 的字符串"),
   minlength: jQuery.validator.format("长度最少是 {0} 位"),
   rangelength: jQuery.validator.format("长度介于 {0} 和 {1} 之间的字符串"),
   range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
   max: jQuery.validator.format("请输入一个最大为{0} 的值"),
   min: jQuery.validator.format("请输入一个最小为{0} 的值")
 });
// 特殊字符
$.validator.addMethod("isSpecialChar", function(value, element) {
	return this.optional(element) || validateString(value);
}, "<font color='red'>含有非法字符</font>");

// 汉字
$.validator.addMethod("chcharacter", function(value, element) {
	var tel = /^[u4e00-u9fa5]+$/;
	return this.optional(element) || tel.test(value);
}, "<font color='red'>请输入汉字</font>");

// 联系电话(手机/固话皆可)验证
$.validator.addMethod("isPhone", function(value, element) {
	var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
	var tel = /^(\d{3,4})?-?\d{7,9}$/;
	return this.optional(element) || mobile.test(value) || tel.test(value);
}, "<font color='red'>号码格式错误</font>");

// 字母数字
$.validator.addMethod("charAndAlnum", function(value, element) {
	var al = /^[a-zA-Z0-9]+$/;
	return this.optional(element) || al.test(value);
}, "<font color='red'>只能是字母和数字</font>");

// 邮箱
$.validator.addMethod("isEmail", function(value, element) {
	var al = /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
	return this.optional(element) || al.test(value);
}, "<font color='red'>请输入合理的邮箱！</font>");

//选择框必选
function requiredSelect(msg){
	$.validator.addMethod("reSelect", function(value, element) {
		if(value=='请选择' || value == null || "" == value){
			return false;
		}else{
			return true;
		}
	}, msg);
}
/*-----------jQuery.validate验证插件扩展验证方法   结束--------------*/

// 验证非法字符。
function validateString(data) {
	var regexp = new RegExp("[<>||'|!=:?,]+", "ig"); // 字符串中出现<>||'|等将判断为特殊字符
	if (regexp.test(data))
		return false;
	return true;
}
