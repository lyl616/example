/**
 * 统一修改曲线图的所有文字大小
 * @param {Object} option
 * @param {Object} size
 */
function setLineFontSize(option, size) {
    var bigSize = size;
    if (option.tooltip) {
        option.tooltip.textStyle = {fontSize: bigSize};
    }
    if (option.xAxis) {
        if (!(option.xAxis instanceof Array)) {
            var arr = new Array();
            arr[0] = option.xAxis;
            option.xAxis = arr;
        }
        for (var i = 0; i < option.xAxis.length; i++) {
            if (!option.xAxis[i].axisLabel) {
                option.xAxis[i].axisLabel = {};
            }
            option.xAxis[i].axisLabel.textStyle = {fontSize: bigSize};
        }
    }

    if (option.yAxis) {
        if (!(option.yAxis instanceof Array)) {
            var arr = new Array();
            arr[0] = option.yAxis;
            option.yAxis = arr;
        }
        for (var i = 0; i < option.yAxis.length; i++) {
            if (!option.yAxis[i].axisLabel) {
                option.yAxis[i].axisLabel = {};
            }
            option.yAxis[i].axisLabel.textStyle = {fontSize: bigSize};
        }
    }

    if (option.legend) {
        option.legend.textStyle = {fontSize: bigSize};
    }

    if (option.title) {
        if (!option.title.textStyle) {
            option.title.textStyle = {fontSize: bigSize};
        }
        option.title.textStyle.fontSize = bigSize;
    }
}

var dataZoom_inside = [{
    textStyle: {
        color: '#8392A5'
    },
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '80%',
    height: "25px",
    dataBackground: {
        areaStyle: {
            color: '#8392A5'
        },
        lineStyle: {
            opacity: 0.8,
            color: '#8392A5'
        }
    },
    handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
    }
}, {
    type: 'inside',
    disabled: true
}];


function tooltip_item() {
    return {
        trigger: 'item',
        axisPointer: {
            // type: 'cross'
        },
        formatter: function (params) {
            console.log(params)
            var res = "";
            var nowtime = params.data[0];//new Date(params.name).Format("dd日HH时");
            var itemName = params.seriesName;
            var marker = params.marker;
            res = nowtime + '<br/>';
            var t = "";
            if (isNaN(params.data[2])) {
                t = "<sup>*</sup>";
            } else {
                t = "";
            }

            res += marker + itemName + ":" + params.data[1] + t + '<br/>';
            return res;
        },
        position: ['50%', '50%']
    };
}

function tooltip_item_windy() {
    return {
        trigger: 'item',
        axisPointer: {
            // type: 'cross'
        },
        formatter: function (params) {
            var str = '';
            var dt = params.data;

            var data = new Array();
            data[0] = dt[0];
            data[1] = '   风速：' + dt[1];
            data[2] = '   风向：' + dt[2];

            var seriesName = params.seriesName;
            var seriesIndex = params.seriesIndex;
            var index = arrAryIndex(lend_windy, seriesName) + 4;

            if (seriesIndex == 0) {
                str += "<div class=\"clear\">" + data[0] + "       " + data[1] + "      " + data[2] + "</div>";
            } else {
                data[3] = seriesName + ":" + params.value[index];
                str += "<div class=\"clear\">" + data[0] + "       " + params.marker + data[3] + "</div>";
            }
            return str;
        },
        position: ['50%', '50%']
    };
}

/**
 * trigger: "axis"  坐标轴 气泡
 * @returns {{trigger: string, formatter: formatter, position: [string,string]}}
 */
function tooltip_axis() {
    return {
        trigger: "axis",
        axisPointer: {
            // type: 'cross'
        },
        formatter: function (params) {
            var obj = JSON.parse(JSON.stringify(params));

            obj = dataSort(params);
            var itemName = obj[0].axisValue;
            var str = "<div class=\"tooltip-tit\" style=\"font-size:12px\">" + itemName + "</div>";
            var fsize = 12,
                changeWid = 150;
            if (obj[0].seriesName.length <= 5) {
                changeWid = 100;
            } else {
                changeWid = 150;
            }
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].value[1] == NaN) {
                    obj[i].value[1] = '-';
                }
                var t = "";
                if (isNaN(obj[i].value[2])) {
                    t = "<sup>*</sup>";
                } else {
                    t = "";
                }
                str = str + "<div class=\"tooltip-data\" style=\"width:" +
                    changeWid + "px;\"><b style=\"color: " +
                    obj[i].color + ";\"> &bull;</b><i style=\"width:" + (changeWid - 30) + "px;\">" +
                    obj[i].seriesName + ":" + obj[i].value[1] + t + "</i>";
                str += "</div>";

            }
            return '<div style="font-size:' + fsize + 'px">' + str + '</div>';
        },
        position: ['5%', '5%']
    }
}

function tooltip_axis_windy() {
    return {
        trigger: 'axis',
        axisPointer: {
            // type: 'cross'
        },
        formatter: function (params) {


            var data = new Array(),
                sortArr = [],
                dt = [];
            var str = '<div class=\"tooltip-tit\" style="font-size:12px">';

            data[0] = new Date(params[0].data[0]).Format('yyyy-MM-dd hh:mm');
            data[1] = '   风速：' + params[0].data[1];
            data[2] = '   风向：' + params[0].data[2];
            str += "<div class=\"clear\">" + data[0] + "       " + data[1] + "      " + data[2] + "</div>";


            for (var j = 4; j < params.length; j++) {

                var seriesName = params[j].seriesName;

                dt = {
                    'text': keys[i].split("$")[1],
                    'value': params[j].value[dims[keys[i]]],
                    'marker': params[j].marker
                };
                sortArr.push(dt);

            }

            sortArr = dataSort(sortArr);

            for (var j = 0; j < sortArr.length; j++) {
                str += '<div class="tooltip-data" style="width:120px;display: inline">' + sortArr[j].marker + sortArr[j].text + ":" + sortArr[j].value + "</div>";
            }
            str += '</div>';
            return str;
        },
        position: ['5%', '5%']
    }
}


function toolBox_dataZoom() {
    return {
        right: "0px",
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {
                iconStyle: {
                    normal: {},
                    emphasis: {}
                }
            },
            saveAsImage: {
                show: true
            }
        }
    };
}

/**
 * 20种颜色
 * @type {[*]}
 */
var myColors = [
    "#94A1E9",
    "#FFBF00",
    "#1ACB18",
    "#0019A4",
    "#07D7A0",
    "#6E00FF",
    "#A1007E",
    "#FF7F97",
    "#AB7526",
    "#CC5127",
    "#FF6B00",
    "#F6F100",
    "#7ADE00",
    "#00A4A4",
    "#3758E1",
    "#9456A8",
    "#B200E3",
    "#FF2A9D",
    "#535353"
];


//排序
function dataSort(data) {
    var compare = function (obj1, obj2) {
        var val1 = obj1.value[1] == '--' ? 0 : obj1.value[1],
            val2 = obj2.value[1] == '--' ? 0 : obj2.value[1];
        if (val1 < val2) { //val1 放于val2 之后
            return 1;
        } else if (val1 > val2) { //val1 放于val2 之前
            return -1;
        } else {
            return 0;
        }
    };
    return data.sort(compare);
}