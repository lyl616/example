/**
 * Created by yulongliu on 2017/7/19.
 * 日历统计相关公共js
 */


/**
 * 切换 查询类型
 * @param callback
 */
function initSwitchBtn(callback) {
    // 污染浓度
    $("#concentration").click(function () {
        show_type = "1";
        $("#concentration").removeClass('btn-white');
        $("#concentration").addClass('btn-info');
        $("#contribution").removeClass('btn-info');
        $("#contribution").addClass('btn-white');
        callback();
    });
// >贡献率
    $("#contribution").click(function () {
        show_type = "2";
        $("#concentration").removeClass('btn-info');
        $("#concentration").addClass('btn-white');
        $("#contribution").removeClass('btn-white');
        $("#contribution").addClass('btn-info');
        callback();
    });

}

// 清空表格颜色及事件
function clearTabColr() {
    $(".tdHour").unbind("click");
    $(".tdHour").css('background-color', "white");
    $(".tdHour").css('cursor', 'default');
    $(".tdHour").css('color', '#000');
    $(".tdHour").html('');
}