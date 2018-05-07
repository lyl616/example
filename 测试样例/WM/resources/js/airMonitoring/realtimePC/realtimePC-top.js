/** ******************top10开始******************* */
/**
 * Created by yulongliu on 2017/4/12.
 */

var equipment_type = "0"; //设备类型微型站 0   小型站1    移动站2    VOC3    外部站4（外部站类别，爬虫，考核站）
var s_stech_type = "6010"; //： 站点数据来源（设备类型） 单传感器 6010 ６传感器 1010   爬虫源 99   考核站 98  扬尘  101  VOC5010
var stationType = "-1"; // 站点类型 -1：表示全部
var tab_clickFlag = true;
var reqStation_type='wz';

/**
 * 格式化表头
 */
function initTopTableStyle() {
    var PolutionTypeStr = currentPolutionType.toUpperCase(),
        Polutionvalnum = PolutionTypeStr.replace(/[^0-9]/ig, ""),
        pollutionV = PolutionTypeStr.replace(/\d+/g, '');
    if (Polutionvalnum == "25") {
        Polutionvalnum = "2.5";
    }
    if (pollutionV == "VOCS") {
        pollutionV = 'TVOC';
    }

    var pm25Title = '<td class="text-center" width="15%">排名</td><td class="text-center" width="45%">监控点</td> <td class="text-center" width="20%" id="td_now_AQI">' + pollutionV + '<sub>' + Polutionvalnum + '</td>'
    var aqi2Title = '<td class="text-center" width="10%">排名</td><td class="text-center" width="40%">监控点</td> <td class="text-center" width="20%" id="td_now_AQI">AQI</td> <td class="text-center" width="20%">首要污染物</td>'
    var aqiTitle = '<td class="text-center" width="10%">排名</td><td class="text-center" width="40%">监控点</td> <td class="text-center" width="20%" id="td_now_AQI">标准AQI</td> <td class="text-center" width="20%">首要污染物</td>'
    if (currentPolutionType.indexOf("aqi") != -1) {
        if ("aqi" == currentPolutionType) {
            $("#tr_24_title").html(aqiTitle);
            $("#tr_now_title").html(aqiTitle);
        }
        else if ("aqi2" == currentPolutionType) {
            $("#tr_24_title").html(aqi2Title);
            $("#tr_now_title").html(aqi2Title);
        }
        $("#myTabContent .table-tst td.colspans").attr("colspan", 4);
    } else {
        $("#tr_24_title").html(pm25Title);
        $("#tr_now_title").html(pm25Title);
        $("#myTabContent .table-tst td.colspans").attr("colspan", 3);
    }
}

/**
 * 初始化实时
 * @param flag   0代表页面初始化 1表示点击微站
 */
function clkNowTab(flag) { //点击左上的btn状态切换， 【站点信息】下拉列表 tab 对应标签切换
    init_switchTal();
    if (flag == "0") {
        var ALLStation = $('#rankingFilter #ALL');
        rankingFilterClick(ALLStation); //触发右侧的“站点信息的点击事件”
    } else if (flag == "1") {
        var WZStation = $('#rankingFilter #WZ');
        rankingFilterClick(WZStation); //触发右侧的“站点信息的点击事件”
    }

    $("#btn-clkWZ").addClass("btn-info");
    $("#btn-clkKH").removeClass("btn-info")
    $("#btn-clkYC").removeClass("btn-info")

    $("#is_now_24").val("aqi_now");
    $("#td_now_AQI").html("AQI");
    $("#td_24_AQI").html("AQI");
    reqStation_type='wz';
    getNowHourTP10AqiData('wz');
}

