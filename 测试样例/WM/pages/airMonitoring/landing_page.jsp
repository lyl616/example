<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>


<html lang="en">

<head>
    <meta charset="utf-8"/>
    <title>蛙鸣科技 | 首页</title>
    <link rel="stylesheet" href="${ctx}/resources/css/bootstrap.min.css"/>

    <script type="text/javascript" src="${ctx}/resources/plugins/layer/layer.js"></script>
    <script type="text/javascript"
            src="http://api.map.baidu.com/api?v=2.0&ak=uF99UKCfyDpn0dOjZcDtNd3u8ANCNI0D"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/bmap.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/com-map.js"></script>
    <!--中间地图生成部分-->
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/echarts.min.js"></script>
    <script type="text/javascript"
            src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/echarts-gl.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/ecStat.min.js"></script>
    <script type="text/javascript"
            src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/dataTool.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/map/js/china.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/map/js/world.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/bmap.min.js"></script>
    <script type="text/javascript" src="${ctx}/resources/plugins/echarts-3.1.10/dist/extension/simplex.js"></script>
    <!--环形进度条效果-->
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/css/circleProgress.css">
    <!--翻页效果-->
    <link rel="stylesheet" type="text/css" href="${ctx}/resources/plugins/flipcountdown/jquery.flipcountdown.css">
    <script type="text/javascript" src="${ctx}/resources/plugins/flipcountdown/jquery.flipcountdown.js"></script>
    <link href="${ctx}/resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="${ctx}/resources/js/common/lev-color.js"></script>
    <script type="text/javascript" src="${ctx}/resources/js/common/dateHelper.js"></script>
</head>

