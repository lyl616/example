
<%@include file="../includeJsCss.html" %>

<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if !IE]><!-->
<%--<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">--%>
<html lang="en">
<!--<![endif]-->

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 实时监测</title>

    <link href="../../resources/css/component.css" rel="stylesheet"/>
    <!--引用插件使用-->
    <link rel="stylesheet" href="../../resources/css/bigScreen.css"/>


    <link rel="stylesheet" href="../../resources/plugins/bmap/DrawingManager_min.css"/>
    <link href="../../resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <%--<script type="text/javascript" src="../../resources/plugins/bmap/DistanceTool_min.js"></script>--%>
    <script type="text/javascript" src="../../resources/js/tools/DistanceTool_realtime.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/DrawingManager_min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/TrafficControl_min.js"></script>
    <%--<script type="text/javascript" src="../../resources/js/Heatmap_min.js"></script>--%>
    <script type="text/javascript" src="../../resources/js/common/commonUtils.js"></script>
    <script type="text/javascript" src="../../resources/js/common/com-map.js"></script>
    <script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
    <!--实时检测页面使用-->
    <script type="text/javascript" src="../../resources/js/common/realtime-info.js"></script>
    <script type="text/javascript" src="../../resources/js/management/pollution/pollution-detail.js"></script>
    <script type="text/javascript" src="../../resources/js/management/pollution/conf-pollutions.js?v=2"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtime/realtime-pollutions.js?v=2"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtime/realtime-map.js?v=7"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtime/realtime-top.js?v=7"></script>
    <%--<script type="text/javascript" src="../../resources/js/airMonitoring/realtime/warjquery.circliful.min.js"></script>--%>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtime/jquery.circliful.min.js"></script>
    <script type="text/javascript" src="../../resources/js/airMonitoring/realtime/uisearch.js"></script>
    <!--dataTable 表格插件引用-->
    <link href="../../resources/plugins/DataTables/media/css/dataTables.bootstrap.min.css" rel="stylesheet"/>
    <script type="text/javascript" src="../../resources/plugins/DataTables/media/js/jquery.dataTables.js"></script>
    <script type="text/javascript" src="../../resources/plugins/DataTables/media/js/dataTables.bootstrap.min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/DataTables/extensions/Responsive/js/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/DataTables/extensions/Select/js/dataTables.select.min.js"></script>
    <script type="text/javascript">
        var bigScreen_flg = true;
    </script>
    <style>
        .BMap_stdMpCtrl {
            transform: scale(5);
        }
    </style>
    <link rel="stylesheet" href="../../resources/plugins/layer/skin/default/biglayer.css"/>
</head>

<body class="ovh">
<input type="hidden" name="province" id="province">
<input type="hidden" name="city" id="city">
<input type="hidden" name="lat" id="lat" value="110100">
<input type="hidden" name="lng" id="lng" value="110100">
<input type="hidden" name="mapCenter" id="mapCenter">
<!-- begin #page-container -->