//24小时tab
function clk24Tab() {
    init_switchTal();
    var WZStation = $('#rankingFilter #WZ');
    rankingFilterClick(WZStation); //触发右侧的“站点信息的点击事件”
    $("#btn-clkWZ").addClass("btn-info");
    $("#btn-clkKH").removeClass("btn-info")
    $("#btn-clkYC").removeClass("btn-info")
    $("#is_now_24").val("aqi_24");
    $("#td_now_AQI").html("AQI");
    $("#td_24_AQI").html("AQI");
    reqStation_type='wz';
    get24HourTP10AqiData('wz');
}

function init_switchTal() {
    $("#polutionTab b").removeClass("btn-white");
    $("#polutionTab b").addClass("btn-white");
    $("#polutionTab b").css("cursor", 'pointer');
    if (!tab_clickFlag) {
        switchTab($("#polutionTab b"));
        tab_clickFlag = true;
    }
    //switchTab($("#polutionTab b"));
}

function remove_switchTab() {
    var type_a = $("#polutionTab b");
    type_a.off("click");
    for (var i in type_a) {
        if (type_a[i].id == 'pm10') {
            type_a.removeClass('btn-white');
            type_a.removeClass('btn-info');
            type_a.addClass('btn-white');
            type_a.css("cursor", 'inherit');
            $(type_a[i]).addClass("btn-info");
            currentPolutionType = type_a[i].id;
            var lendType = currentPolutionType == "aqi2" ? "aqi" : currentPolutionType;
            var src = $.ctx + "/resources/img/legend/legend-" + lendType + ".png";
            $(".Legend img").attr("src", src);
        }
    }
}

/**
 * 点击考核站
 */
function clkKH() {
    init_switchTal();
    var KHStation = $('#rankingFilter #BG');
    rankingFilterClick(KHStation); //触发右侧的“站点信息的点击事件”
    $("#td_now_AQI").html("AQI");
    $("#td_24_AQI").html("AQI");

    $("#btn-clkWZ").removeClass("btn-info");
    $("#btn-clkKH").addClass("btn-info")
    $("#btn-clkYC").removeClass("btn-info")
    var is_now_24 = $("#is_now_24").val();
    reqStation_type='kh';
    if (is_now_24 == "aqi_24") {
        get24HourTP10AqiData('kh');
    } else if (is_now_24 == "aqi_now") {
        getNowHourTP10AqiData('kh');
    }
}

/**
 * 点击微站
 */
function clkWZ() {
    init_switchTal();
    var WZStation = $('#rankingFilter #WZ');
    rankingFilterClick(WZStation); //触发右侧的“站点信息的点击事件”
    $("#btn-clkWZ").addClass("btn-info");
    $("#btn-clkKH").removeClass("btn-info");
    $("#btn-clkYC").removeClass("btn-info");
    reqStation_type='wz';
    var is_now_24 = $("#is_now_24").val();

    if (is_now_24 == "aqi_24") {
        get24HourTP10AqiData('wz');
    } else if (is_now_24 == "aqi_now") {

        getNowHourTP10AqiData('wz');
    }
}

/**
 * 点击扬尘站
 */
function clkYC() {
    tab_clickFlag = false;
    remove_switchTab();
    var YCStation = $('#rankingFilter #OTHER');
    rankingFilterClick(YCStation); //触发右侧的“站点信息的点击事件”
    $("#polutionLabel").html('PM<sub>10</sub>');
    $("#td_now_AQI").html("PM10");
    $("#td_24_AQI").html("PM10");
    $("#btn-clkWZ").removeClass("btn-info");
    $("#btn-clkKH").removeClass("btn-info")
    $("#btn-clkYC").addClass("btn-info")
    reqStation_type='yc';
    var is_now_24 = $("#is_now_24").val();
    if (is_now_24 == "aqi_24") {
        get24HourTP10AqiData('yc');
    } else if (is_now_24 == "aqi_now") {

        getNowHourTP10AqiData('yc');
    }
}

/**
 * 考核站24小时AQI排行
 * @param type kh 考核站  wz 微站
 */
