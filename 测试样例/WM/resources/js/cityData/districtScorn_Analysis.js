var E_SERVER_ERROR = 'Error communicating with the server'

var domainId = parent.cityId;
var timeYear;
var timeInterval;

var myDate = new DateHelp({
	date: new Date(), //从此日期开始计算
	format: 'yyyy年MM月dd日'
});

var lend = ['优', '良', '轻度', '中度', '重度', '严重'];
var lendColor = ['#00E500', '#FFFF00', '#FF7E00', '#FF0000', '#99004C', '#7E0023'];

$(function() {
	initAirDaysData("daysStackChar");
	initAirDaysPercent();
});

var tableColumns = [{
		name: '__sequence',
		title: '序号',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '40px'
	},
	{
		name: 'districtName',
		width: '92px',
		title: '区县',
		titleClass: 'text-center',
		dataClass: 'text-center'
	},
	{
		name: 'realDataReal',
		title: '均值',
		sortField: 'realDataReal',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '80px',
		visible: false
	},
	{
		name: 'targetDataReal',
		title: '目标',
		titleClass: 'text-center',
		dataClass: "text-center",
		width: '80px',
		visible: false
	},
	{
		name: 'targetDiff',
		title: '目标差',
		titleClass: 'text-center',
		dataClass: "text-center",
		callback: 'targetDiffFmt',
		width: '100px',
		visible: false
	},
	{
		name: 'realData',
		title: '均值',
		sortField: 'realData',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '65px'
	},
	{
		name: 'targetData',
		title: '目标',
		titleClass: 'text-center',
		dataClass: "text-center",
		width: '45px'
	},
	{
		name: 'percent',
		title: '同比',
		titleClass: 'text-center',
		width: '67px',
		dataClass: "text-center",
		callback: "percentFmt"

	},
	{

		name: 'targetPercent',
		title: "同比目标",
		titleClass: 'text-center',
		dataClass: "text-center",
		width: '67px',
		callback: "percentFmt"
	}
];

var tableColumnsDays = [{
		name: '__sequence',
		title: '序号',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '40px'
	},
	{
		name: 'districtName',
		width: '92px',
		title: '区县',
		titleClass: 'text-center',
		dataClass: 'text-center'
	},
	{
		name: 'realDataReal',
		title: '天数',
		sortField: 'realDataReal',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '80px',
		visible: false
	},
	{
		name: 'targetDataReal',
		title: '目标',
		titleClass: 'text-center',
		dataClass: "text-center",
		width: '80px',
		visible: false
	},
	{
		name: 'targetDiff',
		title: '目标差',
		titleClass: 'text-center',
		dataClass: "text-center",
		callback: 'targetDiffFmt',
		width: '100px',
		visible: false
	},
	{
		name: 'realData',
		title: '天数',
		sortField: 'realData',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '65px'
	},
	{
		name: 'targetData',
		title: '目标',
		titleClass: 'text-center',
		dataClass: "text-center",
		width: '45px'
	},
	{
		name: 'percent',
		title: '同比',
		titleClass: 'text-center',
		width: '67px',
		dataClass: "text-center",
		callback: "percentFmt"

	},
	{

		name: 'targetPercent',
		title: "同比目标",
		titleClass: 'text-center',
		dataClass: "text-center",
		width: '67px',
		callback: "percentFmt"
	}
];

Vue.use(Vuetable);
Vue.config.productionTip = false;

