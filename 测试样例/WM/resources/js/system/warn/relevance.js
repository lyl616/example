
$(function(){
	getDictionaryByType("s_concentrationType",9,-1,true);
	initPrrovince("s_province",-1,true);
	initCityByProId("s_city",-1,-1,true);
	$("#s_province").change(function(){
		initCityByProId("s_city",$(this).val(),-1,true);
	});
	getList();
	$("#addForm").validate();
});

function showAddModal(){
	getDictionaryByType("concentrationType",9,-1,false);
	initPrrovince("province",-1,true);
	initCityByProId("city",-1,-1,true);
	$("#province").change(function(){
		initCityByProId("city",$(this).val(),-1,true);
	});
	$("#addModal").modal("show");
		$(".modal-title").text("关联告警    / 添加")
}

/**
 * 获取组管理分页列表
 */
function getList(){
	tab = $('#tab').DataTable({
        "ajax": {
        	 url:$.coreApiPath+"/relevance/query/list",
        	 type: 'get',
        	 data : function (d) {
        		d.provinceId = $("#s_province").val();
        		d.cityId = $("#s_cityId").val();
        		d.concentrationTypeId =$("#s_concentrationType").val();
		     }
        },
        select: {
            "style"   : 'os',
            "selector": 'td:first-child',
            "style": 'multi'
        },
        "lengthMenu" : [ 10, 20, 40, 50 ],
		"autoWidth":true,
		"responsive" :true,
		"processing": true,	
		"scrollX": true,
        "serverSide": true,
        "stateSave": false,
        "lengthChange": true, //开关，是否显示每页大小的下拉框
		"searching": false, //开关，是否启用客户端过滤器
		"info": true, //开关，是否显示表格的一些信息
		"paging": true, //开关，是否显示分页器
		"ordering": false, //开关，是否启用各列具有按列排序的功能
        "pagingType": "full_numbers",
        "language": {
            "url" : $.ctx+"/resources/plugins/DataTables/config/Chinese.json"
        },
        "dom" : '<l<"#topPlugin">f>rt<ip>',
        initComplete : initComplete,
        "columns" : [
                     {"title":'<input type="checkbox" class="t_selt text-center" />',
                    	"data":"id","orderable": false,"className":"select-checkbox text-center",
                    	"render": function(){
                    		return ''
                    	}
                     },
                     { "title":"名称","data":"name","className":"text-center"},
                     { "title":"浓度类型","data":"concentrationType.name","className":"text-center"},
                     //{ "title":"出现次数","data":"occurrence","className":"text-center"},
                     { 
                     	"title":"使用位置","data":"locationType","className":"text-center",
                     	"render" : function(data, type, full, meta) {
                     		switch (data){
                     			case 1:
                     				return "告警";
                     			break;
                     			case 2:
                     				return "预警";
                     			break;
                     		}
                    	}
                     },
                     { "title":"均值倍数","data":"threshold","className":"text-center"},
                     { "title":"浓度阈值","data":"warnType","className":"text-center"},
               		 { "title":"发送通知类型","data":"messageType","className":"text-center",
                     	"render" : function(data, type, full, meta) {
                     		switch (data){
                     			case 1:
                     				return "发送通知";
                     			break;
                     			case 0:
                     				return "不发送通知";
                     			break;
                     		}
                    	}
                     },
                     { "title":"发送消息内容","data":"messageContent","className":"text-center"},
                     { "title":"省","data":"province.province","className":"text-center"},
                     { "title":"市","data":"city.city","className":"text-center"},
                     { "title":"修改时间","data":"modifyDt","className":"center"},
                     { "title":"操作","data":"id","className":"text-center",
                    	"render" : function(data, type, full, meta) {
                    		var up="";
                    		var isShowUpdateBtn=$("#updateBtn").val();
                    		if(isShowUpdateBtn==1){
                    		 up = '<button class="btn btn-success btn-outline btn-xs" onclick=update("'+data+'")>修改</button>';
                    		}
                    		return up;
                    	}
         			 }
                   ]
	});
}

function initComplete(){
	cusInitComplete();
	var html = $("#topPlugin").html();
	$("#topPlugin").remove();
	$("#topPlugin").html(html);
}


/**
 * 添加
 */
function add(){
	$.ajax({
        type: "POST",
        url:$.coreApiPath+"/relevance/save",
        data:$('#addForm').serialize(),
        beforeSend : function(){
        	return $("#addForm").valid();
        },
        error: function(request) {
        },
        success: function(data) {
        	$("#addModal").modal("hide");
        	layer.msg('保存成功');
        	tab.ajax.reload(null,false);
        }
    });
    
}

/**
 * 修改
 * @param id
 */
function update(id){
	
	$("#addModal").modal("show");
	$(".modal-title").text("关联告警    / 修改")
	$.ajax({
        type: "get",
        url:$.coreApiPath+"/relevance/query/id/"+id,
        error: function(request) {
        },
        success: function(data) {
        	$("#addForm").setForm(data);
        	getDictionaryByType("concentrationType",9,data.concentrationTypeId,false);
        	initPrrovince("province",data.provinceId,true);
        	initCityByProId("city",data.provinceId,data.cityId,true);
        	$("#province").change(function(){
				initCityByProId("city",$(this).val(),-1,true);
			});
        }
    });
  	 
}


/**
 * 删除
 */
function del(){
	var rows = tab.rows( { selected: true } );
	var count = rows.count();
	if(count<=0){
		layer.msg('请选择后删除');
		return;
	}
	layer.msg('你确定要删除吗？', {
	  time: 0, //不自动关闭
	  btn: ['确定删除', '取消'],
	  yes: function(index){
		  var ids = new Array();
			var index = 0;
			rows.every( function(){
				ids[index]=this.data().id;
				index++;
			});
			$.ajax({
				type : "post",
				async : false,
				dataType : "json",
				url : $.coreApiPath+"/spine/del",
				data : {ids:ids},
				success : function(data) {
					layer.msg('删除成功');
					tab.ajax.reload(null,false);
				}
			});
	  }
	});
}