<div id="page-container" class="page-sidebar-fixed">
    <div class="Map-All site-big">
        <div id="WMMAP"></div>
        <!-- begin #content -->
        <div class="post-top-nav">
            <div class="btn-group m-l-15" id="polutionTab">
                <input type="hidden" name="polution_type" id="polution_type" value="aqi"/>
                <b id="aqi2" class="btn btn-white" type="button">AQI</b>
                <b id="aqi" class="btn btn-white" type="button">标准AQI</b>
                <b id="pm25" class="btn btn-white btn-info" type="button">PM<sub>2.5</sub></b>
                <b id="pm10" class="btn btn-white" type="button">PM<sub>10</sub></b>
                <b id="co" class="btn btn-white" type="button">CO</b>
                <b id="so2" class="btn btn-white" type="button">SO<sub>2</sub></b>
                <b id="o3" class="btn btn-white" type="button">O<sub>3</sub></b>
                <b id="no2" class="btn btn-white" type="button">NO<sub>2</sub></b>
                <b id="vocs" class="btn btn-white dn" type="button">TVOC</b>
            </div>
            <div class="btn-group pull-right">
                <div class="pull-right">
                    <div class="btn-group s-5 pull-right m-r-20">
                        <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">
                            <span> 站点信息 </span> <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu re-dropmenu muiltcheck-box box-mutil-01 ovh bgf" role="menu" style="height: 1723px; width: 1134px; right:0; padding:10px;">
                            <li>
                                <div class="map-float-table tab-map">
                                    <!--<ul id="myTab" class="nav nav-tabs">
            <li><a href="javascript:void(0)" id="ta1" class="active"> 实时信息 </a></li>
            <li><a href="javascript:void(0)" id="ta2"> 告警信息 </a></li>
        </ul>-->

                                    <div id="myTabContent" class="tab-content">
                                        <div class="tab01-info m-t-20" id="title_top" id="xiala">
                                            <h4 class="ovh m-b-20">
                                                <span id="divCityName" class="cityname">济宁</span>
                                                <span class="f-s-12" id="cityMonitorTimeText"></span>

                                                <div class="btn-group pull-right">
                                                    <button class="btn btn-info btn-xxl"
                                                            onclick="getTypeData('HOUR',this)" type="button">小时
                                                    </button>
                                                    <button class="btn btn-white btn-xxl"
                                                            onclick="getTypeData('MINUTE',this)" type="button">分钟
                                                    </button>
                                                </div>

                                            </h4>
                                            <label>行政区</label>
                                            <select name="sel" class="form-control" id="district1">
                                            </select> <label>站点类别</label>
                                            <select name="sel" class="form-control" id="district2">
                                            </select>
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
                                            <div class="tab01-info ovh">
                                                <div id="rankingFilter" class="real-t-selectR">
                                                    <div id="ALL" class="active">全部</div>
                                                    <div id="BG">考核</div>
                                                    <div id="WZ">微站</div>
                                                    <!-- 隐藏国控
                                        <div id="G">国控</div>-->
                                                    <div id="LOST">断线</div>
                                                    <div id="OTHER">扬尘</div>
                                                </div>

                                            </div>
                                            <div class="change clear bgf">
                                                <div class="tab-content real-t-selectTable">
                                                    <div class="tab-pane fade active in" id="All-tab-1">
                                                        <table class="table-stationInfo">
                                                            <thead class="thead">
                                                            <td width="20%" class="text-center" data-field="num">序号</td>
                                                            <td width="25%" data-field="stationName" onclick="changeRankSort()">监控点
                                                            </td>
                                                            <td width="55%" class="text-center" data-field="value" onclick="changeRankSort()">污染物(<span id="polutionLabel" class="text-nowrap">PM<sub>2.5</sub></span>)
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
                    <div class="btn-group s-5 pull-right">
                        <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown">
                            <span>&nbsp;&nbsp;污染源 &nbsp;&nbsp;</span> <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu re-dropmenu muiltcheck-box box-mutil-02" style="left: -370px;" role="menu">
                            <li>
                                <div id="uls"></div>
                            </li>
                        </ul>
                    </div>
                    <div class="btn-group s-5 pull-right">
                        <button type="button" class="btn btn-white dropdown-toggle" data-toggle="dropdown" id='toolbars'>
                            <span id="dds"> 地图工具 </span> <span class="caret" id='toolbar_icon'></span>
                        </button>
                        <ul class="dropdown-menu re-dropmenu map-tool" role="menu">
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
                    <script>
                        new UISearch(document.getElementById('sb-search'));
                    </script>
                </div>
            </div>
        </div>
        <!--卫星和地图切换开始    -->
        <div href="javascript:void(0)" id="weixing" onclick="clkMapType()" data="0" class="fixpic mappic"></div>
        <!--卫星和地图切换结束    -->

        <div class="Legend">
            <img src="../../resources/img/legend/legend-pm25.png"/>
        </div>
        <div class="bottom-copyright">
            <img src="../../resources/img/copyright.png"/>
        </div>
        <!-- 地图框选展示 -->

        <!-- top10排行榜 -->
        <div class="top10-sort">
            <div class="top-copyleft">
                <ul id="AQITab" class="nav nav-tabs">
                    <input type="hidden" id="is_now_24" value="aqi_now">
                    <li class="active li-5">
                        <a href="#aqiNowTab" data-toggle="tab" onclick="clkNowTab()"> 1小时 </a>
                    </li>
                    <li class="li-5">
                        <a href="#aqi24Tab" data-toggle="tab" onclick="clk24Tab()">24小时</a>
                    </li>
                </ul>
                <div class="m-t-10 ovh">
                    <span id="tab_now_show_time" class="pull-left text-left m-l-10 m-t-10"></span>
                    <div class="pull-right">
                        <button type="button" class="btn btn-info btn-xs" onclick="clkWZ()" id="btn-clkWZ">微站</button>
                        <button type="button" class="btn btn-xs" onclick="clkKH()" id="btn-clkKH">考核站
                        </button>
                        <button type="button" class="btn btn-xs" onclick="clkYC()" id="btn-clkYC">扬尘站
                        </button>
                    </div>
                </div>
                <div id="myTabContent2" class="tab-content m-t-10">
                    <div class="tab-pane fade in active" id="aqiNowTab">
                        <table class="table-tst" style="width: 978px;">
                            <thead class="rank_24_tabd">
                            <tr>
                                <th colspan="4" class="colspans" id="bad_title_now"></th>
                            </tr>
                            <tr id="tr_now_title"></tr>
                            </thead>
                            <tbody id="rank_now_end10">
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
                        <table class="table-tst">
                            <thead class="thead">
                            <tr>
                                <th colspan="4" class="colspans" id="bad_title_24"></th>
                            </tr>
                            <tr>
                                <td colspan="4" class="colspans"><span id="tab_24_show_time" style="text-align: right;float: right;"></span>
                                </td>
                            </tr>
                            <tr id="tr_24_title"></tr>
                            </thead>
                            <tbody id="rank_24_end10">
                            </tbody>
                            <tbody class="w100">
                            <tr>
                                <th colspan="4" class="colspans" id="best_title_24"></th>
                            </tr>
                            </tbody>
                            <tbody id="rank_24_top10" class="w100">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="updown-toggle">点击收起TOP10</div>
        </div>
        <!-- top10end -->
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
                    <div class="tab-content modal-body pd10">
                        <ul class="nav nav-tabs m-b-10">
                            <li class="active">
                                <a href="#pollution" class="tab-a" role="tab" data-toggle="tab">潜在污染源</a>
                            </li>
                            <li>
                                <a href="#concentration" class="tab-a" role="tab" data-toggle="tab">浓度</a>
                            </li>
                        </ul>
                        <div role="tabpanel" class="tab-pane active ovh" id="pollution">
                            <table id="rectangle_tab" class="table table-striped table-bordered XhideYauto" cellpadding="0" border="1" style="display: block; height:756px;">
                            </table>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="concentration">
                            <div id="concentration_charts" class="m-t-20" style="height: 900px; width: 100%; overflow: hidden;"></div>
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
<script>
    //		设置圈选内容框
    $("#concentration_charts").css("width", "1700px");
