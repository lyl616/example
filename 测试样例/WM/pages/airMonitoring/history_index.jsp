<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../includeJsCss.jsp" %>


<c:set var="path" value="${pageContext.request.servletPath}"/>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if !IE]><!-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html lang="en">
<!--<![endif]-->

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 历史回顾</title>
    <link href="${ctx}/resources/css/component.css" rel="stylesheet"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>

    <script src="${ctx}/resources/plugins/vue/vue-2.5.9.min.js"></script>

    <!--引用插件使用-->
    <link rel="stylesheet" href="${ctx}/resources/plugins/bmap/DrawingManager_min.css"/>
    <link href="${ctx}/resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css"/>

    <!--<link href="${ctx}/resources/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />-->
    <script type="text/javascript" src="${ctx}/resources/plugins/jquery-ui/jquery-ui.min.js"></script>

    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/DistanceTool_min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/DrawingManager_min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/TrafficControl_min.js"></script>

    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/Heatmap_min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/airMonitoring/GeoUtils.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/airMonitoring/spatialmap.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/timer.js"></script>
</head>

<body class="ovh">
<%@include file="../V1/topMenu.jsp" %>
<div id="content">

    <input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd"/>

    <!-- begin #page-loader -->

    <div id="page-container" class="page-sidebar-fixed">
        <div class="Map-All site-big">
            <div id="WMMAP" style="height: 100%;"></div>
            <div class="post-top-nav">
                <div class="btn-group m-l-15" id="polution_type">
                    <a id="aqi2" class="btn btn-white disn" type="button">AQI</a>
                    <a id="aqi" class="btn btn-white" type="button">AQI</a>
                    <a id="pm25" class="btn btn-white btn-info" type="button">PM<sub>2.5</sub></a>
                    <a id="pm10" class="btn btn-white" type="button">PM<sub>10</sub></a>
                    <a id="co" class="btn btn-white" type="button">CO</a>
                    <a id="so2" class="btn btn-white" type="button">SO<sub>2</sub></a>
                    <a id="o3" class="btn btn-white" type="button">O<sub>3</sub></a>
                    <a id="no2" class="btn btn-white" type="button">NO<sub>2</sub></a>
                </div>
                <div class="pull-right m-r-10">
                    <div class="btn-group">
                        <div class="dib">
                            <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">
                                <span> 地图工具 </span> <span class="caret" id='toolbar_icons'></span>
                            </button>
                            <ul class="dropdown-menu re-dropmenu cancel-Cevent" role="menu" style="min-width: 83px; right: 83px;">
                                <!--新加-->
                                <li class="hover-tool04">
                                    <a href="javascript:void(0)" onclick="showTraffic2(this)"><i class="icon icon-tool-04"></i>路况</a>
                                </li>
                                <li class="hover-tool05">
                                    <a href="javascript:void(0);" id="btn-hotmap"><i class="icon icon-tool-05"></i>热力图</a>
                                </li>
                                <li class="hover-tool03">
                                    <a href="javascript:void(0);" id="btn-distribution" style="background-color: #edf0f5"><i class="icon icon-tool-03"></i>分布图</a>
                                </li>
                            </ul>
                        </div>
                        <div class="dib">
                            <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">
                                <span> 站点排序 </span> <span class="caret" id='toolbar_icon'></span>
                            </button>
                            <ul class="dropdown-menu re-dropmenu cancel-Cevent" role="menu" style="min-width: 346px; right:0;">
                                <li>
                                    <div class="st-sort-tit">
                                        <label>行政区</label>
                                        <div class="select-b">
                                            <input type="hidden" id="proId"/>
                                            <input type="hidden" id="cityId"/>

                                            <select class="form-control" id="district" data-size="8" data-live-search="true" data-style="btn-warning">
                                            </select>
                                        </div>
                                        <label>站点类别</label>
                                        <div class="select-b">
                                            <select class="form-control" id="station_type" data-size="8" data-live-search="true" data-style="btn-warning">
                                            </select>
                                        </div>
                                        <label>日期:近一天</label>
                                        <%--<div class="select-b">--%>
                                        <%--<select class="form-control" id="stationDate" data-size="8" data-live-search="true" data-style="btn-warning">--%>
                                        <%--<option value="DAY">近一天</option>--%>
                                        <%--<option value="WEEK">近一周</option>--%>
                                        <%--<option value="MONTH">近一月</option>--%>
                                        <%--<option value="YEAR">近一年</option>--%>
                                        <%--</select>--%>
                                        <%--</div>--%>
                                    </div>
                                    <div class="st-sort-content">
                                        <div class="tab-content">
                                            <div class="tab-pane fade active in ">
                                                <table class="table table-striped">
                                                    <thead>
                                                    <tr>
                                                        <th class="W30"></th>
                                                        <th class="w10">AQI</th>
                                                        <th class="w10">PM<sub>2.5</sub></th>
                                                        <th class="w10">PM<sub>10</sub></th>
                                                        <th class="w10">SO<sub>2</sub></th>
                                                        <th class="w10">NO<sub>2</sub></th>
                                                        <th class="w15">CO</th>
                                                        <th class="w10">O<sub>3</sub></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody id="t_body">
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="tit m-t-5 f-s-12 m-t-10" id="firstPercent"></div>
                                        <div class="tit m-t-5 f-s-12" id="secondPercent"></div>
                                        <div class="line-long m-t-10"></div>
                                        <div class="tit m-t-10">站点排行</div>
                                        <div class="XhideYauto h200 ">
                                            <table class="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th class="text-center">序号</th>
                                                    <th class="text-center">监控点</th>
                                                    <th class="text-center">污染物</th>
                                                    <th class="text-center" onclick="changeSort('avg1')">当前值</th>
                                                    <th class="text-center" onclick="changeSort('percentage')">环比升降率</th>
                                                </tr>
                                                </thead>
                                                <tbody id="rank_body"></tbody>
                                            </table>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <button type="button" @click="bindclick('staion_type_wz')" v-if="'ROLE_FUN_001_02_001' in allFunctions" class="btn btn-white btn-info toggle-btn" id="staion_type_wz">
                            <span> 微站 </span>
                        </button>
                        <button type="button" @click="bindclick('staion_type_kh')" v-if="'ROLE_FUN_001_02_002' in allFunctions" class="btn btn-white toggle-btn" id="staion_type_kh">
                            <span> 考核 </span>
                        </button>
                        <button type="button" @click="bindclick('staion_type_yc')" v-if="'ROLE_FUN_001_02_005' in allFunctions" class="btn btn-white toggle-btn" id="staion_type_yc">
                            <span> 扬尘站 </span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="Legend" id="Legend">
                <img src="${ctx}/resources/img/legend/legend-pm25.png"/>
            </div>
            <div class="bottom-copyright">
                <img src="${ctx}/resources/img/copyright.png"/>
            </div>
            <!--卫星和地图切换开始    -->
            <div href="javascript:void(0)" id="weixing" data="0" class="fixpic wxpic"></div>
            <!--卫星和地图切换结束    -->
        </div>

        <!-- showUserBox     ================================================== -->
        <div id="ShowUserBoxMain" style="display: none">
            <div class="ShowUserBoxArrow"></div>
            <div class="ShowUserBox">
                <ul id="cityList">
                    <c:forEach var="para" items="${domainList}" varStatus="status">
                        <li>
                            <a href="#"><span><c:out value="${para.cityName}"/></span></a>
                        </li>
                    </c:forEach>
                </ul>
            </div>
        </div>
        <div class="map-float-table  hidden-xs col-md-4 " style="top: 60px; padding: 0px 0px; background: none; border: none; height: 1px;"></div>

        <div class="fixedTimebar" style="width: 540px;">

            <div class="form-inline">
                <div class="form-group m-l-10">
                    <label>起止时间：</label>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control Wdate" id="startTime" name="start" placeholder="开始时间">
                </div>
                <div class="form-group">
                    <img src="${ctx}/resources/img/send-bg.png"/>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control Wdate" id="endTime" name="end" placeholder="结束时间">
                </div>
                <div class="form-group">
                    <span class="glyphicon glyphicon-backward" id="btn-pre"></span> <span class="glyphicon glyphicon-pause" id="btn-play" onclick="timerPlay()"></span>
                    <span class="glyphicon glyphicon-forward" id="btn-next"></span>
                </div>
                <div class="form-group">
                    <span>间隔：</span>
                    <select id="interval" class="form-control w50">
                        <option value='1'>时</option>
                        <option value='2' selected="selected">天</option>
                        <!-- 								<option value='3'>月</option> -->
                        <!-- 								<option value='4'>年</option> -->
                    </select>
                </div>
                <div class="form-group prog-bar">
                    <span id="nowDate" class="prog-tit"></span>
                    <div id="progressbar" class="progress-bar prog-cbar" style="width: 100%;">
                        <div class="progress-label">0.00%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end #content -->
    <!-- end page container -->
</div>

<script type="text/javascript">
    var i = 0;
    $(document).ready(function () {
        $(".cancel-Cevent").click(function (event) {
            event.stopImmediatePropagation();
            $(this).parent().css("display", "inline-block");
            $(this).parent().addClass("open");
        });
        reviewCity();
    });
</script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/history-map.js"></script>
</body>

</html>