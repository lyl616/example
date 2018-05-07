var cus_pollutions = [
    {
        "name": "重点源",
        "child": [
            {
                "name": "燃煤电厂",
                "code": "22"
            }, {
                "name": "水泥厂",
                "code": "24"
            }, {
                "name": "煤化厂",
                "code": "25"
            }, {
                "name": "石油化工",
                "code": "26"
            }, {
                "name": "道路交通",
                "code": "27"
            }, {
                "name": "民用燃煤",
                "code": "32"
            }, {
                "name": "印染厂",
                "code": "91"
            }, {
                "name": "混凝土",
                "code": "92"
            }, {
                "name": "煤矿",
                "code": "93"
            }, {
                "name": "砖瓦陶瓷厂",
                "code": "94"
            }, {
                "name": "食品加工",
                "code": "95"
            }, {
                "name": "制药厂",
                "code": "96"
            }, {
                "name": "造纸厂",
                "code": "97"
            }, {
                "name": "垃圾处理厂",
                "code": "99"
            }, {
                "name": "石材企业",
                "code": "100"
            }, {
                "name": "其他地面源",
                "code": "53"
            }, {
                "name": "其他高架源",
                "code": "52"
            }]
    },
    {
        "name": "POI",
        "code": "105",
        "child": []
    }
// {"p" : "温度","child":[]},
// {"p" : "风","child":[]},
// {"p" : "插值图","child":[]}
]

var pcodes = [];
var localCodes = [];
$(function () {
    $.each(cus_pollutions, function (index, data) {

        if (data.child.length > 0) {
            $.each(data.child, function (cindex, cd) {

                var chcode = cd.code;
                var chname = cd.name;
                if (chcode == chname) {
                    localCodes.push(chcode)
                } else {
                    pcodes.push(chcode);
                }
            });
        }
    });
});

