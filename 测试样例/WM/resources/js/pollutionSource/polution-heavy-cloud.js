/** ****************************全局变量****************************** */
var polution_interpolation_type = 'pm25';// 全局变量 污染类型
var totalHourCount;
var currentIndex;
var payInternal = 3000;
var endTime;
var startTime;
var startIndex = 1;
var defImgPath = $.ctx+"/resources/img/quan.jpg";
/** ************************************************************** */

$(function(){
	$("#cloudImgs img").click(function(){
		$("#intetpolation_imgs div").remove();
		var imgsrc = $(this).prop("src");
		if(isNull(imgsrc)){
			return;
		}
		$("#interpolation_title").html(startTime+"-"+endTime+" 小时数据");
		$("#interpolationModal").modal('show');
		putPic();
		
		/*var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
		var nScrollTop = 0;  //滚动到的当前位置
		var nDivHight = $("#intetpolation_imgs").height();
		//监听滚动事件
		$('#intetpolation_imgs').on('scroll',function(){
			nScrollHight = $(this)[0].scrollHeight;
	        nScrollTop = $(this)[0].scrollTop;
	     	if(nScrollTop + nDivHight >= nScrollHight)
	      		alert("滚动条到底部了");
	      		putPic();
	     	});
		});*/
	});
});


function putPic(){
	var pageNum = 0;
	var p = getParams();
	for(;startIndex<=totalHourCount;startIndex++){
		if(pageNum>=24){
			break;
		}
		pageNum++;
		var imgObj = showGraph(startIndex,p);
		var html = '';
		html+='<div class="col-xs-2">';
		html+='	<span class="text-center">'+imgObj.titFotTime+'</span>';
		html+='	<img class="interpolation_list" src="'+imgObj.imgurl+'" onerror="defaultImg(this)">';
		html+='</div>';
		$("#intetpolation_imgs").append(html);
	}
}

function defaultImg(obj){
	obj.src = defImgPath;
}

var timer;

function showPollutionCloud(startDate,lastTime){
	if(timer!=null && typeof(timer)!='undefined'){
		clearInterval(timer);
	}
	startTime = startDate;
	currentIndex = 0;
	endTime = lastTime;
	var time1 = Date.parse(endTime);  
    var time2 = Date.parse(startTime);
    totalHourCount = (Math.abs(time1 - time2))/1000/60/60;

    $.ajax({
        type: 'get',
        url: $.coreApiPath + "/pollution/heavy/interpolationImgPath",
        dataType: 'json',
        success: function (r) {
            if (r.result) {
                $.interpolationImgPath = r.data.interpolationImgPath;
                timer = window.setInterval("autoplay()",payInternal);
            }
        }
    });
}

function autoplay(){
   currentIndex = currentIndex + 1;
   if(currentIndex>totalHourCount){
     currentIndex=1;
   }
   $("#cloudImgs img").each(function(i,obj){
   		var params = getParams();
     	//params.interpolationType = obj.id;
     	var imgObj = showGraph(currentIndex,params);
     	obj.src = imgObj.imgurl;
   });
}

function showGraph(index,params){
  var seltime = converTimeFormat(startTime);
  seltime.setHours(seltime.getHours() + index);
  var realTime = seltime.Format('yyyyMMddhh');
  var titFotTime = seltime.Format('yyyy-MM-dd hh时');
  var imgurl = $.interpolationImgPath+params.city+"/"+params.stationtype+"/"+polution_interpolation_type+"/"+params.interpolationType+"/"+params.dateType+"/"+realTime+".png";
  return {imgurl:imgurl,currentTime:realTime,titFotTime:titFotTime};
}

function converTimeFormat(time)
{
    if(time!=null)
    {
        time = time.replace("-","/");
        time = time.replace("-","/");
        return new Date(time);   
    }
    return null;            
}

function getParams(){
	return {
		city:parent.cityId,
		stationtype:'wz',
		interpolationType:'Neareast_RBF',
		dateType:"hour"
	};
}

