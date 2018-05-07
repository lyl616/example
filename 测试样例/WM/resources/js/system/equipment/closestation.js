$(function () {
    getList();
});

function getList() {
    tab = $('#tab').DataTable({
        "ajax": {
            url: $.coreApiPath + "/station/close-station",
            type: 'POST'
        },
        "lengthMenu": [200],
        "autoWidth": true,
        "responsive": true,
        "processing": true,
        "serverSide": false,
        "lengthChange": false, //开关，是否显示每页大小的下拉框
        "searching": false, //开关，是否启用客户端过滤器
        "info": true, //开关，是否显示表格的一些信息
        "paging": false, //开关，是否显示分页器
        "ordering": true, //开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url": $.ctx + "/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom": '<l<"#topPlugin">f>rt<ip>',
        "columns": [
            {"title": "微站编号", "data": "myStationId", "className": "text-center"},
            {"title": "相邻编号", "data": "compStationId", "className": "text-center"},
            {"title": "距离（米）", "data": "distance", "className": "text-center"}
        ]
    });
}