</script>
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
</script>

<!-- 微站信息开始  -->
<div class="modal fade" id="popupWin" tabindex="999" role="dialog" aria-labelledby="echarsModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content modal-dialog" style="width: 2070px;">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title" id="echarsModalLabel">
                    <i class="fa fa-map-marker text-danger m-r-5"></i> <span id="divStationName2"></span> <span
                        class="f-s-12" id="monitorTimeText"></span>
                </h4>
            </div>
            <div class="realtime-modalbox">
                <div class="modalbox-black-01">
                    <div class="dashboard">
                        <div id="divPolutionLevelText" class="idf-num"></div>
                    </div>
                    <div class="col-md-9">
                        <ul class="col-sm-5">
                            <li class="txt">空气质量指数(小时)</li>
                            <li id="divAqi" class="num">-</li>
                        </ul>
                        <ul class="col-sm-3">
                            <li class="txt">空气质量级别</li>
                            <li class="num" id="divAqiLevel">-</li>
                        </ul>
                        <ul class="col-sm-4">
                            <li class="txt">首要污染物</li>
                            <li class="num" id="divFirstPolution">PM<sub class="f-s-8">2.5</sub>
                            </li>
                        </ul>
                    </div>
                </div>
                <div style="width: 100%;display:none" id="qiXaingDiv">
                    <table class="table-01">
                        <tr>
                            <td class="W10">温度:</td>
                            <td class="W10" style="padding: 1px;"><span class="p-5 left" id="tdTemp">-</span></td>
                            <td class="W10">湿度:</td>
                            <td class="W10"><span class="p-5 left" id="tdHum">-</span></td>
                            <td class="W10">风力:</td>
                            <td class="W10"><span class="p-5 left" id="tdWindPower">-</span></td>
                            <td class="W10">风向:</td>
                            <td class="W10"><span class="p-5 left" id="tdWindDirect">-</span></td>
                            <td class="W10">气压:</td>
                            <td class="W10"><span class="p-5 left" id="tdPress">-</span></td>
                        </tr>
                    </table>
                </div>
                <div class="line"></div>
                <div class="modalbox-black-02 pd10 clear ovh">
                    <div class="tit ptrb10 ovh">
                        污染物浓度&nbsp;(ug/m<sup>3</sup>&nbsp;&nbsp;| &nbsp;&nbsp;<span id="minuteHoutText" class="f-s-10">小时数据</span>)&nbsp;
                        <b id="PolutionTimeAdd"></b>
                    </div>
                    <table style="width: 100%;">
                        <tbody class=" hauto">
                        <tr>
                            <th class="W10">PM<sub>2.5</sub></th>
                            <th class="W15">PM<sub>10</sub></th>
                            <th class="W20">CO(mg/m<sup>3</sup>)</th>
                            <th class="W15">SO<sub>2</sub></th>
                            <th class="W20">O<sub>3</sub></th>
                            <th class="W15">NO<sub>2</sub></th>
                        </tr>
                        <tr>
                            <td class="W20" id="tdPm25"></td>
                            <td class="W15" id="tdPm10"></td>
                            <td class="W15" id="tdCo"></td>
                            <td class="W15" id="tdSo2"></td>
                            <td class="W15" id="tdO3"></td>
                            <td class="W15" id="tdNo2"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="line"></div>
                <div class="pd10 modalbox-black-03 clear">
                    <div class="tit ptrb10">

                    </div>
                    <div class="blank0"></div>
                </div>
                <!--多曲线、柱状图开始-->
                <div class="tabs-container" style="margin-top: -67px;">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a data-toggle="tab" href="#tab-1" aria-expanded="true">浓度</a>
                        </li>
                        <li class="">
                            <a data-toggle="tab" href="#tab-2" aria-expanded="false">颗粒物</a>
                        </li>
                        <li class="">
                            <a data-toggle="tab" href="#tab-3" aria-expanded="false">气态</a>
                        </li>
                        <li class="pull-right" style="margin-top: 30px;">
                            <b class="fwn" style="font-weight: normal; ">近72小时浓度曲线&nbsp;<span
                                    class="m-r-10">(小时数据)</span></b>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div id="tab-1" class="tab-pane active pd10">
                            <select id="polutionSelect" style="right: 300px;" class="selectpicker dib pull-left post-abs zindex9 form-control" data-size="8" data-live-search="true" data-style="btn-warning">
                                <%--<option value="aqi">AQI</option>--%>
                                <%--<option value="pm25">PM2.5</option>--%>
                                <%--<option value="pm10">PM10</option>--%>
                                <%--<option value="co">CO</option>--%>
                                <%--<option value="so2">SO2</option>--%>
                                <%--<option value="o3">O3</option>--%>
                                <%--<option value="no2">NO2</option>--%>
                            </select>
                            <div id="hourlyChart" class="text-center" style="height: 650px; width: 2050px; overflow: hidden;"></div>
                        </div>
                        <div id="tab-2" class="tab-pane pd10">
                            <div id="particulateChart" class="text-center" style="height: 650px; width: 2050px; overflow: hidden;"></div>
                        </div>
                        <div id="tab-3" class="tab-pane pd10">
                            <div id="gaseousChart" class="text-center" style="height: 650px; width:2050px; overflow: hidden;"></div>
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

<div class="modal fade" id="pollutionInfoModal" tabindex="999" role="dialog" aria-labelledby="pollutionInfoModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
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
<script>
    calcOverflowH(0, "WMMAP", 0);
    $(document).ready(function () {
        $(window).resize(function () {
            calcOverflowH(0, "WMMAP", 0);
        });
    });
</script>
</body>

</html>