var topSearchVM = new Vue({
	el: '#topSearch',
	data: {
		time_type: "1", //时间类型 1 month ,2 季度， 3 半年 ， 4 year
		starttime: "",
		fmt: "yyyy年MM月",
		maxdate: '%y-%M',
		timeIntervalList: [],
		timeInterval: "",
		showHis: 1, //默认1 显示历史
		totalDays: "",
		realShowColuon: ["realDataReal", "targetDataReal", "targetDiff"],
		hisShowColuon: ["realData", "targetData", "percent", "targetPercent"]
	},
	watch: {
		'time_type': function() {
			var _self = this;
			_self.fmt = "yyyy年";
			_self.maxdate = "%y";

			var month = myDate.month;
			_self.timeIntervalList = [];

			if(_self.time_type == 1) { //月
				_self.fmt = "yyyy年MM月";
				_self.maxdate = "%y-%M";
				_self.starttime = new Date(myDate.year, myDate.month - 2).Format(_self.fmt);

			} else if(_self.time_type == 2) { //季度 默认上一季度

				var season = Math.ceil(month / 3);
				if(season > 1) {
					_self.starttime = new Date(myDate.year, myDate.month).Format(_self.fmt);
				} else {
					_self.starttime = new Date(myDate.year - 1, myDate.month).Format(_self.fmt);
				}

			} else if(_self.time_type == 3) { //半年
				if(month > 6) {
					_self.starttime = new Date(myDate.year, myDate.month).Format(_self.fmt);
				} else {
					_self.starttime = new Date(myDate.year - 1, myDate.month).Format(_self.fmt);
				}
			} else if(_self.time_type == 4) { //年
				_self.starttime = new Date(myDate.year - 1, myDate.month).Format(_self.fmt);
			}
			_self.showTimeInterval();
			_self.initQueryParams();
		},
		"starttime": function() {
			var _self = this;
			var tempDate = getFmtDate(_self.starttime, _self.time_type);

			if(_self.time_type == 1) {
				if(tempDate.year == myDate.year && tempDate.month == myDate.month) {
					_self.showHis = 0;
				} else {
					_self.showHis = 1;
				}
			} else if(_self.time_type == 2) {
				if(tempDate.year == myDate.year && (Math.ceil(tempDate.month / 3) == Math.ceil(myDate.month / 3))) {
					_self.showHis = 0;
				} else {
					_self.showHis = 1;
				}

			} else if(_self.time_type == 3) {
				if(tempDate.year == myDate.year) {
					_self.showHis = 0;
				} else {
					_self.showHis = 1;
				}
			} else if(_self.time_type == 4) {
				if(tempDate.year == myDate.year) {
					_self.showHis = 0;
				} else {
					_self.showHis = 1;
				}
			}
			_self.showTimeInterval();
			_self.initQueryParams();
		},
		'timeInterval': function() {
			districtRankVM.moreParams.timeInterval = this.timeInterval;
			airDaysRankVM.moreParams.timeInterval = this.timeInterval;
			airDaysRankVM.refreshTeble();
			districtRankVM.refreshTeble();
			timeYear = districtRankVM.moreParams.timeYear;
			timeInterval = this.timeInterval;
			initAirDaysData("daysStackChar");
			initAirDaysPercent();
		},
		'showHis': function() {
			var _self = this;
			if(_self.showHis == 1) {
				dayCharsVM.showCol6 = true;
				dayCharsVM.showCol12 = false;
			} else {
				dayCharsVM.showCol6 = false;
				dayCharsVM.showCol12 = true;
			}
		}
	},
	mounted: function() {
		var _self = this;
		_self.starttime = new Date(myDate.year, myDate.month - 2).Format(_self.fmt);
		_self.time_type = 1;
	},
	methods: {
		showTimeInterval: function() {
			var _self = this;
			var tempDate = getFmtDate(_self.starttime, _self.time_type);
			_self.timeIntervalList = [];

			if(_self.time_type == 2) { //季度 默认上一季度
				if(tempDate.year == myDate.year) {
					var season = Math.ceil(myDate.month / 3);
					for(var i = 1; i <= season; i++) {
						_self.timeIntervalList.push("第" + _self.getNumUpper(i) + "季度");
					}
					_self.timeInterval = "第一季度";
				} else {
					for(var i = 1; i <= 4; i++) {
						_self.timeIntervalList.push("第" + _self.getNumUpper(i) + "季度");
					}
					_self.timeInterval = "第四季度";
				}
			} else if(_self.time_type == 3) { //半年
				if(tempDate.year == myDate.year) {
					_self.timeIntervalList.push("上半年");
					if(myDate.month > 6) {
						_self.timeIntervalList.push("下半年");
					}
					_self.timeInterval = "上半年";
				} else {
					_self.timeIntervalList.push("上半年");
					_self.timeIntervalList.push("下半年");
					_self.timeInterval = "下半年";
				}
			}
		},
		getNumUpper: function(num) {
			switch(num) {
				case 1:
					return "一";
				case 2:
					return "二";
				case 3:
					return "三";
				case 4:
					return "四";
				default:
					return "";
			}
		},
		WdatePickMonth: function() {
			var _self = this;
			WdatePicker({
				dateFmt: 'yyyy年MM月',
				maxDate: '%y-%M',
				onpicked: function() {
					$(this).blur();
					_self.starttime = $dp.cal.getDateStr(_self.fmt);
				}
			});
		},
		WdatePickYear: function() {
			var _self = this;
			WdatePicker({
				dateFmt: 'yyyy年',
				maxDate: '%y',
				onpicked: function() {
					$(this).blur();
					_self.starttime = $dp.cal.getDateStr(_self.fmt);
				}
			})
		},
		clkTimeType: function(timeType) { //切换查询时间类型
			var _self = this;
			_self.time_type = timeType;

            $('.timeType').removeClass('btn-tabinfo');
            $(".timeType:eq(" + (timeType - 1) + ")").addClass('btn-tabinfo');
        },
        initQueryParams: function () {
            var _self = this;
            var tempDate = getFmtDate(_self.starttime, _self.time_type);
            districtRankVM.moreParams.timeYear = tempDate.year;
            airDaysRankVM.moreParams.timeYear = tempDate.year;

			if(_self.time_type == 1) { //月
				_self.timeInterval = tempDate.month + "月";
			} else if(_self.time_type == 4) { //年
				if(_self.timeInterval == "全年") {
					districtRankVM.moreParams.timeInterval = this.timeInterval;
					airDaysRankVM.moreParams.timeInterval = this.timeInterval;
					airDaysRankVM.refreshTeble();
					districtRankVM.refreshTeble();
					timeYear = districtRankVM.moreParams.timeYear;
					timeInterval = this.timeInterval;
					initAirDaysData("daysStackChar");
					initAirDaysPercent();
				} else {
					_self.timeInterval = "全年";
				}
			}
		}
	}
});

