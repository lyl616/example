$(document).ready(function(e) {
	SetProgressTime('progres01', progres01, true);
	SetProgressTime('progres02', progres02, true);
	getCityTendency();
});
var charts = []; //存储小时和天 曲线对象
var _speed = 5000,
	myfun; //执行方法，当前时间为参数
var progres01 = new ScrollBar(),
	progres02 = new ScrollBar(),
	progres03 = new ScrollBar(),
	progres04 = new ScrollBar();
initProgressHour();

function initProgressHour() {
	progres01.objID = 'progres01';
	progres01.type = 'hour';
	progres01.startTime = initTime.hour.end;
	progres01.endTime = initTime.hour.start;
	progres01.Value = function(obj) {
		var valite = false;
		ScrollBar = progres01;
		// 鼠标移入进度条时小滑块显示
		obj.find(".scrollBarBox").mouseover(function(event) {
			obj.find(".timecode").show();
		});
		// 鼠标移除进度条时小滑块消失
		obj.find(".scrollBarBox").mouseout(function(event) {
			obj.find(".timecode").hide();
		});
	}
	progres02.type = 'hour';
	progres02.objID = 'progres02';
	progres02.startTime = initTime.hour.end;
	progres02.endTime = initTime.hour.start;
	progres02.Value = function(obj) {
		var valite = false;
		ScrollBar = progres02;
		// 鼠标移入进度条时小滑块显示
		obj.find(".scrollBarBox").mouseover(function(event) {
			obj.find(".timecode").show();
		});
		// 鼠标移除进度条时小滑块消失
		obj.find(".scrollBarBox").mouseout(function(event) {
			obj.find(".timecode").hide();
		});
	}
}

function initProgressDay() {
	progres03.type = 'day';
	progres03.objID = 'progres03';
	progres03.startTime = initTime.day.end;
	progres03.endTime = initTime.day.start;
	progres03.Value = function(obj) {
		var valite = false;
		ScrollBar = progres03;
		// 鼠标移入进度条时小滑块显示
		obj.find(".scrollBarBox").mouseover(function(event) {
			obj.find(".timecode").show();
		});
		// 鼠标移除进度条时小滑块消失
		obj.find(".scrollBarBox").mouseout(function(event) {
			obj.find(".timecode").hide();
		});
	}

	progres04.type = 'day';
	progres04.objID = 'progres04';
	progres04.startTime = initTime.day.end;
	progres04.endTime = initTime.day.start;
	progres04.Value = function(obj) {
		var valite = false;
		ScrollBar = progres04;
		// 鼠标移入进度条时小滑块显示
		obj.find(".scrollBarBox").mouseover(function(event) {
			obj.find(".timecode").show();
		});
		// 鼠标移除进度条时小滑块消失
		obj.find(".scrollBarBox").mouseout(function(event) {
			obj.find(".timecode").hide();
		});
	}
}

function getCityTendency() {
	var params = {
		startTime: ScrollBar.startTime,
		endTime: ScrollBar.endTime,
		dateType: weatherVM.queryParams.dateType,
		doMainId: parent.domainId
	};
	ajax(coreApiPath + "/stationNew/query/city/tendencyChart", params, function(data) {
		if(data.erroCode == 2000) {
			var charMap = data.result.charMap;
			var tableMap = data.result.tableMap;
			if(weatherVM.queryParams.dateType == "2") {
				initchart("time-chart", charMap);
				setWeekHtml("progres02", ScrollBar.startTime, ScrollBar.endTime, tableMap); //设置进度条显示html 内
				initchart("day-chart", charMap);
			} else if(weatherVM.queryParams.dateType == "3") {
				setDayHtml("progres04", ScrollBar.startTime, ScrollBar.endTime, tableMap); //设置进度条显示html 内
			}
		} else {
			layer.msg("加载失败！")
			closeLayreLoader();
			return false;
		}
	});
}