function get24HourTP10AqiData(type) {
    $("#btn-clkKH").show();
    $("#btn-clkYC").show();
    var value = currentPolutionType.toUpperCase(),
        valnum = value.replace(/[^0-9]/ig, ""),
        pollutionV = currentPolutionType.replace(/\d+/g, '').toUpperCase();
    if (valnum == "25") {
        valnum = "2.5";
    }
    var pollutionV = currentPolutionType.replace(/\d+/g, '').toUpperCase(),
        vhtm = '（μg/m<sup>3</sup>）';

    if (pollutionV == "AQI") {
        vhtm = '';
    } else if (pollutionV == "CO" || pollutionV == "VOCS") {
        vhtm = '（mg/m<sup>3</sup>）';
        if (pollutionV == "VOCS") { //仅在tvoc 时候隐藏考核站和微站的按钮
            pollutionV = 'TVOC';
            $("#btn-clkKH").hide();
            $("#btn-clkYC").hide();
            var WZStation = $('#rankingFilter #WZ');
            rankingFilterClick(WZStation); //触发右侧的“站点信息的点击事件”

        }
    }


    var tempHtml = pollutionV + "<sub>" + valnum + "</sub>";
    if (currentPolutionType == "aqi2") {
        tempHtml = "AQI";
    } else if (currentPolutionType == "aqi") {
        tempHtml = "标准AQI";
    }

    $("#best_title_24").html("【" + tempHtml + "】TOP10高浓度站排名/最差 " + vhtm);
    $("#bad_title_24").html("【" + tempHtml + "】TOP10高浓度站排名/最好 " + vhtm);

    initTopTableStyle();

    var url = $.coreApiPath + "/realtimePC/get24AqiData";
    var postData = {
        city: $("#city").val(),
        pollution_type: currentPolutionType,
        station_type: type
    };
    var rank_24_end10 = $("#rank_24_end10");
    var rank_24_top10 = $("#rank_24_top10");
    rank_24_end10.html("");
    rank_24_top10.html("");
    $("#tab_now_show_time").html("");

    ajax_post(url, postData, function (r) {
        if (r.result) {
            var data = r.data;
            var end10AqiData = data.end10AqiData;
            var top10AqiData = data.top10AqiData;
            if (end10AqiData.length > 0) {
                currentSortTop10Data = end10AqiData;
                var tempEndHtml = mkEnd10Html(end10AqiData);
                rank_24_end10.html(tempEndHtml);
                var data = getDataByPolutionType(currentPolutionType, currentRankingListType);
                addData2Marker(data);
            }

            if (top10AqiData.length > 0) {
                var tempTopHtml = mkTop10Html(top10AqiData);
                rank_24_top10.html(tempTopHtml);
            }
        }
    });
}

/**
 * 实时 考核站 获取当前城市top 10 排名
 * @param type kh 考核站  wz 微站
 */
