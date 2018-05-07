/**
 * @author liuyulong
 * @date 2017-01-12 17:59 对污染物尝浓度的 颜色 区间操作 公共 js
 */

var RANGE_AQI = [0, 50, 100, 150, 200, 300];
var RANGE_PM25 = [0, 35, 75, 115, 150, 250];
var RANGE_PM10 = [0, 50, 150, 250, 350, 420];
var RANGE_SO2 = [0, 150, 500, 650, 800, 1600];
var RANGE_CO = [0, 5, 10, 35, 60, 90];
var RANGE_O3 = [0, 160, 200, 300, 400, 800];
var RANGE_NO2 = [0, 100, 200, 700, 1200, 2340];
var RANGE_VOCS = [0, 400, 1000];

/**
 * 通过污染物 类别返回区间
 * @param type
 * @returns {[number,number,number,number,number,number]}
 */
function getRangeByType(type) {
    if (type == "aqi") {
        return RANGE_AQI;
    } else if (type == "pm25") {
        return RANGE_PM25;
    } else if (type == "pm10") {
        return RANGE_PM10;
    } else if (type == "so2") {
        return RANGE_SO2;
    } else if (type == "co") {
        return RANGE_CO;
    } else if (type == "o3") {
        return RANGE_O3;
    } else if (type == "no2") {
        return RANGE_NO2;
    } else if (type == "vocs") {
        return RANGE_VOCS;
    } else {
        return RANGE_PM25;
    }
}


function getClors(level) {
    var colrsArr = [
        {offset: 1, color: '#cecece'},
        {offset: 0, color: '#676767'},

    ];
    switch (level) {
        case 1:
            colrsArr = [
                {offset: 1, color: '#9dfc7c'},
                {offset: 0, color: '#4e7e3e'},

            ];
            break;
        case 2:
            colrsArr = [
                {offset: 1, color: '#fbfe29'},
                {offset: 0, color: '#7d7f14'},

            ];
            break;
        case 3:
            var colrsArr = [
                {offset: 1, color: '#ff8f43'},
                {offset: 0, color: '#7f4721'},

            ];
            break;
        case 4:
            colrsArr = [
                {offset: 1, color: '#fe5769'},
                {offset: 0, color: '#7f2b34'},

            ];
            break;
        case 5:
            colrsArr = [
                {offset: 0, color: '#520136'},
                {offset: 1, color: '#a4036d'},

            ];
            break;
        case 6:
            colrsArr = [
                {offset: 1, color: '#930012'},
                {offset: 0, color: '#490009'},

            ];
            break;
        default:
            colrsArr = [
                {offset: 1, color: '#cecece'},
                {offset: 0, color: '#676767'},

            ];
            break;
    }
    return colrsArr;
}


/**
 * 通过污染物类型获取上限值
 * @param type
 */
function getMaxDataByType(type) {

    var max = 500;
    switch (type) {

        case 'aqi': {
            max = 500;
        }
            break;
        case 'aqi2': {
            max = 500;
        }
            break;
        case 'pm25': {
            max = 500;
        }
            break;
        case 'pm10': {
            max = 600;
        }
            break;
        case 'co': {
            max = 150;
        }
            break;
        case 'so2': {
            max = 3000;
        }
            break;
        case 'no2': {
            max = 3000;
        }
            break;
        case 'o3': {
            max = 1000;
        }
            break;

    }
    return max;

}

/**
 * 计算 浓度区间的值
 *
 * @param value
 *            浓度值
 * @param range
 *            污染区间
 * @returns 返回 污染级别
 */
function computeLevel(value, range, type) {

    var beginIndex = 0;
    var beginValue = 0;
    var endValue = 0;

    var index = 0;
    // 是否找到区间,如果找不到,则会大于最大值或小于最小值
    var flag = false;
    for (var i = 0; i < range.length; i++) {
        if (i != range.length - 1 && value >= range[i] && value <= range[i + 1]) {
            flag = true;
            beginIndex = i;
            beginValue = range[i];
            endValue = range[i + 1];
            break;
        }
    }
    if (flag) { // 查找到区间，把浓度级别赋值给index
        index = beginIndex + 1; // 浓度级别 ，从1开始到 6.
    } else { // 未查找到区间，小于0或大于最大值
        if (value < range[0]) {
            index = -1; // 浓度值小于0
        } else if (value > range[range.length - 1]) {
            if (type == 'vocs') {
                index = 3; // vocs 的严重污染
            } else {
                index = 6; // >300 属于严重污染
            }

        }
    }
    // 左区间索引，左区间值，右区间值，右区间索引
    // var returnValue = [4];
    // returnValue[0] = index;
    // returnValue[1] = beginValue;
    // returnValue[2] = endValue;
    // returnValue[3] = index + 1;
    // return returnValue;

    return index;
}