function openPanle(id, progObj, type, openProg) {
	//	同步当前进度条和打开的进度条的进度

	openProg._index = progObj._index;
	var obj1 = $('#' + progObj.objID),
		img = obj1.find('.progressTime_control');
	$(img).attr("title", "暂停");
	progressTimeControl(img, progObj.objID, progObj, type); //判断进度条的当前状态，并决定是否播放
	//展示后的大面板
	var obj = $('#' + id);
	obj.show();
	$('#' + id + ' .changeChars-btn').css("background-image", "url(" + $.ctx + "/resources/img/t-close.png)");
	var scrollBarWidth = obj.find(".scrollBar").width(),
		currentValue = progObj._index * scrollBarWidth / progObj.maxValue;
	if((currentValue + 1) >= scrollBarWidth) { //跑到最右边
		obj.find(".scroll_Thumb").css("margin-left", scrollBarWidth - 1 + "px");
		obj.find(".scroll_Track").css("width", scrollBarWidth + 2 + "px");
		openProg._index = openProg.maxValue;
	} else if(currentValue <= 0) { //最左边的时候
		obj.find(".scroll_Thumb").css("margin-left", "0px");
		obj.find(".scroll_Track").css("width", "0px");
		openProg._index = 0;
	} else { //进度条样式
		openProg._index = Math.round(currentValue * openProg.maxValue / scrollBarWidth); //当前位置*单份天进度的宽度
	}
	openProg._index = openProg._index;
	obj.find(".scroll_Thumb").css("margin-left", currentValue + "px");
	obj.find(".scroll_Track").css("width", currentValue + 2 + "px");

	if(type == 'day') {
		SetDayTime(openProg._index, obj, openProg);
	} else {
		SetTime(openProg._index, obj, openProg);
	}
}

function initchart(id, charMap) {
	var myChart = echarts.init(document.getElementById(id));
	var data = charMap.data;
	var date = charMap.xAxis;
	var option = {
		xAxis: {
			type: 'category',
			show: false,
			boundaryGap: false,
			data: date
		},
		yAxis: {
			type: 'value',
			show: false,
			boundaryGap: [0, '100%']
		},
		grid: {
			left: "0",
			top: 0,
			right: 0,
			bottom: 0
		},
		series: [{
			name: '模拟数据',
			type: 'line',
			smooth: true,
			symbol: 'none',
			sampling: 'average',
			itemStyle: {
				normal: {
					color: '#eee' //绿
				}
			},
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0.1,
							color: '#7E0023'
						}, {
							offset: 0.2,
							color: '#99004C'
						}, {
							offset: 0.3,
							color: '#FF0200'
						},
						{
							offset: 0.4,
							color: '#FF7B00'
						},
						{
							offset: 0.6,
							color: '#FFCF00'
						},
						{
							offset: 1,
							color: '#00E41D'
						}
					])
				}
			},
			data: data
		}]
	};
	myChart.setOption(option);
	charts.push(myChart);
}

function closePanle(id) {
	$('#' + id).hide();
}

function getDataTime(dataval) {
	var getDateV = new Date(dataval),
		Year = getDateV.getFullYear(),
		Month = (getDateV.getMonth() + 1) < 10 ? "0" + (getDateV.getMonth() + 1) : (getDateV.getMonth() + 1),
		currentDate = getDateV.getDate() < 10 ? "0" + getDateV.getDate() : getDateV.getDate(),
		Hours = getDateV.getHours() < 10 ? "0" + getDateV.getHours() : getDateV.getHours(),
		Minutes = getDateV.getMinutes() < 10 ? "0" + getDateV.getMinutes() : getDateV.getMinutes(),
		Seconds = getDateV.getSeconds() < 10 ? "0" + getDateV.getSeconds() : getDateV.getSeconds();
	return {
		'Year': Year,
		'Month': Month,
		'currentDate': currentDate,
		'Hours': Hours,
		'Minutes': Minutes,
		'Seconds': Seconds
	};
}

