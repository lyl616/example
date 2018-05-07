<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="../includeJsCss.jsp" %>


<html lang="en">

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 虚拟网格</title>
    <link rel="stylesheet" href="${ctx}/resources/css/bootstrap.min.css"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/plugins/jquery/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/layer/layer.js"></script>

    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>

    <script type="text/javascript" src="${ctx}/resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/bmap.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>

</head>
<body>
<%@include file="../V1/topMenu.jsp" %>

<div class="post-abs virt-lefttop-btn">
    <button class="btn btn-md btn-white dib" id="aqi">AQI</button>
    <button class="btn btn-md btn-info dib m-l--5" id="pm25">PM<sub>2.5</sub></button>
</div>
<div class="post-abs virt-righttop-btn">
    数据时间：<span id="rtcTime"></span>
</div>

<div class="post-abs virt-rightbottom-btn">
    <div class="virt-legend">
        <img id="virtlegend" src="${ctx}/resources/img/legend/wm-legend-pm25.png"/>
    </div>
    <div onclick="changeMaptype(this)" id="map_0" class="virt-mapC post-abs">
        <img src="${ctx}/resources/img/map.png"/>
    </div>
</div>

<div id="main" class="post-abs virt-grid-continer"></div>


<!--审核弹窗-->
<div class="modal" id="virtualGridModal" tabindex="-1" role="dialog" aria-labelledby="virtualGridModal"
     aria-hidden="true" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog w500px">
        <div class="modal-content animated">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                        class="sr-only">Close</span></button>
                <h6 class="modal-title">网格信息</h6>
            </div>
            <div class="modal-body ovh">
                <div class="m_t10-b10">
                    <span class="left" id="pollutionVal"></span></span>
                    <span class="right disn" id="aqiFirst"></span></span>
                </div>

                <table class="table table-bordered m-tmb-20">
                    <thead class="thead">
                    <td class="tc w70px">区/县</td>
                    <td class="tc">所属街道</td>
                    <td class="tc w100px">网格员姓名</td>
                    <td class="tc w100px">联系方式</td>
                    </thead>
                    <tbody id="detailTab">
                    </tbody>
                </table>

            </div>
        </div>
    </div>
</div>

<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/grid_index.js"></script>
</body>
</html>