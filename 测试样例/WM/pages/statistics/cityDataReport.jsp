
<%@include file="../includeJsCss.html" %>

<!DOCTYPE html>
<html>

<head>
    <title>蛙鸣科技 | 城市数据分析</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="renderer" content="webkit">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link rel="stylesheet" href="../../resources/plugins/vue/vue-table.css"/>
    <link href="../../resources/css/rewcssChrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="../../resources/js/report/Init_Reporttime.js"></script>
    <!--引入下拉多选框样式-->
    <link href="../../resources/plugins/bootstrap-multiselect/css/bootstrap-multiselect.css" rel="stylesheet"/>
    <script type="text/javascript"
            src="../../resources/plugins/bootstrap-multiselect/js/bootstrap-multiselect-0.9.13.js"></script>
    <script type="text/javascript" src="../../resources/plugins/echarts-3.1.10/dist/echarts.min.3.7.0.js"></script>
</head>

<body class="ovh">
<%@ include file="../V1/topMenu.html" %>
<div id="content" class="pd10 table-scroll">
    <div class="top-search-container">
        <div class="form-inline">
            <div class="form-group btn-group" id="btngroup_1">
                <button class="btn btn-white btn-tabinfo btn-xs" @click="getType('btngroup_1',$event,'station',1)">
                    国家考核
                </button>
                <button class="btn btn-white btn-xs" @click="getType('btngroup_1',$event,'station',2)">省内考核</button>
                <button class="btn btn-white btn-xs" @click="getType('btngroup_1',$event,'station',3)">市内考核</button>
                <button class="btn btn-white btn-xs" @click="getType('btngroup_1',$event,'station',4)"> 按站点类型</button>
                <button class="btn btn-white btn-xs" id="districtDiv" @click="getType('btngroup_1',$event,'station',5)">
                    按区县
                </button>
            </div>
            <div class="form-group multiselect-div13" style="display: none;">
                <label class="m-r-10 m-l-10">区/县选择</label>
                <select id="example13" multiple="multiple" style="display: none;" v-model="district">
                    <option v-for="option in kh_district" value="{{option.id}}">{{option.text}}</option>
                </select>
            </div>

            <div class="form-group multiselect-div" style="display: none;">
                <label class="m-r-10 m-l-10">区/县选择</label>
                <select id="example14" multiple="multiple" style="display: none;" v-model="district">
                    <option v-for="option in option_district" value="{{option.id}}">{{option.text}}</option>
                </select>
            </div>

            <div class="form-group multiselect-stationdiv" style="display: none;">
                <label class="m-r-10 m-l-10">站点类型 </label>
                <select id="example15" class="multiselect-container" multiple="multiple" style="display: none;"
                        v-model="stationTypes">
                    <option v-for="option in option_stationTypes" value="{{option.code}}">{{option.text}}</option>
                </select>
            </div>

            <div class="form-group pull-right">
                <button type="button" class="btn btn-info  pull-right" @click="search">查询</button>
            </div>
        </div>
        <div class="form-inline m-t-5" id="btngroup_2">
            <div class="form-group btn-group">
                <button class="btn btn-white btn-xs btn-tabinfo " @click="getType('btngroup_2',$event,'time','hour')">
                    小时均值
                </button>
                <button class="btn btn-white btn-xs " @click="getType('btngroup_2',$event,'time','day')">日均值</button>
            </div>
            <div class="form-group m-l-10 ">
                <label class="m-r-10">
                    <input type="radio" name="date" value="4day" v-model="queryDateType"/> 近四天 </label>
                <label class="m-r-10">
                    <input type="radio" name="date" value="1week" v-model="queryDateType"/> 近一周 </label>
                <label class="m-r-10">
                    <input type="radio" name="date" value="autosite" v-model="queryDateType"/> 自定义 </label>
            </div>
            <div class="form-group" v-if="queryDateType === 'autosite'">
                <div class="input-group input-daterange" v-html="timeHtml">
                </div>
            </div>
        </div>
        <div class="m-t-5">
            <div class="form-group">
                <label class="m-r-5 ">污染物类型</label>
                <input type="checkbox" v-model="selAllPollution" v-bind:true-value="1" v-bind:false-value="0"><label
                    class="m-r-10 m-t-5">全部</label>
                <input type="checkbox" value="aqi" v-model="queryPollutionType"><label class="m-r-10 m-t-5">AQI</label>
                <input type="checkbox" value="pm25" v-model="queryPollutionType"><label
                    class="m-r-10 m-t-5">PM<sub>2.5</sub></label>
                <input type="checkbox" value="pm10" v-model="queryPollutionType"><label
                    class="m-r-10 m-t-5">PM<sub>10</sub></label>
                <input type="checkbox" value="so2" v-model="queryPollutionType"><label
                    class="m-r-10 m-t-5">SO<sub>2</sub></label>
                <input type="checkbox" value="no2" v-model="queryPollutionType"><label
                    class="m-r-10 m-t-5">NO<sub>2</sub></label>
                <input type="checkbox" value="co" v-model="queryPollutionType"><label class="m-r-10 m-t-5">CO </label>
                <input type="checkbox" value="o3" v-model="queryPollutionType"><label class="m-r-10 m-t-5">O<sub>3</sub></label>
            </div>
        </div>
    </div>
    <div id="scrollObj" class="m-t-10">
        <div class="chunk-set p-b-10 ovh">
            <div class="dn zindex9 post-abs pull-right" id="linePollutionType" style="right: 50px;">
                <select name="tst" v-model="linePollutionType" class="pull-right form-control m-t-20 m-r-10"
                        @change="search">
                    <option v-for="option in listPollutionType" value="{{option.id}}">{{option.code}}</option>
                </select>
            </div>
            <div style="height:268px;" class="m-t-20" id="multiStationChar"></div>
        </div>

        <div class="m-t-10 bgf b-radius4">
            <vuetable v-ref:vuetable api-url="${requestScope.coreApiContextPath}/multistation/listMultistationData"
                      pagination-path="" :fields="fields" table-class="table table-bordered table-striped table-hover "
                      pagination-class=""
                      pagination-info-class="" pagination-component-class="" :append-params="params" :per-page="perPage"
                      wrapper-class="vuetable-wrapper" table-wrapper=".vuetable-wrapper" isLoadding="true"
                      loading-class="loading"
                      row-class-callback="rowClassCB"></vuetable>
        </div>

    </div>