function setWeekHtml(id, startTime, endTime, tableData) {
	var parentObj = $('#' + id);
	parentObj.find(".progressTime").show();
	// 开始时间
	var startDate = getDataTime(startTime);
	var indexStart2 = '历史' + " " + startDate.Hours + ":" + startDate.Minutes,
		indexStart3 = startDate.Hours + ":" + startDate.Minutes,
		firstStart = startDate.Year + "-" + startDate.Month + "-" + startDate.currentDate;
	// 结束时间
	var endDate = getDataTime(endTime),
		lastEnd = endDate.Year + "-" + endDate.Month + "-" + endDate.currentDate;
	parentObj.find(".startTime").text(startTime);
	parentObj.find(".endTime").text(endTime);
	// 得到总天数
	function getDateDiff(date1, date2) {
		var time1 = date2,
			time2 = date1;
		time1 = Date.parse(time1) / 1000;
		time2 = Date.parse(time2) / 1000;
		var time_ = time1 - time2;
		return(time_ / (3600 * 24));
	}

	var dateNum = getDateDiff(firstStart, lastEnd);
	var str = '',
		datalistContainer = false,
		listhtml = '';
	if(parentObj.find(".time-dataShowc").length) { //判断是否有曲线面板
		datalistContainer = true;
	}
	var beginTime = new Date(startTime).Format("yyyy-MM-dd HH:00:00");
	for(var i = 0; i < dateNum; i++) {
		var d1 = new Date(startTime),
			d2 = new Date(d1);
		d2.setDate(d1.getDate() + i);
		var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六"),
			week = weekArray[new Date(d2).getDay()],
			monthNum = d2.getDate() < 10 ? "0" + d2.getDate() : d2.getDate();
		var monthVal = new Date(d2).getMonth() + 1;
		str += '<div class="time-dayVal">';
		str += '  <div class="time-scale"><span>00</span><span>03</span><span>06</span><span>09</span><span>12</span><span>15</span><span>18</span><span>21</span></div>';
		str += '  <div class="week-day">' + monthVal + "-" + monthNum + " " + week + '</div>';
		str += '</div>';
		if(datalistContainer && tableData != null) { //8个时间段
			for(var m = 0; m < 8; m++) {
				var row = tableData[beginTime];
				if(typeof(row) != 'undefined' && row != null) {
					listhtml += '<div class="pollutiond-list">' +
						'<span>' + showUpper(row.aqi_first) + '</span>' +
						'<span>' + row.aqi + '</span>' +
						'<span>' + row.temperature + '</span>' +
						'<span>' + row.humidity + '</span>' +
						'<span>' + row.wind_power + '</span>' +
						'<span>' + getWinDriection(row.wind_direction) + '</span>' +
						'</div>';
				}
				beginTime = hourIncre(beginTime, 3);
			}
		}
	}
	parentObj.find(".time_slot").html(str);
	if(datalistContainer) {
		parentObj.find(".time-dataShowc").html(listhtml);
	}
	parentObj.find(".time_slot .time-dayVal").css({
		"width": "calc(" + 100 / dateNum + "% - 1px)"
	});
	parentObj.find(".time_slot .time-scale span").css({
		"width": "calc(" + 100 / 8 + "% - 0px)"
	});
	parentObj.find(".pollutiond-list").css({
		"width": "calc(" + 100 / dateNum / 8 + "% - 0px)"
	});
}

function getWinDriection(wind_direction) {
	if(wind_direction == "") {
		return ""
	} else {
		return '<img src="' + ctx + '/resources/img/airdata/16/' + wind_direction[0] + '.png" width="20" height="15">'
	}
}

