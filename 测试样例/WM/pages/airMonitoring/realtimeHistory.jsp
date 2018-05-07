



<!DOCTYPE >
<html lang="en">

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 大气监测</title>
    <link rel="stylesheet" href="${ctx}/resources/plugins/leaflet/css/initmap.css"/>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <link href="${ctx}/resources/css/timelineProgress.css" rel="stylesheet"/>
    <!--引用百度地图插件开始-->
    <link rel="stylesheet" href="${ctx}/resources/plugins/bmap/DrawingManager_min.css"/>
    <link href="${ctx}/resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css"/>
    <link href="${ctx}/resources/plugins/bmap/TrafficControl_min.css" rel="stylesheet" type="text/css"/>

    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/DistanceTool_min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/DrawingManager_min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bmap/TrafficControl_min.js"></script>
    <!--引用百度地图插件结束-->
    <!--时间控件-->
    <script type="text/javascript" src="${ctx}/resources/plugins/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/report/Init_Reporttime.js"></script>
    <!--地图操作-->
    <script type="text/javascript" src="${ctx}/resources/js/management/pollution/conf-pollutions.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.3.1.10.min.js"></script>
</head>

<body class="ovh">
<%@include file="../V1/topMenu.jsp" %>
<div id="content" class="panel-left map-panel-left min-map-left">
    <div class="post-rel">
        <!-----------------------------------------------地图部分-------------------------------------------------------------->
        <!--百度地图开始-->
        <div class="w100ch100c" id="baidumap"></div>
        <!--百度地图结束-->
        <!--地图左上角工具-->
        <div class="ltop-map-tool post-abs btn-group blank-box-shadow">
            <button v-for="item in pollutionTypeList" :disabled="item.isDisable" class="btn blank-box-shadow" :class="{'btn-info':btnStatus[item.id].isActive,'btn-white':btnStatus[item.id].noActive } " @click="changePollution(item.id)"
                    v-html="item.name"></button>
        </div>
        <!--地图左上角工具结束-->
        <!--地图左下角工具-->
        <div class="lbottom-map-tool post-abs">
            <button class="btn w90 text-left blank-box-shadow" :class="{'btn-info':stationFgBtnStatus.isActive,'btn-white':stationFgBtnStatus.noActive }" @click="stationIsCover"><span class="icon icon-s"></span>站点</button>
            <div class="post-rel" id="pollutionSource">
                <button v-if="'ROLE_FUN_001_06_01' in allFunctions" class="btn m-t-10 w90 text-left blank-box-shadow" :class="{'btn-white':psdropListShowBtn.status.noActive,'btn-info':psdropListShowBtn.status.isActive}" @click="showPollutionselect">
                    <span class="icon icon-p"></span>污染源
                </button>
                <div class="drop-panel-nav" v-show="psdropListShowBtn.pSelectHtmlIsShow">
                    <template v-for='item in psdropListHtml'>
                        <label class="m-t-5 m-b-5 clear">{{item.name}}
                            <template v-if='item.code'><input :id="item.code" :name='item.name' @click="pSourceCheckboxSelect(item.code,item.name,$event)" class="form-control" type="checkbox"/></template>
                        </label>
                        <ul v-for="item1 in item.child">
                            <li><input :id="item1.code" :name='item1.name' @click="pSourceCheckboxSelect(item1.code,item1.name,$event)" class="form-control" type="checkbox"><label>{{item1.name}}</label></li>
                        </ul>
                    </template>
                </div>
                <div class="m-t-10 btn-select glyphicon-chevron-up" v-show="psdropListShowBtn.pSelectIsShow" @click="showPolltionPanel">请选择...</div>
            </div>
            <div class="m-t-10" v-if="'ROLE_FUN_001_06_01' in allFunctions">
                <button :disabled="isDesablePClound" class="btn w90 text-left dib blank-box-shadow" :class="{'btn-white':pCloundBtnStatus.status.noActive,'btn-info':pCloundBtnStatus.status.isActive}" @click="showpCloundPicture"><span
                        class="icon icon-c"></span>污染云图
                </button>
                <button :disabled="isDesablePClound" class="btn btn-white m-l-5 blank-box-shadow" @click="viewPics"><span class="icon icon-d"></span></button>
            </div>
            <input class="btn text-left m-t-10 Wdate time-btn blank-box-shadow" id="timeControl" @focus="initCurrentTime" :value="timeControl" type="text" v-model="timeControl"/>
        </div>
        <!--地图左下角工具结束-->
        <!--地图右上角工具-->
        <div class="rtop-map-tool post-abs">
            <button class="btn btn-white maptype-control blank-box-shadow" :class="{'btn-info':mapControl['difMap'].isActive,'btn-white':mapControl['difMap'].noActive } " @click="mapTypeChange"></button>
            <button class="btn btn-white map-operat m-t-10 blank-box-shadow" :class="{'btn-info':mapControl['mapOperat'].isActive,'btn-white':mapControl['mapOperat'].noActive } " @click="initDrawingManager"></button>
            <button class="btn btn-white map-ruler m-t-10 blank-box-shadow" :class="{'btn-info':mapControl['mapRuler'].isActive,'btn-white':mapControl['mapRuler'].noActive } " @click="distanceTool"></button>
            <button class="btn btn-white map-light m-t-10 blank-box-shadow" :class="{'btn-info':mapControl['mapLight'].isActive,'btn-white':mapControl['mapLight'].noActive } " @click="traffic"></button>

            <button class="btn btn-white map-controlb m-t-10 blank-box-shadow" @click="zoomUp"></button>
            <button class="btn btn-white map-controls m-t-10 blank-box-shadow" @click="zoomDown"></button>
        </div>
        <!--地图右上角工具结束-->
        <!--地图右下角工具-->
        <div class="rbottom-map-tool post-abs">
            <div class="btn-group pull-right m-b-10">
                <button class="btn blank-box-shadow" @click="timeTypeChange('hour')" :class="{'btn-info':timeType['hour'].isActive,'btn-white':timeType['hour'].noActive}">小时</button>
                <button class="btn blank-box-shadow" @click="timeTypeChange('day')" :class="{'btn-info':timeType['day'].isActive,'btn-white':timeType['day'].noActive}">天</button>
            </div>
            <div class="btn-group clear pcard-color">
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color1':pollutionBtnStatus['lx'].isActive,'btn-disable':pollutionBtnStatus['lx'].noActive}" @click="changeShowLevel('-1','lx')">离线</button>
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color2':pollutionBtnStatus['y'].isActive,'btn-disable':pollutionBtnStatus['y'].noActive}" @click="changeShowLevel('1','y')">优</button>
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color3':pollutionBtnStatus['l'].isActive,'btn-disable':pollutionBtnStatus['l'].noActive}" @click="changeShowLevel('2','l')">良</button>
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color4':pollutionBtnStatus['q'].isActive,'btn-disable':pollutionBtnStatus['q'].noActive}" @click="changeShowLevel('3','q')">轻度</button>
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color5':pollutionBtnStatus['z'].isActive,'btn-disable':pollutionBtnStatus['z'].noActive}" @click="changeShowLevel('4','z')">中度</button>
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color6':pollutionBtnStatus['zd'].isActive,'btn-disable':pollutionBtnStatus['zd'].noActive}" @click="changeShowLevel('5','zd')">重度</button>
                <button class="btn" :disabled="pollutionBtnIsdisable" :class="{'btn-color7':pollutionBtnStatus['yz'].isActive,'btn-disable':pollutionBtnStatus['yz'].noActive}" @click="changeShowLevel('6','yz')">严重</button>
            </div>
        </div>
        <!--地图右下角工具结束-->
        <!-- 污染云图下载 模态框（Modal）开始 -->
        <div class="modal fade" id="dvalueModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog" style="width: 700px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" @click="closePicsModal" aria-hidden="true">
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
                            <input type="button" class="btn btn-info" @click="selAll_pic()" id="selAll" value="全部选中" v-show="isshowAllDownloadBtn"/>
                            <button type="button" class="btn btn-info" @click="downLoadPics()">下载</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- 污染云图下载 模态框（Modal）结束 -->
        <!------------------------------------------------进度条控制部分--------------------------------------------------------->
        <!--小时单进度条开始-->
        <!---->
        <div class="timeline-progres" id="progres01">
            <div class="progTime_btnpaly">
                <span class="changeChars-btn" onclick="openPanle('progres02',progres01,'hour',progres02);"></span>
                <span class="paly-btn progressTime_control" onclick="progressTimeControl(this,'progres01',progres01,'hour')" title="开始"></span>
            </div>
            <div class="progTime progressTime zindex9 bgf">
                <div>
                    <p class="startTime" style=" float:left;margin-left:68px;opacity: 0;display: none;"></p>
                    <p class="endTime" style=" float:right;margin-right:68px;opacity: 0;display: none;"></p>
                </div>
                <div class="time_slot">
                </div>
                <div class="progTime_concent">
                    <div class="scrollBarBox" onclick="scrollClick(progres01,'progres01','hour',progres02)" onmousemove="scrollMove(progres01,'progres01','hour',progres02)">
                        <div class="scrollBar">
                            <div class="scroll_Track"></div>

                            <div class="timecode"></div>
                        </div>
                    </div>
                    <div class="currTime_line" onclick="scrollClick(progres01,'progres01','hour',progres02)"></div>
                </div>
            </div>
            <div class="scroll_Thumb"></div>
        </div>
        <!--小时单进度条结束-->
        <!--小时进度条面板开始-->
        <div class="timepanel-progres dn" id="progres02">
            <div class="progTime_btnpaly">
                <span class="changeChars-btn" onclick="closePanle('progres02')"></span>
                <div class="tptext-list">
                    <span>首污</span>
                    <span>AQI</span>
                    <span>温度℃</span>
                    <span>湿度</span>
                    <span>风速ｍ/ｓ</span>
                    <span>风向</span>
                </div>
            </div>
            <div class="progTime progressTime zindex9 ">
                <div class="bgf" style="width: 2074px; ">
                    <div>
                        <p class="startTime" style=" float:left;margin-left:68px;opacity: 0;display: none;"></p>
                        <p class="endTime" style=" float:right;margin-right:68px;opacity: 0;display: none;"></p>
                    </div>
                    <div class="time_slot"></div>
                    <div class="progTime_concent">
                        <div class="scrollBarBox" onclick="scrollClick(progres02,'progres02','hour',progres01)" onmousemove="scrollMove(progres02,'progres02','hour',progres01)">
                            <div class="scrollBar" style="width: 2074px;">

                                <div class="scroll_Track"></div>
                                <div class="scroll_Thumb"></div>
                                <div class="timecode"></div>
                            </div>
                        </div>

                        <div class="currTime_line" onclick="scrollClick(progres02,'progres02','hour',progres01)"></div>
                    </div>
                    <div class="scrollData post-rel">
                        <div id="time-datalist" class="time-dataShowc" style="height: 193px;width: 2070px;">
                        </div>
                        <div id="time-chart" class="time-datachart" style="height: 193px; width: 2070px;">
                        </div>
                    </div>

                </div>
            </div>

        </div>
        <!--小时进度条面板结束-->
        <!-------------------------------------------------------天进度面板开始-------------------------------------------------->
        <!--天单进度条开始-->
        <!---->
        <div class="timeline-progres dn" id="progres03">
            <div class="progTime_btnpaly">
                <span class="changeChars-btn" onclick="openPanle('progres04',progres03,'day',progres04);"></span>
                <span class="paly-btn progressTime_control" onclick="progressTimeControl(this,'progres03',progres03,'day')" title="开始"></span>
            </div>
            <div class="progTime progressTime zindex9 bgf">
                <div>
                    <p class="startTime" style=" float:left;margin-left:68px;opacity: 0;display: none;"></p>
                    <p class="endTime" style=" float:right;margin-right:68px;opacity: 0;display: none;"></p>
                </div>
                <div class="time_slot">
                </div>
                <div class="progTime_concent">
                    <div class="scrollBarBox" onclick="scrollClick(progres03,'progres03','day',progres04)" onmousemove="scrollMove(progres03,'progres03','day',progres04)">
                        <div class="scrollBar">
                            <div class="scroll_Track"></div>

                            <div class="timecode"></div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="scroll_Thumb"></div>
        </div>
        <!--天单进度条结束-->
        <!--天面板进度条开始-->
        <div class="timepanel-progres dn" id="progres04">
            <div class="progTime_btnpaly">
                <span class="changeChars-btn" onclick="closePanle('progres04')"></span>
                <div class="tptext-list">
                    <span>首污</span>
                    <span>AQI</span>
                    <span>温度℃</span>
                    <span>湿度</span>
                    <span>风速ｍ/ｓ</span>
                    <span>风向</span>
                </div>
            </div>
            <div class="progTime progressTime zindex9 ">
                <div class="bgf" style="width: 2074px; ">
                    <div>
                        <p class="startTime" style=" float:left;margin-left:68px;opacity: 0;display: none;"></p>
                        <p class="endTime" style=" float:right;margin-right:68px;opacity: 0;display: none;"></p>
                    </div>
                    <div class="time_slot"></div>
                    <div class="progTime_concent">
                        <div class="scrollBarBox" onclick="scrollClick(progres04,'progres04','day',progres03)" onmousemove="scrollMove(progres04,'progres04','day',progres03)">
                            <div class="scrollBar" style="width: 2074px;">
                                <div class="scroll_Track"></div>
                                <div class="scroll_Thumb"></div>
                                <div class="timecode"></div>
                            </div>
                        </div>
                    </div>
                    <div class="scrollData post-rel">
                        <div class="time-dataShowc" style="height: 193px;width: 2074px;">
                        </div>
                        <div id="day-chart" class="time-datachart" style="height: 193px; width: 2074px;">
                        </div>
                    </div>

                </div>
            </div>

        </div>
        <!--天面板进度条结束-->

        <%--圈选开始--%>
        <div class="modal fade" id="rectangleWin" style="display: none;" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content w500px big-modal-content">
                    <div class="modal-header" id="slt_tabs">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            <a href="#" @click="closeResultModal" class="f-w-600 right">x</a>
                        </button>
                        <h4 class="modal-title">
                            圈选内容 <span id="divStationName1" class="m-l-15"></span>
                        </h4>
                    </div>
                    <div class="tab-content tabs-container modal-body">
                        <ul class="nav nav-tabs m-b-10">
                            <li class="active">
                                <a href="#concentration" role="tab" data-toggle="tab">站点</a>
                            </li>
                            <li>
                                <a href="#pollution" role="tab" data-toggle="tab">潜在污染源</a>
                            </li>
                        </ul>
                        <div role="tabpanel" class="tab-pane active xhideyauto" id="concentration" style="height: 400px;">
                            <div class=" clear table-responsive">
                                <vuetable ref="vuetable" api-url="${coreApiPath}/stationNew/listStations" :fields="fields" :table-height="tableHeight" :sort-order="sortOrder" :per-page="perPage" :append-params="moreParams"
                                          :query-params="{ sort: 'sort', page: 'page', perPage: 'perPage' }" http-method="post" :load-on-start="false" pagination-path="pagination" @vuetable:pagination-data="onPaginationData"
                                          @vuetable:load-success="onLoadSuccess"></vuetable>
                                <div class="vuetable-pagination">
                                    <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                                    <component :is="paginationComponent" ref="pagination" @vuetable-pagination:change-page="onChangePage"></component>
                                </div>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane xhideyauto" id="pollution" style="height: 400px;">
                            <table id="rectangle_tab" class="vuetable table table-bordered table-striped table-hover vuetable-fixed-layout">
                                <thead>
                                <tr>
                                    <th id="_title" class="vuetable-th-title text-center">名称</th>
                                    <th id="_address" class="vuetable-th-address text-center">地址</th>
                                    <th id="_keyword" class="vuetable-th-keyword text-center">类别</th>
                                    <th id="_lng" class="vuetable-th-lng text-center">经度</th>
                                    <th id="_lat" class="vuetable-th-lat text-center">纬度</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-if="resultData.length != 0" v-for="(value,index) in resultData">
                                    <td id="{{ value.title }}" class="vuetable-th-equipmentId text-center">{{value.title}}</td>
                                    <td id="{{ value.address }}" class="vuetable-th-equipmentId text-left">{{value.address}}</td>
                                    <td id="{{ value.keyword }}" class="vuetable-th-mountStatus text-center" width="80px">{{value.keyword}}</td>
                                    <td id="{{ value.lng }}" class="vuetable-th-mountTime text-center">{{value.lng}}</td>
                                    <td id="{{ value.lat }}" class="vuetable-th-mountTime text-center">{{value.lat}}</td>
                                </tr>
                                <tr v-if="resultData.length == 0">
                                    <td colspan="5" class="vuetable-th-noda text-center">没有数据</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%--圈选结束--%>
    </div>
