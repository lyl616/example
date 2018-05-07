var curr_pro = (parent.provinceId == 'undefined' || isNull(parent.provinceId) ? '-1' : parent.provinceId),
	curr_city = parent.cityId,
	report_type = [],
	report_category = [],
	report_district = [],
	report = "",
	initSEndTime = {
		day: {
			startTime: ResetcalcTime('day_startTime', initDateTime('day').start, 'day'),
			endTime: ResetcalcTime('day_endTime', initDateTime('day').end, 'day')
		},
		week: {
			startTime: ResetcalcTime('week_startTime', initDateTime('week').start, 'week'),
			endTime: ResetcalcTime('week_endTime', initDateTime('week').end, 'week')
		},
		month: {
			startTime: ResetcalcTime('month_startTime', initDateTime('month').start, 'month'),
			endTime: ResetcalcTime('month_endTime', initDateTime('month').end, 'month')
		},
		qt: {
			startTime: ResetcalcTime('qt_startTime', initDateTime('qt').start, 'qt'),
			endTime: ResetcalcTime('qt_endTime', initDateTime('qt').end, 'qt')
		},
		year: {
			startTime: ResetcalcTime('year_startTime', initDateTime('year').start, 'year'),
			endTime: ResetcalcTime('year_endTime', initDateTime('year').end, 'year')
		}
	};