function getNowHourTP10AqiData(type) {
    $("#btn-clkKH").show();
    $("#btn-clkYC").show();
    initTopTableStyle();
    var value = currentPolutionType.toUpperCase();
    var valnum = value.replace(/[^0-9]/ig, "");
    if (valnum == "25") {
        valnum = "2.5";
    }
    var pollutionV = currentPolutionType.replace(/\d+/g, '').toUpperCase(),
        vhtm = '（μg/m<sup>3</sup>）';

    if (pollutionV == "AQI") {
        vhtm = '';
    } else if (pollutionV == "CO") {
        vhtm = '（mg/m<sup>3</sup>）';

    } else if (pollutionV == "VOCS") {
        //仅在tvoc 时候隐藏考核站和微站的按钮
        pollutionV = 'TVOC';
        $("#btn-clkKH").hide();
        $("#btn-clkYC").hide();
    }


    var tempHtml = pollutionV + "<sub>" + valnum + "</sub>";
    if (currentPolutionType == "aqi2") {
        tempHtml = "AQI";
    } else if (currentPolutionType == "aqi") {
        tempHtml = "标准AQI";
    }

    $("#bad_title_now").html("【" + tempHtml + "】TOP10高浓度站排名/最差 " + vhtm);
    $("#best_title_now").html("【" + tempHtml + "】TOP10高浓度站排名/最好 " + vhtm);

    var url = $.coreApiPath + "/realtimePC/getNowTP10AqiData";
    var postData = {
        'city': $("#city").val(),
        'pollution_type': currentPolutionType,
        'station_type': type
    };
    var rank_now_end10 = $("#rank_now_end10");
    rank_now_end10.html("");
    var rank_now_top10 = $("#rank_now_top10");
    rank_now_top10.html("");
    $("#tab_now_show_time").html("");

    ajax_post(url, postData, function (r) {
        if (r.result) {
            var data = r.data;
            var end10AqiData = data.end10AqiData;
            var top10AqiData = data.top10AqiData;
            if (end10AqiData.length > 0) {
                currentSortTop10Data = end10AqiData;
                var insTime = end10AqiData[0].insTime;
                $("#tab_now_show_time").html(insTime);
                var tempEndHtml = mkEnd10Html(end10AqiData);
                rank_now_end10.html(tempEndHtml);
                var data = getDataByPolutionType(currentPolutionType, currentRankingListType);
                addData2Marker(data);
            }

            if (top10AqiData.length > 0) {
                var tempTopHtml = mkTop10Html(top10AqiData);
                rank_now_top10.html(tempTopHtml);
            }
        }
    });
}

function mkTop10Html(listAqiData) {
    var tempHtml = "";
    for (var i = 0; i < 10; i++) {
        var td1 = "<td class=\"text-center\"><span class=\"top_3\">" + (i + 1) + "</span></td>"

        if (typeof(listAqiData[i]) != "undefined") {
            var pvalue = listAqiData[i].pvalue;

            var level = getLevalByValAndType(pvalue, currentPolutionType);
            var fontcolor = "#0c1726";
            if (level > 3) {
                fontcolor = "#fff";
            }
            var colr = getColorByLevel(level);

            if (currentPolutionType == "co") {
                pvalue = pvalue.toFixed(1);
            } else {
                pvalue = pvalue.toFixed(0);
            }
            var district = listAqiData[i].district;

            var districtHtml = (district == "" && district != "undefined") ? "" : "" + district;

            if (currentPolutionType.indexOf("aqi") != -1) {
                var aqiFirst = getAqiFirst(listAqiData[i].aqiFirst);
                var id = 'top' + i
                var td2 = "<td class=\"text-center\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: " + fontcolor + ";\">" + pvalue + "</span></td>";
                if ("aqi2" == currentPolutionType) {
                    var validCommentRt = listAqiData[i].validCommentRt;
                    if (validCommentRt != "undefined" && validCommentRt != null && validCommentRt != "") {
                        td2 = "<td class=\"text-center\" id='" + id + "' onmouseover=\"showTip('" + validCommentRt + "','" + id +
                            "')\" onmouseout=\"hideTip()\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: " + fontcolor
                            + ";\">" + pvalue + "*</span></td>";
                    }
                }
                else if ("aqi" == currentPolutionType) {
                    var validComment = listAqiData[i].validComment;;
                    if (validComment != "undefined" && validComment != null && validComment != "") {
                        td2 = "<td class=\"text-center\" id='" + id + "' onmouseover=\"showTip('" + validComment + "','" + id +
                            "')\" onmouseout=\"hideTip()\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: " + fontcolor + ";\">" +
                            pvalue + "*</span></td>";
                    }
                }
                tempHtml += "<tr onclick='showStationInfo(\"" + listAqiData[i].stationId + "\")'>" + td1 +
                    "<td class=\"text-center cursor-p\">" + districtHtml + "      " + listAqiData[i].stationName + "</td>" + td2 +
                    "<td class=\"text-center\">" + aqiFirst + "</td></tr>";
            } else {
                tempHtml += "<tr onclick='showStationInfo(\"" + listAqiData[i].stationId + "\")'>" + td1 +
                    "<td class=\"text-center cursor-p\">" + districtHtml + "      " + listAqiData[i].stationName + "</td>" +
                    "<td class=\"text-center\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: " + fontcolor + ";\">" + pvalue +
                    "</span></td></tr>";

            }
        }
    }
    return tempHtml;
}