function getFmtDate(starttime, time_type) {
	var temp = starttime;
	if(time_type == 1) {
		temp = temp + "01日";
	} else {
		temp = temp + "01月01日";
	}
	temp = temp.replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3');
	temp = new Date(Date.parse(temp.replace(/-/g, "/")));

	return new DateHelp({
		date: new Date(temp),
		format: 'yyyy/MM/dd'
	});
}

var dayCharsVM = new Vue({
	el: "#dayChars",
	data: {
		showCol6: true,
		showCol12: false
	}
});

/*区县排名pm2.5表格*/
var districtRankVM = new Vue({
	el: '#districtRank',
	data: {
		loading: '',
		searchFor: '',
		moreParams: { //表格查询参数
			city: domainId,
			timeYear: 2018,
			timeInterval: '2月'
		},
		fields: tableColumns,
		tableHeight: 'auto',
		selectedTo: [],
		vuetableFields: false,
		sortOrder: [{
			field: 'realData',
			direction: 'desc',
		}],
		multiSort: true,
		loadOnStart: false,
		paginationComponent: 'vuetable-pagination',
		perPage: 10,
		paginationInfoTemplate: '显示: {from} to {to} ，共 {total} item(s)'
	},
	mounted: function() {
		var _self = this;
	},
	methods: {
		transform: function(data) {
			var transformed = {}
			var pagination = data.pagination;
			transformed.pagination = {
				total: pagination.total,
				per_page: pagination.per_page,
				current_page: pagination.current_page,
				last_page: pagination.last_page,
				next_page_url: pagination.next_page_url,
				prev_page_url: pagination.prev_page_url,
				from: pagination.from,
				to: pagination.to
			}
			transformed.data = []
			data = data.data.list
			for(var i = 0; i < data.length; i++) {
				transformed['data'].push({
					district: data[i].district,
					districtName: "<a href='" + $.ctx + "/cityData/districtDetail?district=" + data[i].district + "&districtName=" + data[i].districtName + "' class=\"text-underline\" target=\"_blank\">" + data[i].districtName + "</a>",

					realDataReal: data[i].realData,
					targetDataReal: data[i].targetData,
					targetDiff: data[i].targetDiff,

					realData: data[i].realData,
					targetData: data[i].targetData,
					percent: data[i].percent,
					targetPercent: data[i].targetPercent

				})
			}
			//PM25双柱图
			initDistrictRank("districtRankChar", data)
			return transformed
		},
		targetDiffFmt: function(value) {
			if(value < 0) {
				return '<span style="color: red">♦</span>' + Math.abs(value);
			} else {
				return value;
			}

		},
		percentFmt: function(val) {
			if(val < 0) {
				return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
			} else if(val > 0) {
				return val + "%<b class='arrow-green-up'></b>";
			} else if(val == '0') {
				return val + "%";
			} else {
				return val;
			}
		},
		refreshTeble: function() {
			var _self = this;
			_self.showColumn();
			_self.$nextTick(function() {
				_self.$refs.vuetable.refresh()
			})
		},
		showColumn: function() {
			var _self = this;
			for(var i = 0; i < _self.fields.length; i++) {
				var fid = _self.fields[i];
				if(topSearchVM.showHis == 1) {
					if(topSearchVM.realShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.hideField(i);
					}
					if(topSearchVM.hisShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.showField(i);
					}

				} else {
					if(topSearchVM.hisShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.hideField(i);
					}
					if(topSearchVM.realShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.showField(i);
					}
				}
			}
		},
		showLoader: function() {
			this.loading = 'loading'
		},
		hideLoader: function() {
			this.loading = ''
		},
		onLoadSuccess: function(response) {
			topSearchVM.totalDays = response.data.data.totalDays;
		},
		onLoadError: function(response) {

		},
		onPaginationData: function(tablePagination) {},
		onChangePage: function(page) {
			this.$refs.vuetable.changePage(page)
		}
	}
});