</div>
<script type="text/javascript" src="../../resources/plugins/vue/vue-1.0.24.min.js"></script>
<script type="text/javascript" src="../../resources/plugins/vue/vue-table.js"></script>
<script type="text/javascript" src="../../resources/js/statistics/cityDataReport.js"></script>
<script>
    $('.dropdown input, .dropdown label').click(function (event) {
        event.stopPropagation();
    });
</script>
<script type="text/javascript">
	$(document).ready(function() {
	    $(window).resize(function() {
	        calcOverflowH(1, "table-scroll", 40);
	    });
	});
	calcOverflowH(1, "table-scroll", 40);
    function addKhMultiSelect(obj) {
        $('#example13').multiselect({
            buttonClass: 'btn btn-white', //显示按钮style
            selectAllText: "全选",
            includeSelectAllOption: true,
            buttonWidth: 'auto',
            selectedClass: 'multiselect-selected multiselect-checked', //选中项样式
            buttonText: function (options) {
                obj.district = [];
                if (options.length === 0) {
                    return '无选择项';
                } else {
                    options.each(function () {
                        obj.district.push($(this).val());
                    });
                    var selected = '';
                    if (options.length <= 4) {
                        options.each(function () {
                            selected += $(this).text() + '| ';
                        });
                        return selected.substr(0, selected.length - 2) + ' ';
                    } else {
                        return '已选中个数：' + options.length + ' ';
                    }

                }
            }
        });
    }

    function addmultiselect(obj) {
        $('#example14').multiselect({
            buttonClass: ' btn btn-white', //显示按钮style
            selectAllText: "全选",
            selectedClass: 'multiselect-selected multiselect-checked', //选中项样式
            includeSelectAllOption: true,
            buttonWidth: 'auto',
            buttonText: function (options) {
                obj.district = [];
                if (options.length === 0) {
                    return '无选择项 ';
                } else {
                    options.each(function () {
                        obj.district.push($(this).val());
                    });
                    var selected = '';
                    if (options.length <= 4) {
                        options.each(function () {
                            selected += $(this).text() + '| ';
                        });
                        return selected.substr(0, selected.length - 2) + ' ';
                    } else {
                        return '已选中个数：' + options.length + ' ';
                    }

                }
            }
        });
    }

    function addmultiStationselect(obj) {
        $('#example15').multiselect({
            buttonClass: 'btn btn-white', //显示按钮style
            selectAllText: "全选",
            includeSelectAllOption: true,
            buttonContainer: '<div class="btn-group multiselectW200" />', //承载按钮和下拉框
            selectedClass: 'multiselect-selected multiselect-checked', //选中项样式
            buttonWidth: 'auto',
            buttonText: function (options) {
                obj.stationTypes = [];
                if (options.length === 0) {
                    return '无选择项 ';
                } else {
                    options.each(function () {
                        obj.stationTypes.push($(this).val());
                    });
                    var selected = '';
                    if (options.length <= 4) {
                        options.each(function () {
                            selected += $(this).text() + ' | ';
                        });
                        return selected.substr(0, selected.length - 2) + ' ';
                    } else {
                        return '已选中个数：' + options.length + ' ';
                    }

                }
            }
        });
    }
</script>
</body>

</html>