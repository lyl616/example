
<%@include file="../includeJsCss.html" %>

<%--<sec:authentication property="principal" var="auth" scope="session" />--%>
<%--<sec:authentication property="principal.domainList" var="domainList" scope="session" />--%>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if !IE]><!-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html lang="en">
<!--<![endif]-->

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 实时监测</title>
    <link href="../../resources/css/component.css" rel="stylesheet"/>
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>
    <!--引用插件使用-->
    <link rel="stylesheet" href="../../resources/plugins/bmap/DrawingManager_min.css"/>
    <link href="../../resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/DistanceTool_min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/DrawingManager_min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/TrafficControl_min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/Heatmap_min.js"></script>
    <script type="text/javascript" src="../../resources/js/common/com-map.js"></script>
    <script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
    <!--实时检测页面使用-->
    <script type="text/javascript" src="../../resources/js/common/realtime-info.js"></script>
    <script type="text/javascript" src="../../resources/js/management/pollution/pollution-detail.js"></script>
    <script type="text/javascript" src="../../resources/js/management/pollution/conf-pollutions.js?v=2"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtimePC/realtimePC-pollutions.js?v=2"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtimePC/realtime-mapPC.js?v=7"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtimePC/realtimePC-top.js?v=7"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtimePC/warnmsgPC.js"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtimePC/uisearch.js"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtimePC/jquery.circliful.min.js"></script>

    <!--dataTable 表格插件引用-->
    <link href="../../resources/plugins/DataTables/media/css/dataTables.bootstrap.min.css" rel="stylesheet"/>
    <script type="text/javascript" src="../../resources/plugins/DataTables/media/js/jquery.dataTables.js"></script>
    <script type="text/javascript" src="../../resources/plugins/DataTables/media/js/dataTables.bootstrap.min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/DataTables/extensions/Select/js/dataTables.select.min.js"></script>
    <!--加载弹窗样式-->
    <script type="text/javascript">
        var bigScreen_flg = false;
    </script>
</head>