/**
 * 空气质量天数排名表格
 */

var airDaysRankVM = new Vue({
	el: '#airDaysRank',
	data: {
		loading: '',
		searchFor: '',

		moreParams: { //表格查询参数
			city: domainId,
			timeYear: 2017,
			timeInterval: '下半年',
			aqiLevel: 1
		},
		fields: tableColumnsDays,
		tableHeight: 'auto',
		selectedTo: [],
		vuetableFields: false,
		sortOrder: [{
			field: 'realData',
			direction: 'desc',
		}],
		multiSort: true,
		loadOnStart: false,
		paginationComponent: 'vuetable-pagination',
		perPage: 10,
		paginationInfoTemplate: '显示: {from} to {to} ，共 {total} item(s)'
	},
	mounted: function() {
		var _self = this;
	},
	methods: {
		transform: function(data) {
			var transformed = {}
			var pagination = data.pagination;
			transformed.pagination = {
				total: pagination.total,
				per_page: pagination.per_page,
				current_page: pagination.current_page,
				last_page: pagination.last_page,
				next_page_url: pagination.next_page_url,
				prev_page_url: pagination.prev_page_url,
				from: pagination.from,
				to: pagination.to
			}

			transformed.data = []
			data = data.data
			for(var i = 0; i < data.length; i++) {
				transformed['data'].push({
					district: data[i].district,
					districtName: "<a href='" + $.ctx + "/cityData/districtDetail?district=" + data[i].district + "&districtName=" + data[i].districtName + "' class=\"text-underline\" target=\"_blank\">" + data[i].districtName + "</a>",

					realDataReal: data[i].realData,
					targetDataReal: data[i].targetData,
					targetDiff: data[i].targetDiff,

					realData: data[i].realData,
					targetData: data[i].targetData,
					percent: data[i].percent,
					targetPercent: data[i].targetPercent
				})
			}
			//空气质量双柱图
			initDistrictRank("airDataRankChar", data)
			return transformed
		},
		targetDiffFmt: function(value) {
			if(value < 0) {
				return '<span style="color: red">♦</span>' + Math.abs(value);
			} else {
				return value;
			}

		},
		percentFmt: function(val) {
			if(val < 0) {
				return Math.abs(val) + "%<b class='arrow-red-dow'></b></span>";
			} else if(val > 0) {
				return val + "%<b class='arrow-green-up'></b>";
			} else if(val == '0') {
				return val + "%";
			} else {
				return val + "";
			}
		},
		showColumn: function() {
			var _self = this;
			for(var i = 0; i < _self.fields.length; i++) {
				var fid = _self.fields[i];
				if(topSearchVM.showHis == 1) {
					if(topSearchVM.realShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.hideField(i);
					}
					if(topSearchVM.hisShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.showField(i);
					}

				} else {
					if(topSearchVM.hisShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.hideField(i);
					}
					if(topSearchVM.realShowColuon.hasVal(fid.name)) {
						_self.$refs.vuetable.showField(i);
					}
				}
			}
		},
		onSelectedOption: function() {
			this.refreshTeble();
		},
		refreshTeble: function() {
			var _self = this;

			_self.showColumn();
			_self.$nextTick(function() {
				_self.$refs.vuetable.refresh()
			});
		},
		showLoader: function() {
			this.loading = 'loading'
		},
		hideLoader: function() {
			this.loading = ''
		},
		onLoadSuccess: function(response) {},
		onLoadError: function(response) {

		},
		onPaginationData: function(tablePagination) {},
		onChangePage: function(page) {
			this.$refs.vuetable.changePage(page)
		}
	}
});

