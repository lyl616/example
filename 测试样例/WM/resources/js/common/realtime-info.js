/**
 * 站点详细信息标题内容
 * @param {Object} domId
 * @param {Object} stationId
 */
function stationDetailTitle(domId, stationId) {
    $.ajax({
        type: "get",
        url: $.backendApiPath + "/wmstation/" + stationId,
        success: function (data) {
            $("#" + domId).html(makeStationDetailTitle(data.result));
        }
    });
}