$(function() {

	myDate.format = 'yyyy年MM月dd日';

	var tableColumns = [{
			name: '__checkbox:id',
			titleClass: 'w70 text-center',
			dataClass: 'w70 text-center'
		},
		{
			name: 'id',
			title: '序号',
			titleClass: 'text-center',
			dataClass: 'text-center'
		}, {
			name: 'reportName',
			title: '报告名称',
			titleClass: 'text-center',
			dataClass: 'text-center'
		}, {
			name: 'category',
			title: '报告类型',
			titleClass: 'text-center',
			dataClass: 'text-center'
		}, {
			name: 'district',
			title: '区域',
			titleClass: 'text-center',
			dataClass: 'text-center'
		}, {
			name: 'createBy',
			title: '上传人',
			titleClass: 'text-center',
			dataClass: 'text-center'
		}, {
			name: '__component:custom-action',
			title: '操作',
			titleClass: 'text-center',
			dataClass: 'custom-action text-center'
		}
	];

	Vue.component(
		'custom-action', {
			template: ["<div>",
				'<button class="btn btn-info btn-xs" title="查看" @click="itemAction(\'edit-view\', rowData)">查看</button> ',
				'<button class="btn btn-warning btn-xs" title="下载" @click="itemAction(\'edit-download\', rowData)">下载</button> ',
				'</div>'
			].join(''),
			props: {
				rowData: {
					type: Object,
					required: true
				}
			},
			methods: {
				itemAction: function(action, data) {
					if(action === 'edit-view') {
						this.$dispatch('vuetable:report', data, 'view');
					} else if(action === 'edit-download') {
						this.$dispatch('vuetable:report', data, 'download');
					} else if(action === 'edit-delete') {
						this.$dispatch('vuetable:report', data, 'delete');
					}
				}
			}
		});

	Vue.config.debug = true;

	report = new Vue({
		el: "#content",
		data: {
			report_type: report_type, //报告类型
			selected_type: 'day',
			report_category: report_category, //报表类型 日报 月、周、季、年报
			selected_category: '-1',
			report_district: report_district,
			selected_district: "-1",
			report_name: "",
			////////////新增5个tab 的开始结束日期///////////////
			fg_curr_tm: 'day',
			day_startTime: initSEndTime.day.startTime,
			day_endTime: initSEndTime.day.endTime,
			week_startTime: initSEndTime.week.startTime,
			week_endTime: initSEndTime.week.endTime,
			month_startTime: initSEndTime.month.startTime,
			month_endTime: initSEndTime.month.endTime,
			qt_startTime: initSEndTime.qt.startTime,
			qt_endTime: initSEndTime.qt.endTime,
			year_startTime: initSEndTime.year.startTime,
			year_endTime: initSEndTime.year.endTime,
			prolist: [], //新添开始
			fields: tableColumns,
			perPage: 10,
			pageList: [10, 20, 30, 40, 50],
			params: ['type=' + type, 'category=', 'pro=' + curr_pro, 'city=' + curr_city, 'district=-1',
				'queryBeginTime= ' + initSEndTime.day.startTime, 'queryEndTime=' + initSEndTime.day.endTime, 'reportName='
			]
		},
		ready: function() {
			var _self = this;
			var url = $.coreApiPath + "/pollution/districts";
			var param = {
				cityId: curr_city
			};
			ajax($.coreApiPath + "/pollution/districts", param, function(data) {
				if(data.length) {
					for(var i in data) {
						var city_info = {
							id: '',
							text: ''
						};
						if(data[i].id != "" && data[i].id != null) {
							city_info.id = data[i].id;
							city_info.text = data[i].district;
							this.report_district.push(city_info);
						}
					}
				}
			});

			var url = $.coreApiPath + "/dictionary/dictionaryType";
			var param = {
				"type": 93
			};
			ajax(url, param, function(data) {
				if(data != null && data.length > 0) {
					if(data.length) {
						for(var i in data) {
							var config_type = {
								code: '',
								text: ''
							};
							if(data[i].code != '' && data[i].id != null) {
								config_type.code = data[i].code;
								config_type.text = data[i].name;
								_self.report_category.push(config_type);
							}
						}
					}
				}
			});
		},
		events: {
			'vuetable:report': function(data, action) {
				var that = this;
				if(action === 'view') {
					var url = $.coreApiPath + "/report/file/preview/" + data.id;
					window.open(url);
				} else if(action === 'download') {
					var url = $.coreApiPath + "/report/file/download/" + data.id;
					window.open(url);
				} else if(action === 'delete') {
					layer.confirm("确定删除选中的端站吗?", {
						title: '提示',
						btn: ['确定', '取消'], // 按钮
						yes: function(index) {
							layer.msg("测试ok!");
						}
					});
				}
			}
		},
		watch: {
			perPage: function() {
				this.setSearchfg();
			},
			selected_district: function() {
				this.setSearchfg();
			},
			selected_category: function() {
				this.setSearchfg();
			}
		},
		methods: {
			setSearchfg: function() {
				var that = this;
				var timefg = that.returnSEndTime(that.fg_curr_tm),
					start = timefg.start,
					end = timefg.end,
					type = timefg.type;
				that.reportSearch(start, end, type);
			},
			returnSEndTime: function(index) {
				switch(index) {
					case "day":
						{
							return {
								start: this.day_startTime,
								end: this.day_endTime,
								type: 'day'
							}
						}
						break;
					case "week":
						{
							return {
								start: this.week_startTime,
								end: this.week_endTime,
								type: 'week'
							}
						}
						break;
					case "month":
						{
							return {
								start: this.month_startTime,
								end: this.month_endTime,
								type: 'month'
							}
						}
						break;
					case "qt":
						{
							return {
								start: this.qt_startTime,
								end: this.qt_endTime,
								type: 'qt'
							}
						}
						break;
					case "year":
						{
							return {
								start: this.year_startTime,
								end: this.year_endTime,
								type: 'year'
							}
						}
						break;
				}
			},
			setCurrTimefg: function(fg) {
				clearAllCheckBoxByClass("checkbox_id");
				switch(fg) {
					case 'day':
						{
							this.fg_curr_tm = 'day';
						}
						break;
					case 'week':
						{
							this.fg_curr_tm = 'week';
						}
						break;
					case 'month':
						{
							this.fg_curr_tm = 'month';
						}
						break;
					case 'qt':
						{
							this.fg_curr_tm = 'qt';
						}
						break;
					case 'year':
						{
							this.fg_curr_tm = 'year';
						}
						break;
				}
				this.setSearchfg();
			},
			totransformDate: function(dateV) {
				dateV = dateV.replace(/([^\u0000-\u00FF])/g, '-'); //替换掉中文
				dateV = dateV.replace(/(\D*$)/g, ''); //去掉结尾的多余 -
				return dateV;
			},
			reportSearch: function(start, end, type) {
				var Nstart = this.totransformDate(start),
					Nend = this.totransformDate(end);
				var dateStart = new Date(Nstart),
					dateEnd = new Date(Nend);
				var start_year = dateStart.getFullYear(),
					start_month = dateStart.getMonth() + 1,
					start_day = dateStart.getDate(),
					end_year = dateEnd.getFullYear(),
					end_month = dateEnd.getMonth() + 1,
					end_day = dateEnd.getDate();
				var d_value_year = end_year - start_year, //年的差值
					d_value_month = end_month - start_month, //月的差值
					d_value_day = end_day - start_day; //天的差值
				//console.log("差的  年 " + d_value_year + "   月 " + d_value_month + "  日" + d_value_day)
				var that = this;
				that.report_name = that.report_name;
				var param = {
					type: type,
					pro: curr_pro,
					city: curr_city,
					district: that.selected_district,
					category: that.selected_category,
					queryBeginTime: start,
					queryEndTime: end,
					reportName: that.report_name
				};
				if(param.queryBeginTime > param.queryEndTime) {
					layer.msg('开始时间不能大于结束时间！');
					return;
				}
				if(param.queryBeginTime != param.queryEndTime) {
					switch(type) {
						case 'day':
							{
								if(d_value_year == 0) { //一年内的时间判断
									if(d_value_month > 1) {
										layer.msg("查询时间不能超过一个月！");
										return;
									} else if(d_value_month == 1) {
										if(d_value_day >= 1) {
											layer.msg("查询时间不能超过一个月");
											return;
										}
									}
								} else if(d_value_year == 1) { //跨年 12月 -1月
									if(d_value_month == -11) {
										if(d_value_day >= 1) {
											layer.msg("查询时间不能超过一个月");
											return;
										}
									} else {
										layer.msg("查询时间不能超过一个月");
										return;
									}

								} else {
									layer.msg("查询时间不能超过一个月！");
									return;
								}
							}
							break;
						case 'qt': //不得大于3个季度
							{
								if(d_value_year == 1) {
									if(d_value_month >= 0) {
										layer.msg("查询时间不能超过一年！");
										return;
									}
								} else if(d_value_year > 1) {
									layer.msg("查询时间不能超过一年");
									return;
								}
							}
							break;
						case 'week':
						case 'month':
							{
								if(d_value_year == 1) {
									if(d_value_month >= 1) {
										layer.msg("查询时间不能超过一年！");
										return;
									} else if(d_value_month == 0) {
										if(d_value_day > 1) {
											layer.msg("查询时间不能超过一年");
											return;
										}
									}
								} else if(d_value_year > 1) {
									layer.msg("查询时间不能超过一年");
									return;
								}
							}
							break;
					}
				}

				var sp = CommonUtil.json2Array(param);
				for(var i = 0; i < sp.length; i++) {
					that.params.push(sp[i]);
				}
				that.$nextTick(function() {
					that.$broadcast('vuetable:refresh');
				});
			}
		}
	});
});