/**
 * /**
 * 初始化省市里区的公共js
 */

/**
 * 初始化省信息
 *
 * @param pro
 *            不为-1 默认选中
 * @param proDom
 *            渲染的省div
 * @param city
 *            不为-1 默认选中
 * @param cityDom
 *            渲染的市div
 * @param districtId
 *            不为-1 默认选中
 * @param distDom
 *            渲染的区县div
 */
function initPrrovince(pro, proDom, city, cityDom, districtId, distDom) {
    var url = $.backendApiPath + "/pollutionrepo/domains";
    var opt = $("#" + proDom);
    opt.empty();
    var param = {
    	city_type:1
    };
    ajax(url, param, function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].id + "\">" + data[i].domainName + "</option>");
            }
            if (pro == "-1") {
                initCityByProId(opt.val(), "-1", cityDom, "-1", distDom);
            } else {
                if (city != "-1") {
                    opt.find("option[value='" + pro + "']").attr("selected", true);
                    if (districtId != -1) {
                        initCityByProId(pro, city, cityDom, districtId, distDom);
                    } else {
                        initCityByProId(pro, city, cityDom, "-1", distDom);
                    }
                }
            }
        }
    });
}

/**
 * 初始化城市
 * @param provinceId 查询省份的id
 * @param cityId 不是-1则默认选中
 * @param cityDom  渲染的DIV
 * @param district 不是-1则默认选中
 * @param distDom 渲染区县的DIV
 */
function initCityByProId(provinceId, cityId, cityDom, district, distDom) {
    var opt = $("#" + cityDom);
    opt.empty();
    var opt2 = $("#" + distDom);
    opt2.empty();
    if (provinceId == "" || provinceId == null) {
        return;
    }
    var url = $.backendApiPath + "/pollutionrepo/domains";
    var param = {
    	parent_id: provinceId,
    	city_type:2
    };

    ajax(url, param, function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].id + "\">" + data[i].domainName + "</option>");
            }
            if (cityId == "-1") {
                initDistrictByCityId(opt.val(), "-1", distDom);
            } else {
                // 选中城市
                opt.find("option[value='" + cityId + "']").attr("selected", true);
                if (district != "-1") {
                    initDistrictByCityId(cityId, district, distDom);
                } else {
                    initDistrictByCityId(cityId, "-1", distDom);
                }
            }
        }
    });
}

/**
 * * 初始化 县（区）信息
 * @param cityId
 * @param district
 * @param distDom
 */
function initDistrictByCityId(cityId, district, distDom) {
    var url = $.backendApiPath + "/pollutionrepo/domains";
    var param = {
    	parent_id: cityId,
    	city_type:3
    };
    var opt = $("#" + distDom);
    opt.empty();
    ajax(url, param, function (data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                opt.append("<option value=\"" + data[i].id + "\">" + data[i].domainName + "</option>");
            }
            if (district != "-1") {
                opt.find("option[value='" + district + "']").attr("selected", true);
            }
        }
    });

}