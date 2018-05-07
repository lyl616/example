
var xAxis, no2_lst,
    pm25_lst,
    pm10_lst,
    o3_lst,
    aqi_lst,
    co_lst,
    so2_lst;

function popWindowset(station, map_grade) {
    layer.open({
        skin: 'leafletLay-popup-contianer',
        type: 1,
        title: false, //不显示标题栏
        closeBtn: true,
        area: ['620px', '500px'],
        shade: 0.3,
        id: 'LAY_layuipro', //设定一个id，防止重复弹出
        resize: false,
        btnAlign: 'c',
        moveType: 1, //拖拽模式，0或者1
        content: '<div class="leaflet-popup-content"><div class="loading_popup_msg">加载中...</div></div>',
        success: function (layero) {
            // console.log("点击成功按钮执行的事件！");
        }
    });
    var stationId = station.id,
        cityCode = station.id,
        insTime = station.insTime;
    if (map_grade == "country") {
        stationId = "-1";
        cityCode = station.id
    } else {
        stationId = station.id;
        cityCode = "-1";
    }
    var pop_url = $.coreApiPath + '/realtimePC/getPriStationData';
    var param = {
        stationId: stationId,
        cityCode: cityCode,
        insTime: insTime,
        total: 72
    };
    $.ajax({
        type: 'POST',
        url: pop_url,
        dataType: 'json',
        data: param,
        success: function (data) {
            if (data.erroCode == 2000) {
                var station_city_fg = true,
                    html = '';
                html = restStatiion_html(data.result.topic);
                $('.leaflet-popup-content').html(html);
                var detail = data.result.detail;
                xAxis = detail.insTime;
                no2_lst = detail.no2;
                pm25_lst = detail.pm25;
                pm10_lst = detail.pm10;
                o3_lst = detail.o3;
                aqi_lst = detail.aqi;
                co_lst = detail.co;
                so2_lst = detail.so2;

                hourlyChartFun(xAxis, aqi_lst, 'AQI'); //加载浓度曲线
                particulateChartFun(xAxis, pm10_lst, pm25_lst, aqi_lst); //加载颗粒物曲线
                gaseousChartFun(xAxis, co_lst, no2_lst, so2_lst, o3_lst, aqi_lst); //加载气曲线
            } else {
                $('.loading_popup_msg').html("暂无数据！");
            }
        }
    });

}

function restStatiion_html(data) {
    var level = data.level + '';
    if (level == "-1" || level.indexOf("-") != -1) {
        level = "--";
    } else {
        level = level + "级";
    }

    var aqiFirst = data.aqiFirst + "";
    if (aqiFirst.indexOf("-") == -1) {
        var num_pollution = getnumber(aqiFirst),
            str_pollution = getletter(aqiFirst);

        if (num_pollution == 25) {
            num_pollution = 2.5;
        }
        aqiFirst = str_pollution.toUpperCase() + '<sub>' + num_pollution + '</sub>';
    }
    var html = '';
    html += '<div class="pop_st_baseinfo" style="width:600px;">';
    html += '	<div class=\'pop_st_tit\'>';
    if (map_grade == "country") {
        html += data.proName + '        ' + data.cityName;
    } else {
        html += data.proName + '		' + data.cityName + '		' + data.stationType + '        ' + data.stationName + '    【' + data.stationId + '】';
    }
    data.insTime += ":00"
    html += '	</div>';
    html += '<div class="pop_st_baseinfo" style="width:600px;">';
    html += '	<ol class="pop_st_ol">';
    html += '		<li>空气质量等级：' + data.grade + '</li>';
    html += '		<li>空气质量级别： ' + level + '</li>';
    html += '		<li>首要污染物：' + aqiFirst + '</li>';
    html += '		<li class="text-right">最后时间：' + new Date(data.insTime).Format("yyyy-MM-dd HH:mm") + '</li>';
    html += '	</ol>';
    html += '	<table cellpadding="0" cellspacing="0" class="pop_st_table">';
    html += '		<tr class="even">';
    html += '			<td>AQI</td>';
    html += '			<td>PM<sub>2.5</sub></td>';
    html += '			<td>PM<sub>10</sub></td>';
    html += '			<td>SO<sub>2</sub></td>';
    html += '			<td>NO<sub>2</sub></td>';
    html += '			<td>CO</td>';
    html += '			<td>O<sub>3</sub></td>';
    html += '			<td>温度</td>';
    html += '			<td>湿度</td>';
    html += '			<td>风力</td>';
    html += '			<td>风向</td>';
    html += '			<td>气压</td>';
    html += '		</tr>';
    html += '		<tr class="odd">';
    html += '			<td>' + data.aqi + '</td>';
    html += '			<td>' + data.pm25 + '</td>';
    html += '			<td>' + data.pm10 + '</td>';
    html += '			<td>' + data.so2 + '</td>';
    html += '			<td>' + data.no2 + '</td>';
    html += '			<td>' + data.co + '</td>';
    html += '			<td>' + data.o3 + '</td>';
    html += '			<td>' + data.temperature + '</td>';
    html += '			<td>' + data.humidity + '</td>';
    html += '			<td>' + data.windPowerValue + '</td>';
    html += '			<td>' + data.windDirection + '</td>';
    html += '			<td>' + data.pressure + '</td>';
    html += '		</tr>';
    html += '	</table>';
    html += '	<div class="pop_st_echarts">';
    html += '		近72小时浓度曲线（小时数据）';
    html += '		<div class="pull-right" >';
    html += '           <select id="pollution_type_char"  onchange="changeChar()">';
    html += '               <option value="aqi" selected>AQI</option>';
    html += '               <option value="pm25">PM2.5</option>';
    html += '               <option value="pm10">PM10</option>';
    html += '               <option value="co">CO</option>';
    html += '               <option value="so2">SO2</option>';
    html += '               <option value="o3">O3</option>';
    html += '               <option value="no2">NO2</option>';
    html += '           </select>';
    html += '			<button class="btn btn-xs btn-info m-l-10" onclick="showEcharts(1,this,\'hourlyChart\')">浓度</button>';
    html += '			<button class="btn btn-xs btn-white" onclick="showEcharts(2,this,\'particulateChart\')">颗粒物</button>';
    html += '			<button class="btn btn-xs btn-white" onclick="showEcharts(3,this,\'gaseousChart\')">气体</button>';
    html += '		</div>';
    html += '	</div>';
    html += '	<div class="pop_st_echarts_detail">';
    html += '		<div id="hourlyChart" class="positionAbs opacity1 zindex1" style="width: 600px; height: 300px;"></div>';
    html += '		<div id="particulateChart" class="positionAbs opacity0 zindex0" style="width: 600px; height: 300px;"></div>';
    html += '		<div id="gaseousChart" class="positionAbs opacity0 zindex0" style="width: 600px; height: 300px;"></div>';
    html += '	</div>';
    html += '</div>';
    return html;
}

function changeChar() {
    var p_type = $("#pollution_type_char").val();
    var obj = getShowData(p_type);
    hourlyChartFun(xAxis, obj[0], obj[1]); //加载浓度曲线
}

function getShowData(p_type) {
    switch (p_type) {
        case 'aqi':
            return [aqi_lst, "AQI"]
        case 'pm25':
            return [pm25_lst, "PM25"]
        case 'pm10':
            return [pm10_lst, "PM10"]
        case 'co':
            return [co_lst, "CO"]
        case 'so2':
            return [so2_lst, "SO2"]
        case 'o3':
            return [o3_lst, "O3"]
        case 'no2':
            return [no2_lst, "NO2"]

    }
}