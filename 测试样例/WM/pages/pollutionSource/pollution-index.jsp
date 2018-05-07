<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../system/include_pollution.jsp" %>
<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 系统管理</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>

    <script type="text/javascript" src="${ctx }/resources/js/pollutionSource/pollutionSource-index.js"></script>
    <script type="text/javascript" src="${ctx }/resources/js/pollutionSource/pollution-index-range.js"></script>
    <script type="text/javascript" src="${ctx }/resources/js/common/weather-air.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/management/pollution/pollution-detail.js"></script>

    <script type="text/javascript" src="${ctx}/resources/js/common/timer.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            $('#myContent').layout({
                applyDemoStyles: true
            });
        });
    </script>
</head>

<body style="background-color: white;">
<%@ include file="../V1/topMenu.jsp" %>
<input type="hidden" name="province" id="province" value="<c:out value='${auth.user.pro}'/>">
<input type="hidden" name="city" id="city" value="<c:out value='${auth.user.city}'/>">
<input type="hidden" name="mapCenter" id="mapCenter" value="<c:out value='${auth.user.cityName}'/>">
<div class="Map-All">

    <div style="position: absolute; height: 100%; cursor: default; left: 230px;">

        <!-- 条件查询 表头开始 -->
        <div id="myTabContent" class="tab-content" style="height: 11%;">
            <div class="col-md-12" style="clear: both; margin-left: 1%; height: 60px; border: 1px solid #BEBEBE; padding-top: 20px; position: relative; margin: 0px 0px; width: 100%">
                <p style="border: 1px solid #BEBEBE; position: absolute; bottom: 38px; text-align: center; z-index: 1000; background: #FFFFFF;" class="col-md-1">查询</p>
                <div class="input-group input-daterange col-md-4 " style="float: left;">
                    <input type="text" class="form-control " onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',maxDate:'#F{$dp.$D(\'endTime\',{H:-1})||\'%y-%M-%d {%H-1}:%m\'}'})" id="startTime" name="start" placeholder="Date Start">
                    <span class="input-group-addon" style="width:13px; padding: 0 5px;">-</span>
                    <input type="text" class="form-control " onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:00:00',minDate:'#F{$dp.$D(\'startTime\')}',maxDate:'%y-%M-%d %H:%m'})" id="endTime" name="end"
                                                           placeholder="Date End">
                </div>

                <div style="padding-top: 5px;" class="left col-md-7">
                    <div class="left time-pre" id="btn-pre"></div>
                    <div class="left time-play m-l-10" id="btn-play" onclick="timerPlay()"></div>
                    <div class="left time-next m-l-10" id="btn-next"></div>
                    <div class="left m-l-10">
                        间隔： <select id="interval" style="height: 30px; line-height: 30px;">
                        <option value='1' selected="selected">时</option>
                    </select>
                    </div>
                    <div class="left m-l-10">
                        半径： <select id="radius" style="height: 30px; line-height: 30px;">
                        <option value='1000'>1km</option>
                        <option value='3000'>3km</option>
                        <option value='5000' selected="selected">5km</option>
                        <option value='10000'>10km</option>
                    </select>
                    </div>

                    <div class="left m-l-10" style="width: 200px; height: 50px; margin-top: -20px;">
                        <div id="nowDate" style="height: 20px; line-height: 20px; text-align: center; font-size: 12px;">2017-01-01 12:00:00</div>
                        <div id="progressbar" style="height: 30px;">
                            <div class="progress-label" style="text-align: center; font-size: 10px;">0%</div>
                        </div>
                    </div>
                </div>
                <button type="button" class="btn btn-white col-md-offset-4" style="padding: 5px 10px; position: absolute; right: 10px; bottom: 5px; background: #38B1B9;" data-toggle="modal" data-target="#addModal" id="currentRange">当月排名：</button>
            </div>
        </div>
        <!-- 条件查询 表头结束 -->


        <div id="myContent" style="height: 86%; width: 100%; cursor: default; overflow: hidden; position: relative;">
            <div class="ui-layout-center">
                <div id="WMMAP" style="width: 100%; height: 100%;"></div>
                <!-- 切换污染物start -->
                <div class="WMMapAQI f-s-12" id="polution_type" style="top: 5%;">
                    <a href="#" id="t_aqi" style="font-size: 12px"><i>AQI</i></a> <b class="WMMapAQI-gap"></b> <a href="#" id="t_pm25" class="Index"><i>PM<span class="sub f-s-8">2.5</span></i></a> <b class="WMMapAQI-gap"></b> <a href="#" id="t_pm10"><i>PM<span
                        class="sub f-s-8">10</span></i></a> <b class="WMMapAQI-gap"></b> <a href="#" id="t_so2"><i>SO<span class="sub f-s-8">2</span></i></a> <b class="WMMapAQI-gap"></b> <a href="#" id="t_no2"><i>NO<span
                        class="sub f-s-8">2</span></i></a> <b class="WMMapAQI-gap"></b> <a href="#" id="t_co"><i>CO</i></a> <b class="WMMapAQI-gap"></b> <a href="#" id="t_o3"><i>O<span class="sub f-s-8">3</span></i></a>
                </div>
                <!-- 切换污染物End -->
                <div class="Legend" style="right: 10px;">
                    <img src="${ctx}/resources/img/legend-pm25.png" width="212" height="46">
                </div>

            </div>
            <div class="ui-layout-east"></div>
        </div>
    </div>