<body class="ovh">
<%@include file="../V1/topMenu.html" %>
<div id="content">

    <input type="hidden" name="province" id="province"/>
    <input type="hidden" name="city" id="city"/>
    <input type="hidden" name="mapCenter" id="mapCenter"/>
    <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_08')">--%>
    <input type="hidden" id="realtimeMapType" value="1"/>
    <%--</sec:authorize>--%>
    <!-- begin #page-container -->
    <div style="position: absolute; top:0; left: 0; width: 100%; height: 100%;">
        <div id="WMMAP"></div>
    </div>
    <div id="page-container">
        <div class="Map-All">
            <!-- begin #content -->
            <div class="post-top-nav">
                <div class="btn-group m-l-15" id="polutionTab">
                    <input type="hidden" id="reqStation_type" value="wz"/>
                    <b id="aqi2" class="btn btn-white" type="button">AQI</b>
                    <b id="aqi" class="btn btn-white" type="button">标准AQI</b>
                    <b id="pm25" class="btn btn-white btn-info" type="button">PM<sub>2.5</sub></b>
                    <b id="pm10" class="btn btn-white" type="button">PM<sub>10</sub></b>
                    <b id="co" class="btn btn-white" type="button">CO</b>
                    <b id="so2" class="btn btn-white" type="button">SO<sub>2</sub></b>
                    <b id="o3" class="btn btn-white" type="button">O<sub>3</sub></b>
                    <b id="no2" class="btn btn-white" type="button">NO<sub>2</sub></b>
                    <%--<sec:authorize access="hasRole('ROLE_FUN_009_001')">--%>
                    <b id="vocs" class="btn btn-white" type="button">TVOC</b>
                    <input id='shwotvoc' value="1" type="hidden"/>
                    <%--</sec:authorize>--%>
                </div>
                <div class="btn-group pull-right">
                    <div class="pull-right">
                        <div class="btn-group pull-right m-r-20">
                            <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">
                                <span> 站点信息 </span> <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu re-dropmenu muiltcheck-box box-mutil-01" role="menu" id="uu1" style="height: 449px;">
                                <li>
                                    <div class="map-float-table tab-map">
                                        <div id="myTabContent1" class="tab-content">
                                            <div class="tab01-info ovh" id="title_top" id="xiala">

                                                <div class="pull-right">
                                                    <button class="btn btn-info" onclick="getTypeData('HOUR',this)" type="button">小时
                                                    </button>
                                                    <button class="btn btn-white" onclick="getTypeData('MINUTE',this)" type="button">分钟
                                                    </button>
                                                </div>

                                                <div class="btn-group clear">
                                                    <div class="pull-left m-t-5 m-r-10">
                                                        <span id="divCityName" class="cityname" style="color: black"></span>
                                                        <span class="f-s-12" id="cityMonitorTimeText"></span>
                                                    </div>
                                                </div>
                                                <div class="clear m-t-10">
                                                    <label style="color: black">行政区</label>
                                                    <select name="sel" class="form-control" id="district1"></select>
                                                </div>
                                                <div class="clear m-t-10">
                                                    <label style="color: black">站点类别</label>
                                                    <select name="sel" class="form-control" id="district2"></select>
                                                </div>
                                            </div>
                                            <div class="table-content">
                                                <div class="container-01-num">
                                                    <div class="num">
                                                        <div class="f-s-12">
                                                            首要污染物 <span class="f-s-20 g3" id="divCityFirstPolution"> PM2.5 </span>
                                                        </div>
                                                        <div class="f-s-12">
                                                            空气质量指数 <span class="f-s-20 gf00" id="divCityAqi">999</span>
                                                        </div>
                                                    </div>
                                                    <div class="f-s-20 m-l-30 pic-svg-num" id="divCityPolutionLevelText"></div>
                                                </div>
                                                <div class="tab01-info">
                                                    <div id="rankingFilter" class="real-t-selectR">
                                                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_01')">--%>
                                                        <%--<div id="ALL" class="active">全部</div>--%>
                                                        <%--</sec:authorize>--%>
                                                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_02')">--%>
                                                        <%--<div id="BG">考核</div>--%>
                                                        <%--</sec:authorize>--%>
                                                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_03')">--%>
                                                        <%--<div id="WZ">微站</div>--%>
                                                        <%--</sec:authorize>--%>
                                                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_04')">--%>
                                                        <%--<!-- 隐藏国控 -->--%>
                                                        <%--<div id="G">国控</div>--%>
                                                        <%--</sec:authorize>--%>
                                                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_05')">--%>
                                                        <%--<div id="LOST">断线</div>--%>
                                                        <%--</sec:authorize>--%>
                                                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_06')">--%>
                                                        <%--<div id="OTHER">扬尘</div>--%>
                                                        <%--</sec:authorize>--%>
                                                        <div id="ALL" class="active">全部</div>
                                                        <div id="BG">考核</div>
                                                        <div id="WZ">微站</div>
                                                        <!-- 隐藏国控 -->
                                                        <div id="G">国控</div>
                                                        <div id="LOST">断线</div>
                                                        <div id="OTHER">扬尘</div>
                                                    </div>
                                                </div>
                                                <div class="change clear">
                                                    <div class="real-t-selectTable">
                                                        <div class="tab-pane fade active in" id="All-tab-1">
                                                            <table class="table">
                                                                <thead class="thead">
                                                                <td width="20%" class="text-center" data-field="num">序号</td>
                                                                <td width="30%" data-field="stationName" onclick="changeRankSort()">监控点
                                                                </td>
                                                                <td width="45%" class="text-center wsn" data-field="value" onclick="changeRankSort()">污染物(<span id="polutionLabel" class="text-nowrap">PM<sub>2.5</sub></span>)
                                                                </td>
                                                                </thead>
                                                                <tbody id="rankTab">
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane active tab-content tab02-info" id="ios" style="display: none;" data-scrollbar="true"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="btn-group pull-right">
                            <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">
                                <span>&nbsp;&nbsp;污染源 &nbsp;&nbsp;</span> <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu re-dropmenu muiltcheck-box" style="left: -81px;" role="menu">
                                <li>
                                    <div id="uls"></div>
                                </li>
                            </ul>
                        </div>
                        <div class="btn-group pull-right">
                            <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id='toolbars'>
                                <span id="dds"> 地图工具 </span> <span class="caret" id='toolbar_icon'></span>
                            </button>
                            <ul class="dropdown-menu re-dropmenu map-tool" role="menu" id="uu">
                                <li class="hover-tool01">
                                    <a id="click_distance"><i class="icon icon-tool-01"></i>测距</a>
                                </li>
                                <li class="hover-tool02">
                                    <a href="javascript:showrectangle()"><i class="icon icon-tool-02"></i>圈选</a>
                                </li>
                                <li class="hover-tool06">
                                    <a id="click_hander"><i class="icon icon-tool-06"></i>手势</a>
                                </li>
                                <!--新加-->
                                <li class="hover-tool04">
                                    <a href="javascript:showTraffic()"><i class="icon icon-tool-04"></i>路况</a>
                                </li>
                                <!--<li class="hover-tool05"><a href="javascript:void(0);" id="btn-hotmap"><i class="icon icon-tool-05"></i>热力图</a></li>-->
                                <li class="hover-tool03">
                                    <a href="javascript:void(0);" id="btn-distribution"><i class="icon icon-tool-03"></i>分布图</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="pull-right s-i-w">
                        <!----可伸缩框开始-->

                        <div class="column">
                            <div id="sb-search" class="sb-search">
                                <input class="sb-search-input" placeholder="请输入站号" type="text" value="" id="search_content">
                                <input class="sb-search-submit" type="button" id="searchBtn" value=""> <span class="sb-icon-search"></span>
                            </div>
                        </div>
                        <!----可伸缩框结束-->

                    </div>
                </div>
            </div>
            <!--卫星和地图切换开始    -->
            <div href="javascript:void(0)" onclick="clkMapType()" id="weixing" data="1" class="fixpic wxpic"></div>
            <!--卫星和地图切换结束    -->
            <div class="Legend">
                <img src="../../resources/img/legend/legend-pm25.png" height="46">
            </div>
            <div class="bottom-copyright">
                <img src="../../resources/img/copyright.png" height="20">
            </div>
            <!-- 地图框选展示 -->
            <!------------------------- top10排行榜 ---------------->
            <div class="top10-sort">
                <div class="top-copyleft" style="display: none;">
                    <ul id="AQITab" class="nav nav-tabs">
                        <input type="hidden" id="is_now_24" value="aqi_now">
                        <li class="active li-5">
                            <a href="#aqiNowTab" data-toggle="tab" onclick="clkNowTab('1')"> 1小时 </a>
                        </li>
                        <li class="li-5">
                            <a href="#aqi24Tab" data-toggle="tab" onclick="clk24Tab()">24小时</a>
                        </li>
                    </ul>
                    <div class="m-t-10 ovh">
                        <span id="tab_now_show_time" class="pull-left text-left m-l-10 lh200"></span>
                        <div class="pull-right m-r-10">
                            <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_03')">--%>
                            <button type="button" class="btn btn-info btn-xs" onclick="clkWZ()" id="btn-clkWZ">微站 </button>
                            <%--</sec:authorize>--%>
                            <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_02')">--%>
                            <button type="button" class="btn btn-xs" onclick="clkKH()" id="btn-clkKH">考核站</button>
                            <%--</sec:authorize>--%>
                            <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_06')">--%>
                            <button type="button" class="btn btn-xs" onclick="clkYC()" id="btn-clkYC">扬尘站 </button>
                            <%--</sec:authorize>--%>
                        </div>
                    </div>
                    <div id="myTabContent" class="tab-content">
                        <div class="tab-pane fade in active" id="aqiNowTab">
                            <table class="table pd10">
                                <thead class="rank_24_tabd">
                                <tr>
                                    <th colspan="4" class="colspans" id="bad_title_now"></th>
                                </tr>
                                <tr id="tr_now_title"></tr>
                                </thead>
                                <tbody id="rank_now_end10" >
                                </tbody>
                                <tbody>
                                <tr>
                                    <th colspan="4" class="colspans" id="best_title_now"></th>
                                </tr>
                                </tbody>
                                <tbody id="rank_now_top10">
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-pane fade" id="aqi24Tab">
                            <table class="table pd10">
                                <thead class="thead">
                                <tr>
                                    <th colspan="4" class="colspans" id="bad_title_24"></th>
                                </tr>
                                <!--<tr>
                        <td colspan="4" class="colspans"><span id="tab_24_show_time" style="text-align: right;float: right;"></span>
                        </td>
                    </tr>-->
                                <tr id="tr_24_title"></tr>
                                </thead>
                                <tbody id="rank_24_end10">
                                </tbody>
                                <tbody>
                                <tr>
                                    <th colspan="4" id="best_title_24"></th>
                                </tr>
                                </tbody>
                                <tbody id="rank_24_top10">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="updown-toggle">点击展开TOP10</div>
            </div>
            <script>
                var showtvocfg = document.getElementById('shwotvoc');
                if (showtvocfg) {
                    document.getElementsByClassName('top10-sort')[0].className = 'top10-sort top-sort-hastvoc';
                }
            </script>
            <!------------------------- top10end ----------------------------->
            <div class="modal fade" id="rectangleWin" style="display: none;" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content w500px big-modal-content">
                        <div class="modal-header" id="slt_tabs">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                <a href="javascript:$('#rectangleWin').hide();" class="f-w-600 right">x</a>
                            </button>
                            <h4 class="modal-title">
                                圈选内容 <span id="divStationName1" class="m-l-15"></span>
                            </h4>
                        </div>
                        <div class="tab-content tabs-container modal-body">
                            <ul class="nav nav-tabs m-b-10">
                                <li class="active">
                                    <a href="#pollution" role="tab" data-toggle="tab">潜在污染源</a>
                                </li>
                                <li>
                                    <a href="#concentration" role="tab" data-toggle="tab">浓度</a>
                                </li>
                            </ul>
                            <div role="tabpanel" class="tab-pane active ovh" id="pollution">
                                <table id="rectangle_tab" class="table table-striped table-bordered XhideYauto" cellpadding="0" border="1" style="display: block; height: 320px;">
                                </table>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="concentration">
                                <div id="concentration_charts" style="height: 405px; width: 570px;  overflow: hidden;"></div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="temperate_humidity">
                                <div id="temp_humidity_charts" style="width: 443px; height: 300px; overflow: hidden;"></div>
                            </div>
                            <div role="tabpanel" class="tab-pane" id="wind">
                                <div id="wind_charts" style="width: 443px; height: 300px; overflow: hidden;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- showUserBox