/**
 * 双对比柱图--PM25
 * @param id
 */
function initDistrictRank(id, data) {
	var xAxis = [];
	var realData = [];
	var targetData = [];
	for(var i = 0; i < data.length; i++) {
		xAxis.push(data[i].districtName);
		realData.push(data[i].realData);
		targetData.push(data[i].targetData);
	}

	var myChart = echarts.init(document.getElementById(id));
	var option = {

		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		dataZoom: dataZoom_start_end(xAxis.length),
		color: ['#3AA5F5', '#FDBF2D'],
		legend: {
			data: ['实际', '目标'],
			right: '48%',
			top: '2%',
			selectedMode: false
		},
		grid: {
			left: '4%',
			right: '4%',
			top: '10%',
			bottom: '80px',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: xAxis,
			axisLabel: {
				interval: 0,
				rotate: '45',
				margin: 8
			},
			textStyle: {
				color: '#fff',
				fontSize: '10'
			}
		}],
		yAxis: [{
			type: 'value',
			boundaryGap: ['0%', '5%'],
		}],
		series: [{
				name: '实际',
				type: 'bar',
				itemStyle: {
					normal: {
						color: "#3AA5F5"
					}
				},
				data: realData
			},
			{
				name: '目标',
				type: 'bar',
				itemStyle: {
					normal: {
						color: "#FDBF2D"
					}
				},
				data: targetData
			}
		]
	};
	myChart.setOption(option);
}

function initAirDaysData(id) {
	var params = {
		city: domainId,
		timeYear: timeYear,
		timeInterval: timeInterval
	}

	CommonUtil.ajax({
		type: "post",
		url: $.coreApiPath + '/target/analysis/aqiData',
		dataType: "json",
		data: params,
		contentType: 'application/json; charset=UTF-8',
		sucessFn: function(data) {
			initStackChar(id, data);
		}
	});
}

/**
 * 堆叠图
 * @param id
 */