function setDayHtml(id, startTime, endTime, tableData) {
	var parentObj = $('#' + id);
	parentObj.find(".progressTime").show();
	// 开始时间
	var dateMonthArr = new Array(),
		startDate = getDataTime(startTime);
	var indexStart2 = startDate.Month + "-" + startDate.currentDate,
		firstStart = startDate.Year + "-" + startDate.Month + "-" + startDate.currentDate;
	// 结束时间
	var endDate = getDataTime(endTime),
		lastEnd = endDate.Year + "-" + endDate.Month + "-" + endDate.currentDate;
	parentObj.find(".scroll_Thumb").html(firstStart); //时间进度指示标，黄色
	parentObj.find(".timecode").html(indexStart2); //时间进度指示标，移上去显示黑色背景部分
	parentObj.find(".startTime").text(startTime);
	parentObj.find(".endTime").text(endTime);

	function getDateDiff(date1, date2) {
		var time1 = date2,
			time2 = date1;
		time1 = Date.parse(time1) / 1000;
		time2 = Date.parse(time2) / 1000;
		var time_ = time1 - time2;
		return {
			"dateNum": (time_ / (3600 * 24))
		};
	}
	var str = listhtml = '',
		datalistContainer = false,
		dateNum = getDateDiff(firstStart, lastEnd).dateNum;
	if(parentObj.find(".time-dataShowc").length) { //判断是否有曲线面板
		datalistContainer = true;
	}

	function outRepeat(a) { //数组去重，并求出重复的数据个数
		var res = [],
			_res = [],
			json = {};
		for(var i = 0; i < a.length; i++) {
			if(!json[a[i]]) {
				res.push(a[i]);
				json[a[i]] = 1;
			}
		}
		for(var i = 0; i < res.length; i++) {
			var count = 0;
			for(var j = 0; j < a.length; j++) {
				if(res[i].toString() == a[j].toString()) {
					count++;
				}
			}
			res[i][1] = count;
			_res.push(res[i]);
		}
		return _res;
	}

	function getyearMonthNum() {
		var html = '',
			weekdayhtml = '',
			comphtml = '',
			arr = [];
		html += '<div class="time-scale">';
		for(var i = 0; i <= dateNum; i++) {
			var copyhtml = '',
				trr = [];
			var d1 = new Date(startTime),
				d2 = new Date(d1);
			d2.setDate(d1.getDate() + i);
			var year = new Date(d2).getFullYear(),
				monthNum = d2.getDate() < 10 ? "0" + d2.getDate() : d2.getDate(),
				month = (new Date(d2).getMonth() + 1) < 10 ? (new Date(d2).getMonth() + 1) : (new Date(d2).getMonth() + 1);
			copyhtml = month + "月";
			trr[0] = month;
			html += '<span>' + monthNum + '</span>';
			if(copyhtml != comphtml) {
				comphtml = month + "月";
				weekdayhtml += '<div class="week-day">' + comphtml + '</div>';
			}
			arr.push(trr);
		}
		html += '</div>';
		html += weekdayhtml;
		arr = outRepeat(arr);
		return {
			'html': html,
			'resArrlength': arr
		};
	}

	var htmlObj = getyearMonthNum();
	var totaldataNum = 0;
	for(var i = 0; i < htmlObj.resArrlength.length; i++) { //获取天的个数，非固定值（30）
		totaldataNum += htmlObj.resArrlength[i][1];
	}
	str += '<div class="time-dayVal">';
	str += htmlObj.html;
	str += '</div>';
	var beginTime = new Date(startTime).Format("yyyy-MM-dd 00:00:00"); //时间格式转换yyyy-MM-dd 00:00:00
	var listhtml = '';
	if(datalistContainer && tableData) { //天时间段
		for(var m in tableData) {
			var row = tableData[beginTime];
			if(typeof(row) != 'undefined' && row != null) {
				listhtml += '<div class="pollutiond-list">' +
					'<span>' + showUpper(row.aqi_first) + '</span>' +
					'<span>' + row.aqi + '</span>' +
					'<span>' + row.temperature + '</span>' +
					'<span>' + row.humidity + '</span>' +
					'<span>' + row.wind_power + '</span>' +
					'<span>' + getWinDriection(row.wind_direction) + '</span>' +
					'</div>';
			}
			beginTime = hourIncre(beginTime, 24);
		}
	}
	parentObj.find(".time_slot").html(str);

	if(datalistContainer) { //设置污染面板中的污染值的html
		parentObj.find(".time-dataShowc").html(listhtml);
	}
	parentObj.find(".pollutiond-list").css({ //设置各个污染刻度的宽度
		"width": "calc(" + 100 / totaldataNum + "% - 0px)"
	});
	parentObj.find(".time_slot .time-dayVal").css({
		"width": "100%"
	});
	parentObj.find(".time_slot .time-scale span").css({
		"width": "calc(" + 100 / totaldataNum + "% - 0px)"
	});

	for(var i = 0; i < htmlObj.resArrlength.length; i++) { //设置底部的月份的百分比样式
		parentObj.find(".time_slot .week-day").eq(i).css({
			"width": "calc(" + (100 / totaldataNum) * htmlObj.resArrlength[i][1] + "% - 0px)",
			"display": "inline-block",
			"float": 'left'
		});
	}
}

