/**
 * datatable 相关共用方法
 */
$.fn.dataTable.ext.errMode = "none";


function cusInitComplete() {
    $(".t_selt").click(function () {
        var tab = $(".customselt").DataTable();

        if ($(this).is(":checked"))
            tab.rows().select();
        else
            tab.rows().deselect();


        // var rows = tab.rows({
        //     selected : true
        // });
        // var count = rows.count();
        // if (count <= 0) {
        //     tab.rows().select();
        // } else {
        //     tab.rows().deselect();
        // }
    });
}


/**
 * dataTable种带有 tarCss 的表格
 * @param tarCss
 */
function initCheckAll(tarCss) {
    var _checkboxAll = $(".dt_chk_all");
    var _allCheckbox = $("." + tarCss).find('input[type="checkbox"]').not('.dt_chk_all');
    var tab = $("." + tarCss).DataTable();
    //全选
    _checkboxAll.click(function () {
        if ($(this).is(':checked')) {
            tab.rows().select();
            _allCheckbox.prop('checked', 'checked');
        }
        else {
            tab.rows().deselect();
            _allCheckbox.removeProp('checked');
        }
    });
    //各个行checkbox点击
    _allCheckbox.each(function (index) {
        $(this).click(function () {
            if ($(this).is(':checked')) {
                tab.rows(index).select();
            } else {
                tab.rows(index).deselect();
            }
            //判断是否全部选中
            var checkedAll = true;
            for (var i = 0; i < _allCheckbox.length; ++i) {
                if (!$(_allCheckbox[i]).is((':checked'))) {
                    checkedAll = false;
                }
            }
            if (checkedAll) {
                _checkboxAll.prop('checked', 'checked');
            } else {
                _checkboxAll.removeProp('checked');
            }
        });
    });
    //阻止td框点击事件
    $('td[tabindex="0"]').click(function (e) {
        e.stopPropagation();
        // var tab = $("." + tarCss).DataTable();
        // tab.row(0).select();
    });

}