================================================== -->
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
            <div class="blank0"></div>
        </div>
    </div>
    <div id="showTool" style="display: none">
        <div class="ShowUserBoxArrow"></div>
        <div class="ShowUserBox">
            <ul>
                <li>
                    <a href="javascript:wwDis.open();"><span>测距</span></a>
                </li>
                <li>
                    <a href="javascript:showrectangle()"><span>矩形</span></a>
                </li>
                <li>
                    <a href="javascript:drawingManager.close();"><span>手势</span></a>
                </li>
            </ul>
            <div class="blank0"></div>
        </div>
    </div>
    <!-- end page container -->

    <!-- 微站信息开始  -->
    <div class="modal fade" id="popupWin" tabindex="999" role="dialog" aria-labelledby="echarsModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content modal-dialog" style="width: 750px;">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="echarsModalLabel">
                        <i class="fa fa-map-marker text-danger m-r-5"></i> <span id="divStationName2"></span> <span
                            class="f-s-12" id="monitorTimeText"></span>
                    </h4>
                </div>
                <div class="realtime-modalbox">
                    <div class="m-t-10 ovh" style="height: 72px;">
                        <div class="pull-left" style="width: 120px;">
                            <div id="divPolutionLevelText" class="idf-num"></div>
                        </div>
                        <div class="pull-left" style="width: 495px;">
                            <ul class="pull-left">
                                <li class="txt">空气质量指数(小时)</li>
                                <li id="divAqi" class="num">-</li>
                            </ul>
                            <ul class="pull-left">
                                <li class="txt">空气质量级别</li>
                                <li class="num" id="divAqiLevel">-</li>
                            </ul>
                            <ul class="pull-left">
                                <li class="txt">首要污染物</li>
                                <li class="num" id="divFirstPolution">PM<sub>2.5</sub>
                                </li>
                            </ul>
                            <ul class="pull-left" v-if="'ROLE_FUN_003_01' in allFunctions">
                                <li class="txt">详细分析</li>
                                <li class="num">
                                    <a id="redirectLink" class="text-underline" target="_blank">点击跳转</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!---气象数据和污染 tab切换start---->
                    <div class="tabs-container pd10" style="margin-top: -20px;">
                        <%--<sec:authorize access="hasRole('ROLE_FUN_001_01_07')">--%>
                        <input type="hidden" id="weatherTab" value="1"/>
                        <%--</sec:authorize>--%>
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a data-toggle="tab" href="#pollution-tab" aria-expanded="false">污染物</a>
                            </li>
                            <li class="" id="qiXaingTab">
                                <a data-toggle="tab" href="#weather-tab" aria-expanded="true">气象</a>
                            </li>
                            <li class="pull-right">
                                <b id="PolutionTimeAdd" class="fwn pull-right fwn m-t-10"></b>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div id="pollution-tab" class="tab-pane active">
                                <div class="pd10">
                                    <!----污染物开始----->
                                    <div class="f-s-12">
                                        污染物浓度&nbsp;(ug/m<sup>3</sup>&nbsp;&nbsp;| &nbsp;&nbsp;<span class="f-s-10" id="minuteHoutText">小时数据</span>)&nbsp;
                                    </div>
                                    <div class="m-t-10">
                                        <div class="dib">
                                            <strong>PM<sub>2.5</sub>：</strong>
                                            <div id="tdPm25" class="dib m-l-5"></div>
                                        </div>
                                        <div class="dib m-l-20">
                                            <strong>PM<sub>10</sub>：</strong>
                                            <div id="tdPm10" class="dib m-l-5"></div>
                                        </div>
                                        <div class="dib m-l-20">
                                            <strong>CO<span class="f-s-12">(mg/m<sup>3</sup>)</span>：</strong>
                                            <div id="tdCo" class="dib m-l-5"></div>
                                        </div>
                                        <div class="dib m-l-20">
                                            <strong>SO<sub>2</sub>：</strong>
                                            <div id="tdSo2" class="dib m-l-5"></div>
                                        </div>
                                        <div class="dib m-l-20">
                                            <strong>O<sub>3</sub>：</strong>
                                            <div id="tdO3" class="dib m-l-5"></div>
                                        </div>
                                        <div class="dib m-l-20">
                                            <strong>NO<sub>2</sub>：</strong>
                                            <div id="tdNo2" class="dib m-l-5"></div>
                                        </div>
                                        <%--<sec:authorize access="hasRole('ROLE_FUN_009_001')">--%>
                                        <div class="dib m-l-20">
                                            <strong>TVOC：</strong>
                                            <div id="tdTvoc" class="dib m-l-5"></div>
                                        </div>
                                        <%--</sec:authorize>--%>
                                    </div>
                                    <!----污染物结束-->
                                </div>
                            </div>
                            <div id="weather-tab" class="tab-pane ">
                                <div class="pd10" id="qiXaingDiv">
                                    <!---气象数据开始---->
                                    <div class="f-s-12">
                                        气象数据
                                    </div>
                                    <div class="m-t-10">
                                        <div class="dib">
                                            <strong>温度：</strong>
                                            <div id="tdTemp" class="dib m-l-5">-</div>
                                        </div>
                                        <div class="dib m-l-30">
                                            <strong>湿度：</strong>
                                            <div id="tdHum" class="dib m-l-5">-</div>
                                        </div>
                                        <div class="dib m-l-30">
                                            <strong>风力：</strong>
                                            <div id="tdWindPower" class="dib m-l-5">-</div>
                                        </div>
                                        <div class="dib m-l-30">
                                            <strong>风向：</strong>
                                            <div id="tdWindDirect" class="dib m-l-5">-</div>
                                        </div>
                                        <div class="dib m-l-30">
                                            <strong>气压：</strong>
                                            <div id="tdPress" class="dib m-l-5">-</div>
                                        </div>
                                    </div>
                                    <!---气象数据结束-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <!---气象数据和污染tab 切换 end--->
                    <div class="pd10 modalbox-black-03 clear" style="margin-top:-10px">
                        <div class="tit ptrb10 ovh">
                            <div class="pull-left">
                            </div>
                            <div class="blank0"></div>
                        </div>
                        <!--多曲线、柱状图开始-->
                        <div class="tabs-container" style="margin-top:-20px">
                            <ul class="nav nav-tabs">
                                <li class="active">
                                    <a data-toggle="tab" href="#tab-1" aria-expanded="true">浓度</a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#tab-2" aria-expanded="false">颗粒物</a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#tab-3" aria-expanded="false">气态</a>
                                </li>
                                <li class="pull-right">
                                    <b class="fwn pull-right fwn m-t-10">近72小时浓度曲线&nbsp;<span
                                            class="f-s-10 m-r-10">(小时数据)</span></b>
                                </li>
                            </ul>
                            <div class="tab-content">
                                <div id="tab-1" class="tab-pane active post-rel">
                                    <select id="polutionSelect" style="right: 110px; top:4px; width: 70px;" class="selectpicker dib pull-left post-abs zindex9" data-size="8" data-live-search="true" data-style="btn-warning">
                                    </select>
                                    <div id="hourlyChart" class="m-t-5" style="height: 365px; width: 724px; overflow: hidden;"></div>
                                </div>
                                <div id="tab-2" class="tab-pane">
                                    <div id="particulateChart" class="m-t-5" style="height: 365px; width: 744px; overflow: hidden;"></div>
                                </div>
                                <div id="tab-3" class="tab-pane">
                                    <div id="gaseousChart" class="m-t-5" style="height: 365px; width: 744px; overflow: hidden;"></div>
                                </div>
                            </div>
                            <!--多曲线、柱状图结束-->
                        </div>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    </div>
    <div class="modal fade" id="pollutionInfoModal" tabindex="9999" role="dialog" aria-labelledby="pollutionInfoModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="pollutionInfoModalLabel">污染源排放量信息点</h4>
                </div>
                <div class="ovh">
                    <div id="pollutionInfo">
                        <div class="pd10">
                            <p class="lh200">
                                污染源：<span id="p_name"></span>
                            </p>
                            <p class="lh200">
                                类别：<span id="p_type"></span>&nbsp;种类：<span id="p_catagory"></span>
                            </p>
                            <p class="lh200">
                                地址：<span id="p_address"></span>
                            </p>
                        </div>
                        <div class="col-md-12">
                            排放量：
                            <table id="p_dischargeds" border="1" style="font-size: 12px; width: 100%;">
                            </table>
                        </div>
                        <div class="col-md-12">
                            关联监测点：
                            <table id="p_wstations" border="1" style="font-size: 12px; width: 100%;"></table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