function SetProgressTime(id, srolbarObj, fg) {
	var parentObj = $('#' + id);
	ScrollBar = srolbarObj;
	if(fg) {
		setWeekHtml(id, ScrollBar.startTime, ScrollBar.endTime, null); //设置进度条显示html 内容		
		ScrollBar.maxValue = Math.abs(new Date(ScrollBar.startTime) - new Date(ScrollBar.endTime)) / 1000 / 60 / 60; //设置最大值（小时为单位）
	} else {
		setDayHtml(id, ScrollBar.startTime, ScrollBar.endTime, null); //设置进度条显示html 内容
		//debugger
		ScrollBar.maxValue = Math.abs(new Date(ScrollBar.startTime) - new Date(ScrollBar.endTime)) / 1000 / 60 / 60 / 24 + 1; //设置最大值	（天为单位）
	}
	ScrollBar.Initialize(parentObj); //初始化
}
//滑块
function ScrollBar() {
	var o = new Object();
	o._mProgressTimer; //定时器
	o.value = 0;
	o.secondInit = true;
	o.maxValue = 40; //两个时间中间间隔的小时最大值
	o.step = 1;
	o._index = 0; //进度
	o.currentX = 0; //当前x轴的位置
	o.objID = null;
	o.stepArr = []; //记录所有的位置和位置对应的时间值
	o.daystepArr = []; //记录天的所有的位置和位置对应的时间值
	o.overFlowIndex = 0; //记录当前超出的位置
	o.isFormStartPlay = false; //是否从头开始播放
	o.isplay = false;
	o.getOverflowIndex = function(arr) {
		for(var i = 0; i < arr.length; i++) {
			if(arr[i].isCurrTime) {
				o.overFlowIndex = i;
			}
		}
	}
	o.setCurrTimelineCss = function(obj) {
		obj.find(".currTime_line").hide();
		if(obj[0].id == 'progres01') {
			$('#progres02').find(".currTime_line").hide(); //如果是小时进度的时候，小时的大面板的当前小时的间隔线也隐藏
		}
		for(var i = 0; i < this.stepArr.length; i++) {
			if(this.stepArr[i].isCurrTime) {
				obj.find(".currTime_line").show();
				if(obj[0].id == 'progres01') {
					$('#progres02').find(".currTime_line").show(); //如果是小时进度的时候，小时的大面板的当前小时的间隔线也隐藏
				}
				obj.find(".currTime_line").css("left", this.stepArr[i].index / this.maxValue * obj.find(".scrollBar").width() + "px");
				this.SetValue(this.stepArr[i].index, obj); //设置当前的显示位置
				SetTime(this.stepArr[i].index, obj, '');
			}
		}
	}
	o.setProgTooltip = function(obj) { //设置黄色标签的位置

		for(var i = 0; i < this.stepArr.length; i++) {
			if(this.stepArr[i].isCurrTooltip) {
				this.SetValue(this.stepArr[i].index, obj); //设置当前的显示位置
				SetTime(this.stepArr[i].index, obj, '');
				return;
			}
		}

	}
	o.setDayProgTooltip = function(obj) { //设置黄色标签的位置
		for(var i = 0; i < this.daystepArr.length; i++) {
			if(this.daystepArr[i].isCurrTooltip) {
				this.SetValue(this.daystepArr[i].index, obj); //设置当前的显示位置
				SetDayTime(this.daystepArr[i].index, obj, '');
				return;
			}
		}
	}
	o.Initialize = function(obj) {

		if(this._index > this.maxValue) {
			alert("给定当前值大于了最大值");
			return;
		}
		if(this.secondInit) {
			this.GetValue(obj);
			this.secondInit = false;
		}
		//初始化标识当前时间的线的位置
		if(this.type == 'hour') {
			this.calcCurrIndex();
			this.setCurrTimelineCss(obj);
			this.setProgTooltip(obj);
		} else {
			this.calcDayCurrIndex();
			this.setDayProgTooltip(obj);
		}
		this.judgeIsStartPlay();
		this.Value(obj);
	}
	o.judgeIsStartPlay = function() { //判断是否从头开始播放
		if(this.objID != "progres03" && this.objID != "progres04") { //天的数据没有超时暂停
			this.getOverflowIndex(this.stepArr);
			if(this.overFlowIndex < this._index && this.overFlowIndex != 0) //如果当前的时间
			{
				this._index = this.overFlowIndex;
				progressTimeStop(this.objID, this, this.type);
				this.isFormStartPlay = true;
				//console.log("当前的时间是  "+this.stepArr[this.value].time+"     "+"    当前的位置       "+this.value+'     记录的位置是   '+this.stepArr[this.value].index);
			} else if(this.overFlowIndex == 0) { //如果当前进度条无超出的标识位置，则超出的位置是最大超出位置
				this.overFlowIndex = this.maxValue;
			}
		}
	}
	o.SetValue = function(aValue, obj) { //开始播放进度条
		this._index = aValue;
		if(this._index >= this.maxValue) {
			this._index = this.maxValue;
			this.isFormStartPlay = true;
			progressTimeStop(this.objID, this, this.type)
		}
		if(this._index <= 0) {
			this._index = 0
		};
		if(this.type == 'hour') {
			this.calcCurrIndex(); //重新计算超出位置
		} else {
			this.calcDayCurrIndex();
		}
		this.judgeIsStartPlay();
		var mWidth = (this._index / this.maxValue) * obj.find(".scrollBar").width() + "px";
		obj.find(".scroll_Track").css("width", mWidth);
		obj.find(".scroll_Thumb").css("margin-left", mWidth);
		if(weatherVM.pCloundBtnStatus.status.isActive) { //只在污染云图按钮活动的时候，开启云图播放
			weatherVM.showCloudWindyInfo();
		}
	}
	o.calcCurrIndex = function() { //“小时”重新计算当前的时间的超出位置
		//console.log(initTime.currTooltip);
		this.overFlowIndex = this.maxValue; //重新清空超出的位置记录标识值
		if(this.type == 'hour') {
			var obj = $("#" + this.objID);
			this.stepArr = [];
			for(var i = 0; i < this.maxValue; i++) {
				var arr = {
					'index': i,
					'time': '',
					'isCurrTooltip': false,
					'isCurrTime': false //进度条竖线的位置标识
				};
				var start = obj.find(".startTime").html(),
					startDate = new Date(start);
				startDate.setHours(startDate.getHours() + 1 * i); //单位进度的设置
				var timeD = getDataTime(startDate),
					indexStart = timeD.Year + "-" + timeD.Month + "-" + timeD.currentDate + " " + timeD.Hours + ":" + timeD.Minutes + ":" + timeD.Seconds; //传递的时间
				arr.time = indexStart;
				//debugger
				if(initTime.currTime == indexStart) { //记录当前时间的信息，并打上位置标识
					arr.isCurrTime = true;
				}

				if(initTime.currTooltip == indexStart) { //记录进度条，黄色的tooltip的位置
					arr.isCurrTooltip = true;
				}
				this.stepArr.push(arr);
			}
		}
	}
	o.calcDayCurrIndex = function() { //“天” 重新计算当前的时间的超出位置
		this.overFlowIndex = this.maxValue; //重新清空超出的位置记录标识值

		var obj = $("#" + this.objID);
		this.daystepArr = [];
		for(var i = 0; i < this.maxValue; i++) {
			var arr = {
				'index': i,
				'time': '',
				'isCurrTooltip': false,
				'isCurrTime': false //进度条竖线的位置标识
			};
			var start = obj.find(".startTime").html(),
				startDate = new Date(start);

			startDate.setDate(startDate.getDate() + 1 * i); //单位进度的设置
			var timeD = getDataTime(startDate),
				indexStart = timeD.Year + "-" + timeD.Month + "-" + timeD.currentDate; //传递的时间
			arr.time = indexStart;


			if(initTime.daycurrTooltip == indexStart) { //记录进度条，黄色的tooltip的位置
				arr.isCurrTooltip = true;
			}
			this.daystepArr.push(arr);
		}

	}
	o.Value = function(obj) {}
	o.GetValue = function(obj) {
		this.currentX = obj.find(".scrollBar").width() * (this._index / this.maxValue);
	}
	return o;
}

