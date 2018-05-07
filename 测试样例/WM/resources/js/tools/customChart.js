var stationNum = 0, //记录 勾选的站点个数
	totalSelStationV = []; //记录勾选的站点id
var tabStypes = [false, false, false, false]; //tab1,tab2,tab3 标识缓存
var maxsel = 20;
var khflag = wzflag = ycflag = pcflag = false; // 标识全选
$(document).ready(function() {
	var date = new Date();
	$("#startTime").val(addDate(date, -1));
	$("#endTime").val(addDate(date, 0));
	var hid_kh = $("#hid_kh").val(),
		hid_wz = $("#hid_wz").val(),
		hid_yc = $("#hid_yc").val(),
		hid_pc = $("#hid_pc").val();
	if(typeof(hid_pc) != "undefined" && hid_pc == "4") {
		addActiveTabTag('pc');
	}
	if(typeof(hid_yc) != "undefined" && hid_yc == "3") {
		addActiveTabTag('yc');
	}
	if(typeof(hid_wz) != "undefined" && hid_wz == "2") {
		addActiveTabTag('wz');
	}
	if(typeof(hid_kh) != "undefined" && hid_kh == "1") {
		addActiveTabTag('kh');
	}
});

function addActiveTabTag(s) {
	$("#li_" + s).show();
	$("#li_" + s).click();
	$(".nav-tabs li").removeClass("active");
	$(".nav-tabs #li_" + s).addClass("active");
	$("#tab-selStation .tab-pane").removeClass("active");
	$("#tab-selStation #tab-" + s).addClass("active");

}

function downSelAll(fg, id) {
	//console.log("id   " + id + ' stationNum  ' + stationNum + " fg  " + fg);
	var calcOtherNum = 20 - stationNum,
		obj = $("#" + id + " tbody input[type=checkbox]");
	if(calcOtherNum == 0) {
		$('#' + id + " thead input[type=checkbox]").prop("checked", false);
	}
	if(!calcOtherNum && fg) {
		layer.msg('选择站点信息已达上限！');
		return;
	}
	if(obj.length < calcOtherNum) {
		calcOtherNum = obj.length;
	}
	var selN = 0,
		cancelSelnum = 0;
	if(fg) {
		for(var i = 0; i < obj.length; i++) {
			var checkboxObj = $("#" + id + " tbody input[type=checkbox]:eq(" + i + ")");
			if(!checkboxObj.is(':checked')) { //未选中的话，设置选中
				selN++;
				checkboxObj.prop("checked", true);
				totalSelStationV.push(checkboxObj.val());
				if(selN >= calcOtherNum) {
					break;
				}
			}
		}
		stationNum += selN;
	} else {
		//console.log("取消已选 " + id);
		for(var i = 0; i < obj.length; i++) {
			var checkboxObj = $("#" + id + " tbody input[type=checkbox]:eq(" + i + ")");
			if(checkboxObj.is(':checked')) { //已选的，状态设置成未选
				cancelSelnum++;
				checkboxObj.prop("checked", false);
				var aa = totalSelStationV.length;
				for(var k = 0; k < aa; k++) {
					if(checkboxObj.val() == totalSelStationV[k]) {
						totalSelStationV.splice(k, 1);
					}
				} //从已选数组中删除已选的项value
			}
		}
		stationNum -= cancelSelnum;
		if(stationNum < 0) {
			stationNum = 0;
		}
	}
	$("#stationNum").html(stationNum);
}

function SelctedAll(id, flag) {
	switch(flag) {
		case 1:
			{
				khflag = !khflag;
				downSelAll(khflag, id);
			}
			break;
		case 2:
			{
				wzflag = !wzflag;
				downSelAll(wzflag, id);

			}
			break;
		case 3:
			{
				ycflag = !ycflag;
				downSelAll(ycflag, id);

			}
			break;
		case 4:
			{
				pcflag = !pcflag;
				downSelAll(pcflag, id);
			}
			break;
	}

}

function toggleStation(id) {
	$("#shadowdiv").toggle();
	$("#" + id).toggle();
}

function addDate(date, days) {
	var d = new Date(date);
	d.setDate(d.getDate() + days);
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var minute = d.getMinutes();
	var sec = d.getSeconds();
	var hour = d.getHours();
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minute < 10) {
		minute = "0" + minute;
	}
	if(sec < 10) {
		sec = "0" + sec;
	}
	var val = d.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + sec;
	return val;
}