</div>
<!--左侧的面板结束-->
<!--右侧的面板开始-->
<div id="app" class="panel-right map-panel-right map-zcontent-show map-zcontent-hide">
    <div>
        <div class="rel-btn-toogle rel-btn-toogle-hide" @click="toogleContianer">
            <span class="btn-jt-left"></span>
        </div>
        <div class="text-center post-rel">
            <input class="form-control icon-search" v-model="stationId" type="text"
                   placeholder="请输入站点编号或名称" @keyup.enter="searchStation(stationId)"
                   @keyup="checkStationInfo($event)"/>
            <ul class="search-down-list" v-show="isShowDownList">
                <li v-for="item in search_down_list" @click="searchStation(item.text)">{{item.text}}</li>
            </ul>
        </div>
        <div class="m-t-10 ovh">
            <div class="col-sm-4">行政区</div>
            <div class="col-sm-4">站点种类</div>
            <div class="col-sm-4">站点类型</div>
        </div>
        <div class="select-group map-panel-select ovh clear m-t-5">
            <select class="form-control" v-model="s_district">
                <option value="-1">全部</option>
                <option v-for="item in s_area_list" :value="item.id">{{item.name}}</option>
            </select>

            <select class="form-control" v-model="s_tech_type" @change="resiteStechType">
                <option value="-1|全部">全部</option>
                <option v-for="item in s_tech_type_list" :value="item.id+'|'+item.name">{{item.name}}</option>
            </select>

            <select class="form-control" v-model="s_station_type" @change="getStationRank">
                <option v-for="item in station_type_list" :value="item.id">{{item.name}}</option>
            </select>
        </div>
        <div class="m-t-10 g434343 ">
            数据时间：{{weatherVM.queryParams.currentTime}}
        </div>
        <div class="vuetabletable-loadanimation clear m-t-10 m-l--15 m-r--15" id="station_info_list">
            <vuetable ref="vuetable" :table-height="tableHeight" :table-class="tableClass" :sort-order="sortOrder" http-method="post" api-url="${coreApiPath}/stationNew/list/rank/staions" :fields="fieldRight" pagination-path="pagination"
                      :load-on-start="false" :append-params="moreParams" @vuetable:cell-clicked="onRowClicked" @vuetable:cell-mouseenter="onCellMouseEnter" @vuetable:cell-mouseleave="onCellMouseLeave" @vuetable:load-success="onLoadSuccess"
                      @vuetable:row-clicked="onRowClicked"/>
            </vuetable>
        </div>
    </div>
    <div id="mapHtml" style="display: none;">
        <div class="tooltip-control mapbtn-danxActive post-abs map-Btnsurver-abs mapbtn-danxActive" title="点选站点"></div>
        <div class="tooltip-control post-abs map-Btnsurver-abs" :class="{'mapbtn-circlexActive':btnStatus['mapbtnCirclex'].isActive,'mapbtn-circlex':btnStatus['mapbtnCirclex'].noActive}" onclick="openDrawingManager()" title="圈选地图站点"></div>
        <div class="tooltip-control post-abs map-Btnsurver-abs" :class="{'mapbtn-clearActive':btnStatus['mapbtnclear'].isActive,'mapbtn-clear':btnStatus['mapbtnclear'].noActive}" onclick="clearSelectMarker()" title="清除选中站点"></div>
        <div id="allmap" style="height:100%;"></div>
    </div>
</div>
<!--右侧的面板结束-->

<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/realtimePC/realtmeHistoryMap.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/realtimePC/realtmeHistoryCommon.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/realtimePC/timelineProgress.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/realtimePC/stationPane.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/country_index_initCharts.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/common/echarts-common.js"></script>

</body>

</html>