</div>
<script src="../../resources/js/common/common.js"></script>
<script type="text/javascript" src="../../resources/plugins/vue/vue-2.5.9.min.js"></script>
<script src="../../resources/js/common/common-vue.js"></script>
<script type="text/javascript">
    $(function () {
        $("#showTool ul li a").click(function () {
            $("#showTool").hide();
        });
        $("#toolBar").click(function () {
            $('#showTool').toggle();
        });
        if (sessionStorage.getItem("currentCityId") != null) {
            $("#city").val(sessionStorage.getItem("currentCityId"));
        }
        if (sessionStorage.getItem("currentCityName") != null) {
            $("#city_name_span").html(sessionStorage.getItem("currentCityName"));
            $("#mapCenter").html(sessionStorage.getItem("currentCityName"));
        }
    });

    function showrectangle() {
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
        drawingManager.open();
    }

    function show(oEvent) {
        var UserBox = document.getElementById("ShowUserBoxMain");
        if (UserBox.style.display == "block") {
            document.getElementById("ShowUserBoxMain").style.display = "none";
        } else {
            document.getElementById("ShowUserBoxMain").style.display = "block";
        }
        e = window.event || oEvent;
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }

    function hide() {
        document.getElementById("ShowUserBoxMain").style.display = "none";
    }

    var i = 0;
    var j = 0;
    document.onkeydown = function (e) {
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which;
        if (code == 13) {
            $("#searchBtn").click();
        }
    }

    function popupwinClose() {
        document.getElementById('popupWin').style.display = "none";
    }

    var flag = true;
    $("#myTabContent").css("display", "block")
    $("#ios").css("display", "none")
    $("#ta1").click(function () {
        $("#ta2").removeClass("active");
        $(this).addClass("active");
        $("#myTabContent").css("display", "block");
        $("#ios").css("display", "none");
        $("#myTabContent .slimScrollDiv").css("display", "block")
        $("#myTabContent .slimScrollDiv").css("height", "auto")
    })
    $("#ta2").click(function () {
        $("#ta1").removeClass("active");
        $(this).addClass("active");
        $("#myTabContent").css("display", "none")
        $("#ios .slimScrollDiv").css("background", "#FF0000")
        $("#ios").css("display", "block")
    });

    $(".muiltcheck-box").click(function (event) {
        event.stopImmediatePropagation();
        $(this).parent().css("display", "inline-block");
        $(this).parent().addClass("open");
    });
    calcOverflowH(0, "WMMAP", 0);
    $(document).ready(function () {
        $(window).resize(function () {
            calcOverflowH(0, "WMMAP", 0);
        });
        //添加地图的缩略控件
        var opts = {
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            offset: new BMap.Size(0, 90),
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
        }
        map.addControl(new BMap.NavigationControl(opts));
    });
</script>
<script>
    new UISearch(document.getElementById('sb-search'));
</script>
</body>

</html>