// 控制大滑块的当前时间
function SetTime(value, obj, ScrollBar) {
	//debugger
	var start = obj.find(".startTime").html(),
		startDate = new Date(start);
	startDate.setHours(startDate.getHours() + 1 * value); //单位进度的设置
	var timeD = getDataTime(startDate),
		indexStart = timeD.Year + "-" + timeD.Month + "-" + timeD.currentDate + " " + timeD.Hours + ":" + timeD.Minutes + ":" + timeD.Seconds, //传递的时间
		indexStart1 = "历史 " + timeD.Hours + ":" + timeD.Minutes;
	obj.find(".scroll_Thumb").html(indexStart1);
	weatherVM.queryParams.currentTime = indexStart; //更改当前时间的类型
}

// 控制小滑块的当前时间，小滑块时间变化时大滑块不变
function SetTime1(value, obj, ScrollBar) {
	//console.log("zzz");
	var start = obj.find(".startTime").html(),
		startDate = new Date(start);
	startDate.setHours(startDate.getHours() + 1 * value); //单位进度的设置
	var timeD = getDataTime(startDate),
		indexStart = timeD.Year + "-" + timeD.Month + "-" + timeD.currentDate + " " + timeD.Hours + ":" + timeD.Minutes + ":" + timeD.Seconds, //传递的时间
		indexStart1 = timeD.Hours + ":" + timeD.Minutes;
	obj.find(".timecode").html(indexStart1);
}

// 控制大滑块的当前时间
function SetDayTime(value, obj, ScrollBar) {
	var start = obj.find(".startTime").html(),
		startDate = new Date(start);
	if(value == ScrollBar.maxValue) {
		value--;
	}
	startDate.setDate(startDate.getDate() + value); //十五分钟为进度
	var timeD = getDataTime(startDate),
		indexStart = timeD.Year + "-" + timeD.Month + "-" + timeD.currentDate + " ", //传递的时间
		indexStart1 = "历史  " + timeD.Month + "-" + timeD.currentDate;
	obj.find(".scroll_Thumb").html(indexStart1);
	weatherVM.queryParams.currentTime = indexStart; //更改当前时间的类型
}

// 控制小滑块的当前时间，小滑块时间变化时大滑块不变
function SetDayTime1(value, obj, ScrollBar) {
	var start = obj.find(".startTime").html(),
		startDate = new Date(start);
	(value == ScrollBar.maxValue) ? value-- : value;
	startDate.setDate(startDate.getDate() + value); //十五分钟为进度
	var timeD = getDataTime(startDate),
		indexStart = timeD.Month + "-" + timeD.currentDate;
	obj.find(".timecode").html(indexStart);
}

