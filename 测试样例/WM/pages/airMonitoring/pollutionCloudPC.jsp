
<%@include file="../includeJsCss.html" %>
<c:set var="coreApiPath" value="${requestScope.coreApiContextPath}"/>

<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 污染云图</title>
    <!--引用插件使用-->
    <link rel="stylesheet" href="../../resources/plugins/bmap/DrawingManager_min.css"/>
    <link href="../../resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css"/>


    <link href="../../resources/css/component.css" rel="stylesheet"/>

    <!-- <link href="../../resources/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet"/>-->
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>

    <script type="text/javascript" src="../../resources/plugins/jquery-ui/jquery-ui.min.js"></script>

    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/DistanceTool_min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/DrawingManager_min.js"></script>
    <script type="text/javascript" src="../../resources/plugins/bmap/TrafficControl_min.js"></script>

    <script type="text/javascript" src="../../resources/js/common/com-map.js"></script>
    <!--引用插件使用结束-->

    <script type="text/javascript">
        var bigScreen_flg = false;
    </script>
    <style type="text/css"></style>
</head>

<body>
<%@include file="../V1/topMenu.html" %>
<input type="hidden" name="97DateTimeFmt" id="97DateTimeFmt" value="yyyy-MM-dd"/>
<!-- begin #page-container -->
<div id="page-container" class="page-sidebar-fixed">
    <div class="Map-All">
        <div id="WMMAP" style="height: 100%"></div>
        <div class="post-top-nav">
            <div class="btn-group col-sm-6" id="polution_type">
                <a id="aqi2" class="btn btn-white" type="button">AQI</a>
                <a id="aqi" class="btn btn-white" type="button">标准AQI</a>
                <a id="pm25" class="btn btn-white btn-info" type="button">PM<sub>2.5</sub></a>
                <a id="pm10" class="btn btn-white" type="button">PM<sub>10</sub></a>
                <a id="co" class="btn btn-white" type="button">CO</a>
                <a id="so2" class="btn btn-white" type="button">SO<sub>2</sub></a>
                <a id="o3" class="btn btn-white" type="button">O<sub>3</sub></a>
                <a id="no2" class="btn btn-white" type="button">NO<sub>2</sub></a>
            </div>
            <div class="btn-group col-sm-6 pull-right">
                <%--<sec:authorize access="hasRole('ROLE_FUN_001_03_001')">--%>
                <div class="btn-group s-5 pull-right">
                    <button type="button" class="btn btn-info" id="wz">
                        <span>微站</span>
                    </button>
                </div>
                <%--</sec:authorize>--%>
                <%--<sec:authorize access="hasRole('ROLE_FUN_001_03_002')">--%>
                <div class="btn-group s-5 pull-right">
                    <button type="button" class="btn btn-white" id="kaohe">
                        <span>考核站</span>
                    </button>
                </div>
                <%--</sec:authorize>--%>
                <div class="btn-group s-5 pull-right">
                    <button type="button" class="btn btn-white">
                        <span> 风向 ： <i class="g0f85c9 fsn" id="direction"> <img
                                src="${ctx }/resources/img/airdata/N1.png" width="20" height="15"></i></span>
                    </button>
                </div>
                <div class="btn-group s-5 pull-right">
                    <button type="button" class="btn btn-white">
                        <span> 风力 ：<i class="fsn" id="power">微风</i></span>
                    </button>
                </div>
                <div class="btn-group s-5 pull-right">
                    <button type="button" class="btn btn-white" id="station">
                        <span>站点</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="lend-cloud">
            <img src="../../resources/img/cloud/wm-legend-pm25.png" width="57" height="291">
        </div>

        <%--<div class="smallMap" id="smallMap"></div>--%>

        <!--卫星和地图切换开始    -->
        <a href="javascript:void(0)" id="weixing" data="0" class="fixpic wxpic" style="z-index: 200;"></a>
        <!--卫星和地图切换结束    -->
        <div class="bottom-copyright">
            <img src="../../resources/img/copyright.png" width="290" height="20">
        </div>
        <!-- 底部播放栏开始 -->
        <div class="map-float-table  hidden-xs col-md-4 "
             style="top: 60px; padding: 0px 0px; background: none; border: none; height: 1px;"></div>

        <div class="fixedTimebar" style="width: 647px;">
            <div class="form-inline">
                <div class="form-group m-l-10">
                    <label>起止时间：</label>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control Wdate" id="startTime" name="start" placeholder="开始时间">
                </div>
                <div class="form-group">
                    <img src="../../resources/img/send-bg.png"/>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control Wdate" id="endTime" name="end" placeholder="结束时间">
                </div>
                <div class="form-group">
                    <span class="glyphicon glyphicon-backward" id="btn-pre"></span>
                    <span class="glyphicon glyphicon-pause" id="btn-play"
                          onclick="timerPlay()"></span>
                    <span class="glyphicon glyphicon-forward " id="btn-next"></span>
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
                <div class="form-group">
                    <button class="btn btn-info" data-toggle="modal" onclick="viewPics()">查看全部云图</button>
                </div>
                <div class="form-group prog-bar">
                    <span id="nowDate" class="prog-tit"></span>
                    <div id="progressbar" class="progress-bar prog-cbar" style="width: 100%;">
                        <div class="progress-label">0.00%</div>
                    </div>
                </div>
            </div>

        </div>
        <!-- 底部播放栏结束 -->
    </div>
    <!-- end #content -->
</div>
<!-- end page container -->
<!-- 污染云图下载 模态框（Modal） -->
<div class="modal fade" id="dvalueModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 666px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" onclick="closePicsModal()" aria-hidden="true">
                    &times;
                </button>
                <h4 class="modal-title" id="picsTitle"></h4>
            </div>
            <div class="pic_scrollcontianer" id="pic_scroll">

            </div>
            <div class="modal-footer text-center">
                <form id="picDownForm" method='post' action="${backendApiPath}/file/download/cloudImg/zip" target="_blank">
                    <input type="hidden" id="select_ids" value="" name="files">
                    <input type="hidden" id="zipName" value="" name="zipName">
                    <span id="selCnt" class="left"></span>
                    <input type="button" class="btn btn-primary" onclick="selAll_pic()" id="selAll" value="全部选中"/>
                    <button type="button" class="btn btn-primary" onclick="downLoadPics()">下载</button>
                </form>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal -->
</div>

</body>

<script type="text/javascript">
    var i = 0;
</script>
<script type="text/javascript" src="../../resources/js/airMonitoring/pollutionCloudPC.js"></script>
<script type="text/javascript" src="../../resources/js/common/timer.js"></script>

</html>