$("#getChart").bind('click', getChartFun = function() {
	//var wrwtype = $("#wrwtype").val();	
	if(totalSelStationV.length > 0) {
		var dateType = $("#dateType").val(); //MINUTE,HOUR
		var starttime = $("#startTime").val();
		var endtime = $("#endTime").val();
		getChartData(dateType, starttime, endtime);
	} else {
		alphaWindow("请选择站点信息");
	}
});
$("#stationDown .tab-pane .btn-info").click(function() {
	var parentObjTab = $(this).parent().parent()[0];
	$("#" + parentObjTab.id + ' input[type=checkbox]').prop("checked", false); //遍历所有的checkbox 值为为选中	
	switch(parentObjTab.id) { //用来恢复全选的状态值
		case "tab-kh":
			{
				khflag = false;
			}
			break;
		case "tab-wz":
			{
				wzflag = false;
			}
			break;
		case "tab-yc":
			{
				ycflag = false;
			}
			break;
		case "tab-pc":
			{
				pcflag = false;
			}
			break;
	}
	var condition = $(this).next().val();
	$(this).next().prop("value", ''); //清空筛选的条件
	if(condition != "") {
		condition = condition.trim();
		var provinceId = parent.provinceId,
			cityId = parent.cityId,
			url = $.coreApiPath + "/station/getStationsByNameId",
			p = getTabParam(),
			stechType = p.stechType,
			param = {
				"pro": provinceId,
				"city": cityId,
				"district": null,
				"equipment_type": p.equipment,
				"s_stech_type": stechType,
				"condition": condition
			},
			checkDiv = p.checksdiv,
			tabType = p.tabType;
		$("#" + checkDiv + " input:checked").each(function() {
			$(this).attr("checked", false);
		});
		var table = $("#" + p.tableId + " tbody").empty();
		$.getJSON(url, param).success(function(data) {
			if(data != null && data.length > 0) {
				var trdiv = "",
					checkboxSel = '',
					remarr = ''; //存储已经勾选了的值			
				for(var i = 0; i < data.length; i++) {
					checkboxSel = '';
					remarr = data[i].stationId + "," + tabType;
					for(var m = 0; m < totalSelStationV.length; m++) {
						if(totalSelStationV[m] == remarr) {
							checkboxSel = 'checked=\'true\'';
						}
					}
					trdiv += "<tr><td >" + data[i].stationName + "</td><td >" + data[i].stationId + "</td><td class=\"text-center\"><input type='checkbox' class='stationCheckbox' " + checkboxSel + " onclick='selectNUm(this)' value='" + data[i].stationId + "," + tabType + "'/>" + "</td></tr>";
				}
				$(table).html(trdiv);
			} else {
				var trdiv = '<tr><td class="dataTables_empty" colspan="3">暂无数据！</td></tr>';
				$(table).html(trdiv);
			}
		});
		tab = p.tab;
		if(tab == '#tab-kh') {
			tabStypes[0] = true;
		} else if(tab == '#tab-wz') {
			tabStypes[1] = true;
		} else if(tab == '#tab-yc') {
			tabStypes[2] = true;
		} else if(tab == '#tab-pc') {
			tabStypes[3] = true;
		}
	} else {
		alphaWindow("请选择搜索条件");
	}
	return false;
});