function mkEnd10Html(listAqiData) {
    var tempHtml = "";
    for (var i = 0; i < 10; i++) {
        if (typeof(listAqiData[i]) != "undefined") {
            var td1 = "<td class=\"text-center\"><span class=\"top_other\">" + (i + 1) + "</span></td>"
            if (i == 0) {
                td1 = "<td class=\"text-center\"><span class=\"top_1\">" + (i + 1) + "</span></td>"
            } else if (i == 1) {
                td1 = "<td class=\"text-center\"><span class=\"top_2\">" + (i + 1) + "</span></td>"
            } else if (i == 2) {
                td1 = "<td class=\"text-center\"><span class=\"top_3\">" + (i + 1) + "</span></td>"
            }
            var pvalue = listAqiData[i].pvalue;
            var level = getLevalByValAndType(pvalue, currentPolutionType);
            var fontcolor = "#0c1726";
            if (level > 3) {
                fontcolor = "#fff";
            }
            var colr = getColorByLevel(level);
            var district = listAqiData[i].district;
            var districtHtml = (district == "" && district != "undefined") ? "" : "     " + district;
            if (currentPolutionType == "co") {
                pvalue = pvalue.toFixed(1);
            } else {
                pvalue = pvalue.toFixed(0);
            }
            if (currentPolutionType.indexOf("aqi") != -1) {
                var aqiFirst = getAqiFirst(listAqiData[i].aqiFirst);
                var id = 'end' + i;
                var td2 = "<td class=\"text-center\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: " + fontcolor + ";\">"
                    + pvalue + "</span></td>";
                if ("aqi2" == currentPolutionType) {
                    var validCommentRt = listAqiData[i].validCommentRt;
                    if (validCommentRt != "undefined" && validCommentRt != null && validCommentRt != "") {
                        td2 = "<td class=\"text-center\" id='" + id + "' onmouseover=\"showTip('" + validCommentRt + "','"
                            + id + "')\" onmouseout=\"hideTip()\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: "
                            + fontcolor + ";\">" + pvalue + "*</span></td>";
                    }
                }
                else if ("aqi" == currentPolutionType) {
                    var validComment = listAqiData[i].validComment;
                    if (validComment != "undefined" && validComment != null && validComment != "") {
                        td2 = "<td class=\"text-center\" id='" + id + "' onmouseover=\"showTip('" + validComment + "','"
                            + id + "')\" onmouseout=\"hideTip()\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: "
                            + fontcolor + ";\">" + pvalue + "*</span></td>";
                    }
                }
                tempHtml += "<tr onclick='showStationInfo(\"" + listAqiData[i].stationId + "\")'>" + td1 +
                    "<td class=\"text-center cursor-p\">" + districtHtml + "      " + listAqiData[i].stationName + "</td>" + td2 +
                    "<td class=\"text-center\">" + aqiFirst + "</td></tr>";
            } else {
                tempHtml += "<tr onclick='showStationInfo(\"" + listAqiData[i].stationId + "\")'>'>" + td1 +
                    "<td class=\"text-center cursor-p\">" + districtHtml + "      " + listAqiData[i].stationName + "</td>" +
                    "<td class=\"text-center\"><span class=\"difcolorb\" style=\"background:" + colr + ";color: " + fontcolor + ";\">" + pvalue + "</span></td>" +
                    "</tr>";

            }
        }
    }
    return tempHtml;
}

/** ******************top10 end******************* */