var mt = 0, //有值的面板和进度面板的缩放比例
	prevBarWidth = 0,
	prevValue = 0;

// 点击进度条时滑块到达对应位置
function scrollClick(prgObj, id, fg, unionObj) {
	ScrollBar = prgObj;
	var e = window.event || arguments.callee.caller.arguments[0], //兼容不同浏览器，获取event对象
		obj = $("#" + id),
		scrollBarWidth = obj.find(".scrollBar").width(),
		currentValue,
		changeX = e.clientX - ScrollBar.currentX; //当前点击的位置
	currentValue = changeX - ScrollBar.currentX - obj.find(".scrollBar").offset().left;

	if(!unionObj) { //第二次点击重置进度条
		currentValue = prevValue * scrollBarWidth / ScrollBar.maxValue;
	} else {
		prevBarWidth = scrollBarWidth;
	}
	if((currentValue + 1) >= scrollBarWidth) { //跑到最右边
		obj.find(".scroll_Thumb").css("margin-left", scrollBarWidth - 1 + "px");
		obj.find(".scroll_Track").css("width", scrollBarWidth + 2 + "px");
		ScrollBar._index = ScrollBar.maxValue;
	} else if(currentValue <= 0) { //最左边的时候
		obj.find(".scroll_Thumb").css("margin-left", "0px");
		obj.find(".scroll_Track").css("width", "0px");
		ScrollBar._index = 0;
	} else { //进度条样式
		ScrollBar._index = Math.round(currentValue * ScrollBar.maxValue / scrollBarWidth); //当前位置*单份天进度的宽度
	}

	prevValue = ScrollBar._index; //记录上一次的进度条的位置，分配的段的位置（开始到结束时间平均分为多少段）
	obj.find(".scroll_Thumb").css("margin-left", currentValue + "px");
	obj.find(".scroll_Track").css("width", currentValue + 2 + "px");
	SetInterval(ScrollBar._index, obj, ScrollBar, fg);
	if(unionObj) {
		scrollClick(unionObj, unionObj.objID, unionObj.type);
	}
}

// 鼠标在进度条上面滑动时小滑块显示并对应相应的时间
function scrollMove(prgObj, id, fg) {
	var e = window.event || arguments.callee.caller.arguments[0], //兼容不同浏览器，获取event对象
		currentValue,
		obj = $("#" + id);
	ScrollBar = prgObj;
	var changeX = e.clientX - ScrollBar.currentX;
	currentValue = changeX - ScrollBar.currentX - obj.find(".scrollBar").offset().left;
	obj.find(".timecode").show().css("left", currentValue - 28 + "px");
	if((currentValue + 1) >= obj.find(".scrollBar").width()) {
		obj.find(".timecode").css("left", obj.find(".scrollBar").width() - 43 + "px");
		ScrollBar.value = ScrollBar.maxValue;
	} else if(currentValue <= 0) {
		obj.find(".timecode").css("left", "-28px");
		ScrollBar.value = 0;
	} else {
		ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / obj.find(".scrollBar").width());
	}
	if(fg == 'day') {
		SetDayTime1(ScrollBar.value, obj, ScrollBar);
	} else {
		SetTime1(ScrollBar.value, obj, ScrollBar);
	}
}

//开始 暂停
function progressTimeControl(img, id, controlObj, fg) {
	var ScrollBar = controlObj;
	var obj = $('#' + ScrollBar.objID);
	var img = obj.find(".progressTime_control");
	var imgtitle = '';
	if(ScrollBar.objID == "progres02") {
		imgtitle = $('#progres01').find(".progressTime_control").attr("title");
	} else if(ScrollBar.objID == "progres04") {
		imgtitle = $('#progres03').find(".progressTime_control").attr("title");
	} else {
		imgtitle = obj.find(".progressTime_control").attr("title");
	}
	if((ScrollBar._index == ScrollBar.overFlowIndex || ScrollBar._index == ScrollBar.maxValue) && imgtitle == "开始") { //如果当前的位置是超出位置,或者是结束位置（在暂停的时候）
		progressTimeSiteStart(id, ScrollBar, fg);
		ScrollBar.isFormStartPlay = false;
	}
	if(imgtitle == "暂停") { //暂停
		$(img).attr("title", "开始");
		$(img).css("background-image", "url(" + $.ctx + "/resources/img/t-play.png)");
		window.clearInterval(ScrollBar._mProgressTimer);
	} else { //播放
		staRankVM.btn_toogle_statue = 0; //关闭右侧面板
		staRankVM.toogleContianer(); //关闭右侧的面板
		$(img).attr("title", "暂停");
		$(img).css("background-image", "url(" + $.ctx + "/resources/img/t-pause.png)");
		startEndChange(ScrollBar, obj);
	}
}