function getLevalByValAndType(val, type) {
    var range = getRangeByType(type);
    return computeLevel(val, range, type);
}

/**
 * 通过污染的类别及值类型返回颜色信息
 * @param val
 * @param type
 * @returns {String}
 */
function getColorByValAndType(val, type) {
    var range = getRangeByType(type);
    var level = computeLevel(val, range, type);
    return getColorByLevel(level);
}

/**
 * 通过 污染级别返回 点的像素大小
 *
 * @param level
 * @returns {Number}
 */
function getVlByLevel(level) {
    var vl = 18;
    if (level == "-1") {
        vl = 13.5;
    } else if (level == "1") {
        vl = 15;
    } else if (level == "2") {
        vl = 16.5;
    } else if (level == "3") {
        vl = 18;
    } else if (level == "4") {
        vl = 19.5;
    } else if (level == "5") {
        vl = 21;
    } else if (level == "6") {
        vl = 22.5;
    }
    return vl;
}

function getVlByLevel2(level) {
    var vl = 25;
    if (level == "-1") {
        vl = 20.5;
    } else if (level == "1") {
        vl = 22;
    } else if (level == "2") {
        vl = 23.5;
    } else if (level == "3") {
        vl = 25;
    } else if (level == "4") {
        vl = 26.5;
    } else if (level == "5") {
        vl = 28;
    } else if (level == "6") {
        vl = 29.5;
    }
    return vl;
}

/**
 * 通过 污染级别返回相应的颜色信息
 *
 * @param level
 * @returns {String}
 */
function getColorByLevel(level) {
    if (level == "1") {
        return "#00E500";
    } else if (level == "2") {
        return "#FFFF00";
    } else if (level == "3") {
        return "#FF7E00";
    } else if (level == "4") {
        return "#FF0000";
    } else if (level == "5") {
        return "#99004C";
    } else if (level == "6") {
        return "#7E0023";
    } else {
        return "#00E500";
    }
}

/**
 * 根据 污染物类型显示 搜索区间
 *
 * @param id
 *            渲染 id
 * @param type
 *            污染物类型
 */
function showSeachRangeBtType(id, type) {
    var opt = $("#" + id);
    opt.empty();
    opt.append("<option value=\"-1\" > 请选择区间</option>");
    var range = getRangeByType(type);
    for (var i = 0; i < range.length; i++) {
        if (i == 0) {
            opt.append("<option selected=\"selected\" value=\"" + range[i] + "~" + range[i + 1] + "\">" + range[i] + "~" + range[i + 1] + "</option>");

        } else if (i != range.length - 1) {
            // 注 ： 这里的vale 通过~进行组合 到后 使用split方法进行分割
            opt.append("<option value=\"" + range[i] + "~" + range[i + 1] + "\">" + range[i] + "~" + range[i + 1] + "</option>");
        }
    }

}

function getMaxValByType(type) {
    var range = getRangeByType(type);
    return range[length - 1];
}

var windy_range1 = [0, 11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25,
    213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75, 360
];
var windy_type1 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];

/**
 * 根据 风向角度计算方向
 * @param value
 * @returns {*}
 */
function windy_dir(value) {
    //16方位集合
    var windy_range = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 295.5, 315, 337.5, 360];
    var windy_type = ['N', 'EN', 'EN', 'E', 'E', 'ES', 'ES', 'S', 'S', 'WS', 'WS', 'W', 'W', 'WN', 'WN', 'N'];

    var beginIndex = -1;
    var index = 0;
    // 是否找到区间,如果找不到,则会大于最大值或小于最小值
    var flag = false;
    for (var i = 0; i < windy_range.length; i++) {
        if (i != windy_range.length - 1 && value >= windy_range[i] && value <= windy_range[i + 1]) {
            flag = true;
            beginIndex = i;
            break;
        }
    }
    if (flag) { // 查找到区间，把浓度级别赋值给index
        index = beginIndex; // 浓度级别 ，从1开始到 6.
    } else { // 未查找到区间，小于0或大于最大值
        index = -1; // 浓度值小于0
    }

    if (index == -1) {
        return "";
    } else {

        return windy_type[index];
    }
}