function getChartData(dateType, starttime, endtime) {
	$("#allCharts").html("");
	var startT = starttime.replace(/-/g, "/"),
		endT = endtime.replace(/-/g, "/"),
		dateS = new Date(startT),
		dateE = new Date(endT),
		dayTime = (Math.abs(dateE - dateS)) / 1000 / 60 / 60 / 24;
	if(dateType == 'MINUTE' && dayTime > 1) {
		alphaWindow("最多查询一天的数据！");
		return;
	}
	var city = parent.cityId,
		provinceId = parent.provinceId,
		param = {
			startTime: starttime,
			endTime: endtime,
			stationIds: totalSelStationV.join("|"),
			dateType: dateType,
			pro: provinceId,
			city: city
		},
		reqURL = $.coreApiPath + "/weather/customChart";
	ajax_post_info(reqURL, param, '加载', function(data) {
		if(data.length > 0) {
			var j = 0;

			for(var pos in data) {
				var result = data[pos];
				var title = "PM25浓度曲线";
				if(j == 0) title = "PM25浓度曲线";
				if(j == 1) title = "PM10浓度曲线";
				if(j == 2) title = "CO浓度曲线";
				if(j == 3) title = "SO2浓度曲线";
				if(j == 4) title = "O3浓度曲线";
				if(j == 5) title = "NO2浓度曲线";
				if(j == 6) title = "NO浓度曲线";
				if(j == 7) title = "TVOC浓度曲线";
				var a = {
					title: {
						text: title
					},
					tooltip: {
						trigger: "axis",
						formatter: function(params) {
							var obj = JSON.parse(JSON.stringify(params))
							var itemName = obj[0].name;
							var str = "<div class=\"tooltip-tit\">" + itemName + "</div>";
							var fsize = 12,
								changeWid = 150;
							for(var i = 0; i < obj.length; i++) {
								if(obj[i].value == undefined) {
									obj[i].value = '-';
								}
								str = str + "<div class=\"tooltip-data\" style=\"width:" + changeWid + "px;\"><b style=\"color: " + obj[i].color + ";\"> &bull;</b><i style=\"width:" + (changeWid - 30) + "px;\">" + obj[i].seriesName + ":" + obj[i].value + "</i>";
								str += "</div>";

							}
							return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
						},
						position: ['3%', '5%']
					},
					toolbox: {
						right: "0px",
						show: true,
						feature: {
							saveAsImage: {
								show: true
							}
						}
					},
					legend: {
						data: [],
						top: '35px',
						right: '20px',
						left: '30px'
					},
					grid: {
						top: '90px',
						x: 40,
						x2: 40,
						y2: 24
					},
					xAxis: [{
						type: "category",
						boundaryGap: !1,
						data: [],
						splitLine: {
							show: false
						}
					}],
					yAxis: [{
						type: "value",
						axisLabel: {
							formatter: "{value}"
						}
					}],
					series: []
				};
				//////////////////////////////
				a.legend.data = result.legend;
				a.xAxis[0].data = result.category;
				if(result.series) {
					for(var i = 0; i < result.series.length; i++) {
						var arr = {
							name: result.series[i].name,
							type: result.series[i].type,
							data: result.series[i].data,
							showSymbol: true,
							legendHoverLink: true,
							hoverAnimation: false
						};
						a.series.push(arr);
					}

					var chartId = "dataChart" + j;
					var rankHtml = "<div class='row'>" +
						"    <div class='col-sm-12'>" +
						"         <div class='ibox float-e-margins'>" +
						"             <div class='ibox-content'>" +
						"                 <div class='echarts' id='" + chartId + "' style=\"width:100%; height:400px;\"></div>" +
						"             </div>" +
						"         </div>" +
						"    </div>" +
						" </div>";
					$("#allCharts").append(rankHtml);
					var e1 = echarts.init(document.getElementById(chartId));
					//					e1.hideLoading();
					e1.setOption(a);
					j++;
				}
			}
		} else {
			alphaWindow("查询不到信息哦，请重新查询！");
		}
	}, "不好意思，图表请求数据失败啦!");
};
//清空
function clearSelstation() {
	var theadCheckbox = $("#stationDown thead input[type=checkbox]");
	if(theadCheckbox.is(":checked")) { //已选的"全选"checkbox 的选中状态更改
		theadCheckbox.prop("checked", false);
		khflag = wzflag = ycflag = pcflag = false;
	}
	if(totalSelStationV.length > 0) {
		$(".checkchild").attr("checked", false);
		for(var i = 0; i < totalSelStationV.length; i++) {
			var slev = totalSelStationV[i];
			$("input[class='stationCheckbox']:checked").each(function() {
				if(this.value == slev) {
					$(this).attr("checked", false);
					return;
				}
			});
		}
		totalSelStationV = [];
		stationNum = 0;
		$("#stationNum").html(stationNum);
	} else {
		alphaWindow("当前没有选中的站点");
		$("#stationNum").html('0');
	}
}
//确定
function hidemodel() {
	if(totalSelStationV.length > maxsel) {
		alphaWindow("最多查询" + maxsel + "个端站");
	} else {
		$("#stationDown").hide('slow');
		$("#shadowdiv").hide();
	}
}
$("#shadowdiv").click(function(e) {
	$("#stationDown").hide();
	$("#shadowdiv").hide();
});

/**
 * 考核初始化
 */