function stopAllPlay() {
	var obj;
	//	console.log("暂停所有播放");
	for(var i = 1; i < 4; i++) {
		if(i % 2) {
			obj = $("#progres0" + i);
			var img = obj.find(".progressTime_control");
			$(img).attr("title", "开始");
			$(img).css("background-image", "url(" + $.ctx + "/resources/img/t-play.png)");
		}
	}
	window.clearInterval(progres01._mProgressTimer);
	window.clearInterval(progres02._mProgressTimer);
	if(progres03) {
		window.clearInterval(progres03._mProgressTimer);
	}
	if(progres04) {
		window.clearInterval(progres04._mProgressTimer);
	}

}

function startEndChange(ScrollBar, obj) {
	ScrollBar._mProgressTimer = window.setInterval(function() {
		if(ScrollBar._index <= ScrollBar.maxValue) {
			ScrollBar._index++;
			ScrollBar.SetValue(ScrollBar._index, obj);
			if(ScrollBar.type == 'day') {
				SetDayTime(ScrollBar._index, obj, ScrollBar);
			} else {
				SetTime(ScrollBar._index, obj, ScrollBar);
			}
		} else {
			progressTimeStop(ScrollBar.objID, ScrollBar)
		}

	}, _speed);
}

function progressTimeSiteStart(id, ScrollBar, fg) {
	var obj = $('#' + id);
	obj.find(".progressTime_control").attr("title", "开始");
	obj.find(".progressTime_control").css("background-image", "url(" + $.ctx + "/resources/img/t-play.png)");
	obj.find(".scroll_Thumb").css("margin-left", "0px");
	obj.find(".scroll_Track").css("width", "0px");
	ScrollBar._index = 0;

	window.clearInterval(ScrollBar._mProgressTimer);
	if(fg == 'day') {
		SetDayTime(ScrollBar._index, obj, ScrollBar);
	} else {
		SetTime(ScrollBar._index, obj, ScrollBar);
	}

}

//停止
function progressTimeStop(id, ScrollBar, fg) {
	var obj = $('#' + id);
	obj.find(".progressTime_control").attr("title", "开始");
	obj.find(".progressTime_control").css("background-image", "url(" + $.ctx + "/resources/img/t-play.png)");

	window.clearInterval(ScrollBar._mProgressTimer);
	if(fg == 'day') {
		SetDayTime(ScrollBar._index, obj, ScrollBar);
	} else {
		SetTime(ScrollBar._index, obj, ScrollBar);
	}
	//SetInterval(ScrollBar._index, obj, ScrollBar, fg);
}

//重制时间
function SetInterval(_index, obj, ScrollBar, fg) {
	window.clearInterval(ScrollBar._mProgressTimer);
	var imgtitle = '';
	if(ScrollBar.objID == "progres02") {
		imgtitle = $('#progres01').find(".progressTime_control").attr("title");
	} else if(ScrollBar.objID == "progres04") {
		imgtitle = $('#progres03').find(".progressTime_control").attr("title");
	} else {
		imgtitle = obj.find(".progressTime_control").attr("title");
	}
	if(imgtitle == "开始") {
		if(fg == 'day') {
			SetDayTime(ScrollBar._index, obj, ScrollBar);
		} else {
			SetTime(ScrollBar._index, obj, ScrollBar);
		}
		ScrollBar.SetValue(_index, obj);

	} else if(imgtitle == "暂停") {
		startEndChange(ScrollBar, obj);
	}
}

function progressSise(type) {
	if(type == 2) { //小时
		var obj = $("#" + progres01.objID);
		SetTime(progres01._index, obj, progres01);
		var mWidth = (progres01._index / progres01.maxValue) * obj.find(".scrollBar").width() + "px";
		obj.find(".scroll_Track").css("width", mWidth);
		obj.find(".scroll_Thumb").css("margin-left", mWidth);
		obj.find(".currTime_line").css("left", progres01.overFlowIndex / progres01.maxValue * obj.find(".scrollBar").width() + "px");
	} else if(type == 3) { //天s
		var obj = $("#" + progres03.objID);
		SetDayTime(progres03._index, obj, progres03);
		var mWidth = (progres03._index / progres03.maxValue) * obj.find(".scrollBar").width() + "px";
		obj.find(".scroll_Track").css("width", mWidth);
		obj.find(".scroll_Thumb").css("margin-left", mWidth);
		obj.find(".currTime_line").css("left", progres03.overFlowIndex / progres03.maxValue * obj.find(".scrollBar").width() + "px");
	}
}