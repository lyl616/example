function DateHelp(obj) {
	/*var obj = {
	 date:'2015-02-01',//从此日期开始计算
	 type:'month',//以年月日向前计算：年（year），月（month），日（day）
	 value:'14',//向前计算的数值，年月日
	 format:'yyyy/mm/dd'//日期格式
	 }*/

	this.date = obj.date;
	this.type = obj.type;
	this.value = obj.value == undefined ? obj.value : 0;
	this.format = obj.format == undefined ? obj.format : 'yyyy/MM/dd';

	//日期和非日期格式获取年月日
	if(this.date instanceof Date) {
		//处理传进来的是日期函数的

		this.year = this.date.getFullYear();
		this.month = this.date.getMonth() + 1;
		this.day = this.date.getDate();
		this.hour = this.date.getHours();
		this.minus = this.date.getMinutes();
		this.secound = this.date.getSeconds();
	} else {
		//处理传入的是非日期函数的

		this.year = this.date.substr(0, 4);
		this.month = this.date.substr(5, 2);
		this.day = this.date.substr(8, 2);
		this.hour = this.date.substr(11, 2);
		this.minus = this.date.substr(14, 2);
		this.secound = this.date.substr(17, 2);
	}

}

DateHelp.prototype.beforeDate = function(type, value) {

	var _type = type || this.type,
		_value = value || this.value,
		_year = this.year,
		_month = this.month,
		_day = this.day;

	if(_type == 'year' || _type == '年') {
		_year -= _value;
	} else if(_type == 'month' || _type == '月') {
		_year -= parseInt(_value / 12);
		_month -= _value % 12;
		if(_month <= 0) {
			_year -= 1;
			_month += 12;
		}
	} else if(_type == 'day' || _type == '日') {

	} else {

	}

	var date = new Date(_year, _month - 1, _day)
	return this.formatDate(date, this.format);
}

DateHelp.prototype.formatDate = function(date, fmt) {

	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}