function init_kaohe() {
	$(".nav-tabs > li:first").click();

	//全选
	var stationType = "tab-kh-station-type";
	$("#kaoheAll").attr("checked", true);
	$("#" + stationType + " input[type='checkbox']").each(function() {
		$(this).prop("checked", true);
	});
	ajaxGetStations(4, "tab-kh-stationList", "tab-kh-station-type", "kaohe");
}

/**
 * 全选
 */
function checkAll(tabId, _this) {
	var tableId = tabId + "-stationList";
	var stationType = tabId + "-station-type";
	if($(_this).is(':checked')) {
		$("#" + stationType + " :checkbox").each(function() {
			$(this).prop("checked", true);
		});
		var tabType = "";
		var equipment = "";
		if(tabId == 'tab-kh') {
			tabType = "kaohe";
			equipment = 4;
		} else if(tabId == 'tab-wz') {
			tabType = "weizhan";
			equipment = 0;
		} else if(tabId == 'tab-yc') {
			tabType = "yangcheng";
		} else {
			tabType = "pachong";
		}
		ajaxGetStations(equipment, tableId, stationType, tabType);
	} else {
		$("#" + stationType + " input[type='checkbox']").each(function() {
			$(this).removeAttr("checked");
			// $(this).attr("checked", false);
		});
		$("#" + tableId + " tbody").empty();
		var trdiv = '<tr><td class="dataTables_empty" colspan="3">暂无数据！</td></tr>';
		$("#" + tableId + " tbody").html(trdiv);
	}
}

/**
 * 选中
 * @param obj
 */
function selectNUm(obj) {
	if((stationNum + 1) > maxsel) {
		//$("#errmesg").modal('show');
		if(obj.checked) {
			obj.checked = false;
			modelWindow('选择站点信息已达上限！');
		} else {
			if(stationNum > 0) {
				stationNum--;
				for(var i = 0; i < totalSelStationV.length; i++) {
					if(obj.value == totalSelStationV[i]) {
						totalSelStationV.splice(i, 1);
					}
				}
			}
		}

	} else {
		if(obj.checked) {
			stationNum++;
			totalSelStationV.push(obj.value);
		} else {
			if(stationNum > 0) {
				stationNum--;
				for(var i = 0; i < totalSelStationV.length; i++) {
					if(obj.value == totalSelStationV[i]) {
						totalSelStationV.splice(i, 1);
					}
				}
			}
		}
	}
	$("#stationNum").html(stationNum);
}

/**
 * tab 点击事件
 */
$(".nav-tabs li").bind('click', function() {
	var tab = $(this).find("a").attr("href");

	//加载站点类型
	if(tab == '#tab-kh') {
		if(!tabStypes[0]) loadStationType(tab);
	} else if(tab == '#tab-wz') {
		if(!tabStypes[1]) loadStationType(tab);
	} else if(tab == '#tab-yc') {
		if(!tabStypes[2]) loadStationType(tab);
	} else if(tab == '#tab-pc') {
		if(!tabStypes[3]) loadStationType(tab);
	}
});

function loadStationType(tab) {
	var provinceId = parent.provinceId;
	var cityId = parent.cityId;
	var type = 11;
	var url = $.coreApiPath + "/dictionary/chdConfigByProCity";
	var p = getTabParam(tab);
	var code = p.code;
	var stechType = p.stechType;
	var param = {
		"type": type,
		"pro": provinceId,
		"city": cityId,
		"code": code
	};
	var stypes = $(tab + "-station-type");
	$(stypes).empty();
	$(stypes).html("");
	$.ajaxSettings.async = false;
	$.ajax({
		type: "post",
		url: url,
		async: false,
		data: param,
		datatype: "json",
		beforeSend: loadingWindow, // 发送请求
		complete: closeAllLayer, // 请求完成
		success: function(data) {
			//console.log("请求完成！");
			var tdiv = "";
			if(data != null) {
				for(var i = 0; i < data.length; i++) {
					tdiv += '<div class="checkbox i-checks" style="width:130px;"><label><input class="form-control" onclick="showStation();" type="checkbox" value="' + data[i].code + ',' + stechType + '"/>' + data[i].name + '</div>';
				}
			}
			$(stypes).html(tdiv);
		},
		error: function() {}
	});
	switch(tab) {
		case '#tab-kh':
			{
				tabStypes[0] = true;
			}
			break;
		case '#tab-wz':
			{
				tabStypes[1] = true;
			}
			break;
		case '#tab-yc':
			{
				tabStypes[2] = true;
			}
			break;
		case '#tab-pc':
			{
				tabStypes[3] = true;
			}
			break;
	}
}