</body>


<!-- 城市排名开始 -->
<div class="modal fade col-md-8" data-backdrop="static" data-keyboard="false" id="addModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="float: none; margin: auto auto">
    <div class="modal-dialog" style="height: 500px; width: 100%;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">
                    <span aria-hidden="true">&times;</span><span class="sr-only">Close</span>
                </button>
                <h4 class="modal-title" id="myModalLabel">
                    <p>
                        <span>xx月国控站点空气质量排名 </span>&nbsp;&nbsp;&nbsp;
                    </p>
                    <label>月份查询：</label><input id="d1212" class="Wdate" type="text" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM',onpicked:function(dp){initCityRange(this.value);}})"/>
                </h4>
            </div>

            <div class="modal-body " data-scrollbar="true" style='height: 500px; background: #ffffff'>
                <table id="example" class="display ">
                    <thead>
                    <tr>
                        <th>城市排名</th>
                        <th>省份</th>
                        <th>城市</th>
                        <th>AQI</th>
                        <th>空气质量</th>
                        <th>PM2.5</th>
                        <th>PM10</th>
                    </tr>
                    </thead>
                    <tbody id="tableBody">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<!-- 城市排名结束 -->


<!-- 国控点各种图表（Modal） -->
<div class="modal fade" id="echarsModal" tabindex="999" role="dialog" aria-labelledby="echarsModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title" id="echarsModalLabel">国控点相关站点</h4>
            </div>
            <div class="modal-body" style="padding: 0px; margin: 0px;">
                <div id="polluBarNum" style="width: 600px; height: 180px;"></div>
                <div id="polluLineNum" style="width: 600px; height: 180px;"></div>
                <div id="polluRoseNum" style="width: 600px; height: 210px;"></div>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>


<div class="map-float-popup  " style="display: none; margin-top: 100px;" id="pollutionInfo" class='col-md-11'>
    <div style="background-color: #d9e0e7; padding: 5px; height: 32px;">
        <h4 class="m-t-0 f-s-20 f-w-600">
            <span style="line-height: 20px; float: left;">污染源排放量信息</span><a href="#" onclick="hideDomById('pollutionInfo')" style="line-height: 20px; float: right;">x</a>
        </h4>
    </div>
    <div class="polustion_info">
        <p style='padding: 5px'>
            污染源：<span id="p_name"></span>
        </p>
        <p style='padding: 5px'>
            类别：<span id="p_type"></span>&nbsp;种类：<span id="p_catagory"></span>
        </p>
        <p style='padding: 5px'>
            地址：<span id="p_address"></span>
        </p>
    </div>
    <div style='padding: 5px'>
        排放量：
        <table id="p_dischargeds" border="1"></table>
    </div>
    <div style='padding: 5px'>
        关联监测点：
        <table id="p_wstations" border="1"></table>
    </div>
</div>
<!-- /.modal -->