<body class="ui-land-page-bodybg">
<%@include file="../V1/topMenu.jsp" %>
<!--左侧的面板开始-->
<div id="content">
    <div class="post-fixed ui-land-page ui-land-page-left">
        <div class="ui-land-page-title">
            <div class="content">超标统计</div>
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
        </div>
        <div class="ui-land-page-content m-t-5">
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
            <div class="content" style="height: 52px;">
                <a :href="thirdOverHref">
                    <div class="total pull-left">
                        <span class="total-tit">今日三级超标次数</span>
                        <div class="ui-flipcountdown">
                            <span class="retroclockbox1" id='retroclockbox1'></span>
                        </div>
                    </div>
                </a>
                <a :href="forthOverHref">
                    <div class="total pull-right">
                        <span class="total-tit">今日四级超标次数</span>
                        <div class="ui-flipcountdown">
                            <span class="retroclockbox2" id='retroclockbox2'></span>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <!------------------------------------top 10开始------------------------->
        <div class="ui-land-page-title m-t-10">
            <div class="content">{{cityType}}AQI排名</div>
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
        </div>
        <a :href="topTenHref">
            <div class="ui-land-page-content m-t-5">
                <span class="icon-lefttop"></span>
                <span class="icon-leftbottom"></span>
                <span class="icon-righttop"></span>
                <span class="icon-rightbottom"></span>
                <div class="content p-r-10" id="topten">
                </div>
            </div>
        </a>
        <!------------------------------------top 10 结束--------------------------->
        <!------------------------------------优良天数占比开始------------------------->
        <div class="ui-land-page-title m-t-10">
            <div class="content">优良天数</div>
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
        </div>
        <div class="ui-land-page-content m-t-5">
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
            <div class="content" id="bestBadday">
            </div>
        </div>
        <!------------------------------------优良天数占比 结束--------------------------->
        <!------------------------------------城市月份对比开始------------------------->
        <div class="ui-land-page-title m-t-10">
            <div class="content">PM<sub>2.5</sub>月度统计</div>
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
        </div>
        <div class="ui-land-page-content m-t-5">
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
            <div class="content" id="cityMonthCompare">
            </div>
        </div>
        <!------------------------------------城市月份对比 结束--------------------------->

    </div>
    <!--左侧的面板结束-->
    <!--中间地图部分开始-->
    <div class="post-fixed ui-land-page ui-land-page-map">

        <div id="container" class="content">
            <!-- 这里以后是地图   -->
        </div>
        <div class="circle-progress ui-landingpage-circle">
            <div class="htmleaf-container">
                <!--aqi污染值开始-->
                <div data-items-count='32' id="p1_barPie"
                     class="barPie barPie01 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">AQI</span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup1" :id="filterCircleId(n,index,'p1_barPieItem')"
                                   :value="filterCircleValue(index)" hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p1_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--aqi污染值结束-->

                <!--pm25污染值开始-->
                <div data-items-count='32' id="p2_barPie"
                     class="barPie barPie02 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">PM<sub>2.5</sub></span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup2" :id="filterCircleId(n,index,'p2_barPieItem')"
                                   :value="filterCircleValue(index)" hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p2_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--pm25污染值结束-->

                <!--pm10污染值开始-->
                <div data-items-count='32' id="p3_barPie"
                     class="barPie barPie03 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">PM<sub>10</sub></span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup3" :id="filterCircleId(n,index,'p3_barPieItem')"
                                   :value="filterCircleValue(index)" hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p3_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--pm10污染值结束-->

                <!--co污染值开始-->
                <div data-items-count='32' id="p4_barPie"
                     class="barPie barPie04 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">CO</span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup4" :id="filterCircleId(n,index,'p4_barPieItem')"
                                   :value="filterCircleValue(index)" hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p4_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--co污染值结束-->

                <!--so2污染值开始-->
                <div data-items-count='32' id="p5_barPie"
                     class="barPie barPie05 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">SO<sub>2</sub></span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup5" :id="filterCircleId(n,index,'p5_barPieItem')"
                                   :value="filterCircleValue(index)" hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p5_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--so2污染值结束-->

                <!--no2污染值开始-->
                <div data-items-count='32' id="p6_barPie"
                     class="barPie barPie06 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">NO<sub>2</sub></span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup6" :id="filterCircleId(n,index,'p6_barPieItem')"
                                   :value="filterCircleValue(index)" hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p6_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--no2污染值结束-->

                <!--o3污染值开始-->
                <div data-items-count='32' id="p7_barPie"
                     class="barPie barPie07 barPie--radio">
                    <span class="barPie__value">0</span>
                    <span class="barPie__name">O<sub>3</sub></span>
                    <div class="barPie__ring">
                        <template v-for="(n,index) in numbers">
                            <input type="radio" name="barPieRadioGroup7" checked="checked"
                                   :id="filterCircleId(n,index,'p7_barPieItem')" :value="filterCircleValue(index)"
                                   hidden="hidden"/>
                            <label :class="filterCircleClass(n,index,'p7_barPieClass')"></label>
                        </template>
                    </div>
                </div>
                <!--o3污染值结束-->
            </div>
        </div>
    </div>
    <!--中间地图部分结束-->
    <!--右侧的面板开始-->
    <div class="post-fixed ui-land-page ui-land-page-right">
        <!------------------------------------勘查工单统计开始------------------------->
        <div class="ui-land-page-title">
            <div class="content">勘查工单</div>
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
        </div>
        <div class="ui-land-page-content m-t-5">
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
            <div class="content" style="height: 52px;">
                <a :href="allSurveyJobHref">
                    <div class="ui-land-page-numcard pull-left m-t-5">
                        <b>{{ doingNum + finishNum }}</b>
                        <b>工单总数</b>
                    </div>
                </a>
                <a :href="doingSurveyJobHref">
                    <div class="ui-land-page-numcard pull-left m-t-5">
                        <b>{{ doingNum }}</b>
                        <b>进行中工单</b>
                    </div>
                </a>
                <a :href="finishSurveyJobHref">
                    <div class="ui-land-page-numcard pull-right m-t-5 text-right">
                        <b>{{ finishNum }}</b>
                        <b>已完成工单</b>
                    </div>
                </a>
            </div>
        </div>
        <!------------------------------------勘查工单统计 结束--------------------------->

        <!------------------------------------城市异常点信息开始------------------------->
        <div class="ui-land-page-title m-t-10">
            <div class="content">异常点信息</div>
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
        </div>
        <div class="ui-land-page-content m-t-5">
            <span class="icon-lefttop"></span>
            <span class="icon-leftbottom"></span>
            <span class="icon-righttop"></span>
            <span class="icon-rightbottom"></span>
            <div class="content xhideyauto ovh ui-autoHiehgt-site">
                <div class="list m-l-10 ">
                    <div class="list-ul" v-for="item in infoList">
                        <span class="level-1bg"></span>
                        <ul>
                            <li>{{item.stationName}} <i class="pull-right">{{item.instime}}</i></li>
                            <li>{{item.info}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!------------------------------------城市异常点信息结束--------------------------->
    </div>
    <!--右侧的面板结束-->
</div>
<script type="text/javascript" src='${ctx}/resources/js/airMonitoring/stopExecutionOnTimeout.js?t=1'></script>
<script type="text/javascript" src='${ctx}/resources/js/airMonitoring/do-in.js'></script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/landing_page.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/airMonitoring/airMonitoring-echars.js"></script>

</body>

</html>