<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@include file="../system/include_tools.jsp"%>
<!DOCTYPE html>
<html>
<!--  /graph_echarts.html -->
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>weather</title>
    <link rel="shortcut icon" href="${ctx}/resources/img/favicon.ico">
</head>

<body class="gray-bg">
<%@ include file="../V1/topMenu.jsp" %>
<div class="Map-All">
<!-- 	<div id='f1'></div> -->
	<div style="position: absolute; height: 100%; cursor: default; left: 230px; margin-top: 5px;width: 100%;" id="ff">
     <div  style="clear: both; margin-left: 1%; height: 60px; border: 1px solid #BEBEBE; padding-top: 20px; position: relative; margin: 15px 0px; background: #FFFFFF;" id="ff">
     	<p style="border: 1px solid #BEBEBE; position: absolute; bottom: 38px; text-align: center; z-index: 1000; background: #FFFFFF;padding: 2px;padding-left: 10px;padding-right: 10px;left: 20px;" >下载数据</p>
    <form role="form" class="form-inline" style="padding-left: 20px;position: relative;bottom: 3px;">
    	<div class="form-group" >
	        	省&nbsp;&nbsp;&nbsp;名:
        	<select class="form-control" name="account" id=district1>
            </select>
	    </div>
    	<div class="form-group" >
	        	市&nbsp;&nbsp;&nbsp;名:<select class="form-control" name="account" id="district2">
            </select>
	    </div>
        <div class="form-group">
             <input type="button" class="btn  btn-primary " id="" onclick="exportData()" value="下载" />
        </div>
    </form>
		</div>
		 <div id="ff" style="background: #FFFFFF;height: 85%;">
    	
    </div>
	</div>
</div>
    <script type="text/javascript">
    //下载数据
    function exportData(){
    	var proId = $("#district1 option:selected").val();
    	var cityId = $("#district2 option:selected").val();
    	var statusType = "2";
	    location.href= $.coreApiPath+"/weather/exportExcelData.do?proId="+proId+"&cityId="+cityId+"&statusType="+statusType;
    }
    //初始化省
    function initPrrovince(){
    	var url = $.coreApiPath+"/weather/allProvince";
    	var opt = document.getElementById("district1");
    	opt.options.length = 0;
    	$.getJSON(url).success(function(data) {
    		for (var i = 0; i < data.length; i++) {
    			opt.options.add(new Option(data[i].province, data[i].id));
    		}
    		initCityByProId( $("#district1 option:selected").val());
    	});
    }
    
    //初始化城市
    function initCityByProId(pro_id){
    	var url = $.coreApiPath+"/weather/getAllByProvinceId";
    	var param = {
    			"proId":pro_id
    	};
    	var opt = document.getElementById("district2");
    	opt.options.length = 0;
    	$.getJSON(url,param).success(function(data) {
//     		opt.options.add(new Option("全部", "-1"));
    		for (var i = 0; i < data.length; i++) {
    			opt.options.add(new Option(data[i].city, data[i].id));
    		}
    	});
    }
    
    $(function(){
    	initPrrovince();
    	$('#district1').change(function() {
    		initCityByProId($("#district1 option:selected").val());
    	})
    })
    
    </script>
</body>
</html>