function initStackChar(id, airDaysData) {
	var xAxis = [];
	for(var j = 0; j < airDaysData.length; j++) {
		xAxis.push(airDaysData[j].districtName);
	}
	var myChart = echarts.init(document.getElementById(id));
	var series = [];
	$.each(lend, function(i, val) {
		var data = [];
		for(var j = 0; j < airDaysData.length; j++) {
			var aqiDaysKey = 'aqiDay' + (i + 1);
			data[j] = airDaysData[j][aqiDaysKey];
		}
		series[i] = {
			name: val,
			stack: '堆叠',
			type: 'bar',
			barMaxWidth: 20, //最大宽度
			data: data,
			itemStyle: {
				normal: {
					color: function(params) {
						return lendColor[i]
					}
				}
			}
		}
	});
	var option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		dataZoom: dataZoom_start_end(xAxis.length),
		legend: {
			top: '2%',
			data: lend
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '60px',
			top: '10%',
			containLabel: true
		},
		xAxis: [{
			data: xAxis,
			axisLabel: {
				interval: 0,
				rotate: '45',
				margin: 8
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: series
	};
	myChart.setOption(option);
}

function initAirDaysPercent() {
	var params = {
		city: domainId,
		timeYear: timeYear,
		timeInterval: timeInterval
	}

	CommonUtil.ajax({
		type: "post",
		url: $.coreApiPath + '/target/analysis/aqiExcellentDaysPercent',
		dataType: "json",
		data: params,
		contentType: 'application/json; charset=UTF-8',
		sucessFn: function(data) {
			initDaysTongBiChar(data);
		}
	});
}

/**
 * 优良天同比率
 */
function initDaysTongBiChar(excellentDaysPercent) {

	var myChart = echarts.init(document.getElementById('daysTongBiChar'));
	var xAxis = [];
	var data = [];
	for(var j = 0; j < excellentDaysPercent.length; j++) {
		xAxis.push(excellentDaysPercent[j].districtName);
		data[j] = excellentDaysPercent[j].percent;
	}

	var option = {
		legend: {
			data: [{
				name: ' ',
				icon: 'image://' + ctx + '/resources/img/gaisan.png',
				onclick: function() {

				}
			}],
			right: '40%',
			top: '2%',
			itemWidth: 120,
			selectedMode: false
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter: function(params) {
				var obj = JSON.parse(JSON.stringify(params));
				var data = obj[0].data
				var ld = "改善率";
				if(data < 0) {
					ld = "恶化率";
					data = (-1 * data) + "%";
				} else if(data >= 0) {
					ld = "改善率";
					data = data + "%";
				} else{
                    data = "--";
				}

				return obj[0].name + "<br/> <b style=\"color: " + obj[0].color + ";\"> &bull;</b>  " + ld + "  : " + data;
			}
		},
		dataZoom: dataZoom_start_end(xAxis.length),
		grid: {
			left: '4%',
			right: '4%',
			top: '10%',
			bottom: '65px',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			axisLabel: {
				interval: 0,
				rotate: '45',
				margin: 8
			},
			textStyle: {
				color: '#fff',
				fontSize: '10'
			},
			data: xAxis
		}],
		yAxis: {
			type: 'value',
			boundaryGap: ['0%', '5%'],
			axisLabel: {
				formatter: '{value}%'
			}
		},
		series: [{
			name: ' ',
			type: 'bar',
			barWidth: '18',
			data: data,
			itemStyle: {
				normal: {
					color: function(params) {
						if(params.data >= 0) {
							//最差
							return '#71E0B9';
						} else {
							//最好
							return '#EF6E83';
						}
					}
				}
			}
		}]
	};
	myChart.setOption(option);
}

//给表格增加，鼠标移入的时候出现表格滚动条效果
$(document).ready(function() {
	$(".chunk-body").hover(function() {
		$(this).find(".vuetable-body-wrapper").css("height", '330px');
	}, function() {
		// $(this).find(".vuetable-body-wrapper").css("height", 'auto');
	});
});