/**
 * 根据复选框获取站点信息
 */
function showStation() {
	var params = getTabParam();
	//控制全选
	checkAllstatus(params.checksdiv, params.allId);
	ajaxGetStations(params.equipment, params.tableId, params.checksdiv, params.tabType);
}

function checkAllstatus(checkdiv, allId) {
	var flag = false;
	$("#" + checkdiv + " :checkbox").each(function() {
		if(!$(this).is(':checked')) {
			flag = true;
			return;
		}
	});
	if(flag) {
		$("#" + allId).prop("checked", false);
	} else {
		$("#" + allId).prop("checked", true);
	}
}

function ajaxGetStations(equipment, tableId, checksdiv, tabType) {
	var chk_value = [];
	$("#" + checksdiv + " input:checked").each(function() {
		chk_value.push($(this).val());
	});
	if(chk_value.length > 0) {
		var provinceId = parent.provinceId;
		var city = parent.cityId;
		var param = {
			"equipment_type": equipment,
			"typeArrys": chk_value.join("|"),
			"pro": provinceId,
			"city": city,
			"district": null
		};
		var url = $.coreApiPath + "/station/getStationsByProCityDisMult";
		var table = $("#" + tableId + " tbody").empty();
		$.getJSON(url, param).success(function(data) {
			if(data != null && data.length > 0) {
				var trdiv = "",
					checkboxSel = '',
					remarr = ''; //存储已经勾选了的值	
				for(var i = 0; i < data.length; i++) {
					checkboxSel = '';
					remarr = data[i].stationId + "," + tabType;
					for(var m = 0; m < totalSelStationV.length; m++) {
						if(totalSelStationV[m] == remarr) {
							checkboxSel = 'checked=\'true\'';
						}
					}
					trdiv += "<tr><td >" + data[i].stationName + "</td><td >" + data[i].stationId + "</td><td class=\"text-center\"><input type='checkbox' class='stationCheckbox' " + checkboxSel + " onclick='selectNUm(this)' value='" + data[i].stationId + "," + tabType + "'/>" + "</td></tr>";
				}
				$(table).html(trdiv);
			} else {
				var trdiv = '<tr><td class="dataTables_empty" colspan="3">暂无数据！</td></tr>';
				$(table).html(trdiv);
			}
		});
	} else {
		$("#" + tableId + " tbody").empty();
		var trdiv = '<tr><td class="dataTables_empty" colspan="3">暂无数据！</td></tr>';
		$("#" + tableId + " tbody").html(trdiv);
	}
}

function getTabParam(ctab) {
	var tab;
	if(ctab != null) {
		tab = ctab;
	} else {
		tab = $(".nav-tabs li[class='active'] a").attr("href");
	}

	var equipment = "",
		tableId = "",
		checksdiv = "",
		tabType = "",
		code = "",
		stechType = "",
		allId = "";
	if(tab == '#tab-kh') {
		equipment = 4;
		tableId = "tab-kh-stationList";
		checksdiv = "tab-kh-station-type";
		tabType = "kaohe";
		code = "98";
		stechType = "98";
		allId = "kaoheAll";
	} else if(tab == '#tab-wz') {
		equipment = 0;
		tableId = "tab-wz-stationList";
		checksdiv = "tab-wz-station-type";
		tabType = "weizhan";
		code = "1010";
		stechType = "1010,6010";
		allId = "wzAll";
	} else if(tab == '#tab-yc') {
		tableId = "tab-yc-stationList";
		checksdiv = "tab-yc-station-type";
		tabType = "yangcheng";
		code = "101";
		stechType = "101";
		allId = "ycAll";
	} else if(tab == '#tab-pc') {
		tableId = "tab-pc-stationList";
		checksdiv = "tab-pc-station-type";
		tabType = "pachong";
		code = "99";
		stechType = "99";
		allId = "pcAll";
	}
	var param = {
		tab: tab,
		equipment: equipment,
		tableId: tableId,
		checksdiv: checksdiv,
		tabType: tabType,
		code: code,
		stechType: stechType,
		allId: allId
	};
	return param;
}

$('#khzdmc,#wzzdmc,#yczdmc,#pczdmc').keydown(function(e) {
	if(e.keyCode == 13) {
		$(this).prev(".btn-info").click();
	}
});