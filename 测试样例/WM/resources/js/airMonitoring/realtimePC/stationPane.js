var cityId = parent.cityId,
	cityName = parent.cityName,
	timeVal = '';
//右侧的列表的表格
var tableRight = [{
		name: 'rank',
		title: '排名', //区县
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '50px'
	},
	{
		name: 'stationName',
		width: '25%',
		title: '站点名称', //时段
		titleClass: 'text-center',
		dataClass: 'text-center'
	},
	{
		name: 'stationId',
		title: '站点编号', //浓度
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '25%'
	},
	{
		name: 'pvalue',
		title: '数值', //浓度
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '30%',
		sortField: 'pvalue',
		callback: "dealPvalue"
	}
];
Vue.use(Vuetable);
Vue.config.productionTip = false;
var staRankVM = new Vue({
	el: '#app',
	data: {
		//数据使用
		tableClass:'vuetable table vuetable-fixed-layout',
		tableHeight: '600px',
		s_area_list: [], //站点类型列表
		s_tech_type: '0|微站', //站点种类
		s_station_type: '-1', //站点类型
		s_district: '-1', //区域选择值
		queryStationType: STATION_TYPE_WZ, //查询的站点种类的值   （ 0 微站   yc 扬尘  kh考核 all  全部）
		s_tech_type_list: [], //站点种类列表
		station_type_list: [{
			id: "-1",
			name: "全部"
		}], //站点类型列表
		//vuetabe  使用
		btnStatus: {
			"tooltipDand": { //tooltip 的单点信息展示
				isActive: false,
				noActive: true
			},
			"tooltipMultid": { //tooltip 的多点信息展示
				isActive: true,
				noActive: false
			},
			'mapbtnDanx': {
				isActive: false,
				noActive: true
			},
			'mapbtnCirclex': {
				isActive: false,
				noActive: true
			},
			'mapbtnclear': {
				isActive: true,
				noActive: false
			}
		},
		btn_toogle_statue: 1, //收缩按钮的活动状态
		perPage: 10, //收缩按钮的活动状态
		fieldRight: tableRight,
		stationId: '',
		loading: '',
		searchFor: '',
		moreParams: {},
		fields: tableColumns,
		selectedTo: [],
		vuetableFields: false,
		sortOrder: [{
			field: 'pvalue',
			direction: 'asc',
		}],
		multiSort: true,
		isShowDownList: false, //是否显示下拉搜索内容框
		searchInputText: '',
		jumpMarker_list: [],
		search_down_list: []
	},
	computed: {},
	watch: {
		'perPage': function(val, oldVal) {
			this.$nextTick(function() {
				this.$refs.vuetable.refresh()
			})
		},
		'paginationComponent': function(val, oldVal) {
			this.$nextTick(function() {
				this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
			})
		},
		's_district': function() {
			this.getStationRank();
		}
	},
	mounted: function() {
		this.initDistrictList(); //区域
		this.initStechTypeList(); //监测点类型
		this.getStationRank(); //获取右侧面板站点列表数据
	},
	methods: {
		checkStationInfo: function(ev) {
			if(ev.keyCode != 13) { //非回车键的时候执行
				var _self = this;
				if(this.stationId) {
					this.search_down_list = [];
					var params = {
						doMainId: parent.domainId,
						district: _self.s_district,
						queryStationType: _self.queryStationType, //站点类型 0 微站   yc 扬尘  kh考核 all  全部
						sTechType: _self.s_tech_type.split("|")[0], //站点种类
						stationType: _self.s_station_type, //站点类型
						stationIdOrName: _self.stationId
					};
					var dataType = 'application/json; charset=UTF-8';
					$.ajax({
						type: "POST",
						url: $.coreApiPath + '/stationNew/search/staions',
						dataType: 'JSON',
						contentType: dataType,
						data: JSON.stringify(params),
						success: function(data) {
							if(data.data && data.data.length != 0) {
								data.data.forEach(function(item, index, arr) {
									_self.search_down_list.push({
										id: item.stationId,
										text: item.stationName
									});

								});
								_self.isShowDownList = true; //重置是否展示下拉搜索框的状态 （开启）
							} else {
								console.log("获取数据失败");
								_self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
							}
						},
						error: function(err) {
							console.info(err);
						}
					});
				} else {
					_self.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
				}
			}
		},
		sitejumpMarker: function() {
			//weatherVM.
		},
		searchStation: function(text) {
			this.isShowDownList = false; //重置是否展示下拉搜索框的状态	（关闭）
			this.stationId = text;
			this.siteTableLight(this.stationId); //获取右侧面板站点列表数据
			//展示站点提示信息
			this.showStationTip(text);
		},
		siteTableLight: function(searchVal) { //设置搜索列表的表格的高亮显示 ,并将滚动条滚动到当前搜索记录
			$("#station_info_list tr").removeClass('hightlight-row');
			var rowsNode = this.$refs.vuetable.$el.childNodes[2].childNodes[0],
				fg = true;
			for(var i = 0; i < rowsNode.rows.length; i++) {
				if(searchVal == rowsNode.rows[i].cells[1].innerText || searchVal == rowsNode.rows[i].cells[2].innerText) {
					rowsNode.rows[i].className = 'hightlight-row';
					var scrollTop = rowsNode.rows[i].offsetTop;
					$("#station_info_list .vuetable-body-wrapper").scrollTop(scrollTop);
					fg = false;
				}
			}
			if(fg) {
				layer.msg("查询无结果！");
			}
		},
		resitepBtnStatus: function(fg) { //根据站点的类型，重置左上按钮的活动状态			
			if(fg) { //扬尘
				for(var i = 0; i < weatherVM.pollutionTypeList.length; i++) {
					if(weatherVM.pollutionTypeList[i].id != 'pm10') {
						weatherVM.pollutionTypeList[i].isDisable = true;
					}
				}
				weatherVM.changePollution('pm10');
			} else { //非扬尘站
				for(var i = 0; i < weatherVM.pollutionTypeList.length; i++) {
					weatherVM.pollutionTypeList[i].isDisable = false;
				}
			}
		},
		resiteStechType: function() { //切换右侧面板的 “站点类型”下拉列表值
			//debugger
			var _self = this;
			var arr = _self.s_tech_type.split('|');
			station_rpanelType = '';
			weatherVM.changeprogStatue();
			switch(arr[1]) {
				case '考核站':
					{
						_self.queryStationType = STATION_TYPE_KH;
						// weatherVM.queryParams.queryStationType = STATION_TYPE_KH;
						weatherVM.isDesablePClound = false; //开启  污染云图的可用状态
						weatherVM.rPanelSType = "kaohe"; //记录下当前的站点类型
						this.resitepBtnStatus(false);
					}
					break;
				case '微站':
					{
						_self.queryStationType = STATION_TYPE_WZ;
						// weatherVM.queryParams.queryStationType = STATION_TYPE_WZ;
						weatherVM.isDesablePClound = false; //开启    污染云图的可用状态
						weatherVM.rPanelSType = 'wz' //记录下当前的站点类型
						this.resitepBtnStatus(false);
					}
					break;
				case '扬尘站':
					{
						_self.queryStationType = STATION_TYPE_YC;
						// weatherVM.queryParams.queryStationType = STATION_TYPE_YC;
						weatherVM.isDesablePClound = true; //禁用  污染云图的可用状态
						//pollutionTypeAQI2List.
						this.resitepBtnStatus(true);
						//////////重置“污染源”按钮的活动状态
						weatherVM.pCloundBtnStatus.status.noActive = true;
						weatherVM.pCloundBtnStatus.status.isActive = false;
					}
					break;
				case '爬虫站':
					{
						_self.queryStationType = STATION_TYPE_PC;
						// weatherVM.queryParams.queryStationType = STATION_TYPE_PC;
						weatherVM.isDesablePClound = true; //禁用    污染云图的可用状态
						//////////重置“污染源”按钮的活动状态
						weatherVM.pCloundBtnStatus.status.noActive = true;
						weatherVM.pCloundBtnStatus.status.isActive = false;
						this.resitepBtnStatus(false);
					}
					break;
				case '全部':
					{
						_self.queryStationType = STATION_TYPE_ALL;
						weatherVM.isDesablePClound = false; //开启  污染云图的可用状态
						weatherVM.rPanelSType = "wz-kh"; //记录下当前的站点类型
						this.resitepBtnStatus(false);
					}
					break;
			}
			if(weatherVM.queryParams.dateType == 3){//站点为天的时候要请求一次数据
			  _self.initStationTypeList();
			}
			// queryData(weatherVM.queryParams);
		},
		initStationTypeList: function() {
			//debugger
			var _self = this;
			var sTechTypeArr = _self.s_tech_type.split("|");
			_self.station_type_list = [];
			if(sTechTypeArr[0] != -1) {
				if(sTechTypeArr[1] != '扬尘站') {
					_self.station_type_list.push({
						id: "-1",
						name: "全部"
					});
				} //不是扬尘添加全部
				_self.s_station_type = -1;
				ajax_get(coreApiPath + "/config/type", {
					type: sTechTypeArr[0]
				}, function(data) {
					if(data.erroCode = 2000) {
						$.each(data.result, function(index, val) {
							_self.station_type_list.push({
								id: val.code,
								name: val.name
							});
						});
					}
				});
			}
			_self.getStationRank();
		},
		initDistrictList: function() {
			var _self = this;
			_self.s_area_list = [];
			ajax_get(coreApiPath + "/domain/cascade/" + parent.domainId, {}, function(data) {
				if(data.erroCode = 2000 && data.result.districtList.length > 0) {
					data.result.districtList.forEach(function(item, index, arr) {
						_self.s_area_list.push({
							name: item.domainName,
							id: item.id
						});
					}, this);
				}
			});
		},
		initStechTypeList: function() {
			var _self = this;
			_self.s_tech_type_list = [];
			//站点类型
			ajax_get(coreApiPath + "/config/type", {
				type: 30
			}, function(data) {
				if(data.erroCode = 2000) {
					data.result.forEach(function(val, index, arr) {
						_self.s_tech_type_list.push({
							id: val.code,
							name: val.name
						});
					});
				}
			});
		},
		getStationRank: function() {
			//debugger
			var _self = this;
			var params = {
				doMainId: parent.domainId,
				district: _self.s_district,
				queryStationType: _self.queryStationType, //站点类型 0 微站   yc 扬尘  kh考核 all  全部
				pollutionType: weatherVM.queryParams.pollutionType,
				sTechType: _self.s_tech_type.split("|")[0], //站点种类
				stationType: _self.s_station_type, //站点类型
				dateType: weatherVM.queryParams.dateType, //2 i小时 3 天
				currentTime: weatherVM.queryParams.currentTime,
			};
			_self.$refs.vuetable.tableData = [];
			_self.moreParams = params;
			//console.log("335");			
			_self.$nextTick(function() {
				_self.$refs.vuetable.refresh();
			});
		},
		//点击收缩按钮，收缩左右两边面板
		toogleContianer: function() {
			//weatherVM.changeprogStatue();

			$('.rel-btn-toogle span').removeClass('btn-jt-left');
			$('.rel-btn-toogle span').removeClass('btn-jt-right');
			if(this.btn_toogle_statue == 0) { //右侧的菜单收起
				$("#layui-layer" + this.layer_id).css("width", "100%");
				$('.panel-left').addClass('min-map-left');
				$('.panel-right').addClass('map-zcontent-hide');
				$('.rel-btn-toogle').addClass('rel-btn-toogle-hide');
				$('.rel-btn-toogle span').addClass('btn-jt-left');
				this.btn_toogle_statue = 1;
				//console.log("收起");
			} else if(this.btn_toogle_statue == 1) { //右侧菜单弹出
				$("#layui-layer" + this.layer_id).css("width", (this.calcSCreenSize() - 240) + "px");
				$('.panel-left').removeClass('min-map-left');
				$('.panel-right').removeClass('map-zcontent-hide');
				$('.rel-btn-toogle').removeClass('rel-btn-toogle-hide');
				$('.rel-btn-toogle span').addClass('btn-jt-right');
				this.btn_toogle_statue = 0;
				//this.getStationRank();
				stopAllPlay(); //暂停所有播放面板
				//console.log("弹出");
			}
			progressSise(weatherVM.queryParams.dateType);
		},
		//重新计算页面宽度，并重置两个面板的大小
		calcSCreenSize: function() {
			var widthS = window.innerWidth;
			return widthS;
		},
		popWindwoShow: function(id) {
			$('#' + id).toggle();
		},
		transform: function(data) {
			var transformed = {};
			transformed.data = [];
			data = data.data
			for(var i = 0; i < data.length; i++) {
				transformed['data'].push({
					rank: data[i].rank,
					pvalue: data[i].pvalue,
					stationId: data[i].stationId,
					stationName: data[i].stationName,
					showTime: data[i].showTime,
					validCommentRt: data[i].validCommentRt,
					validComment: data[i].validComment
				})
			}
			return transformed
		},
		dealPvalue: function(value, item) {
			//debugger
			if(weatherVM.queryParams.pollutionType == 'aqi') {
				if(item.validComment != '') {
					return value + "*";
				}
			} else if(weatherVM.queryParams.pollutionType == 'aqi2') {
				if(item.validCommentRt != '') {
					return value + "*";
				}
			}
			return value;
		},
		showLoader: function() {
			this.loading = 'loading'
		},
		hideLoader: function() {
			this.loading = ''
		},
		setFilter: function() {
			this.moreParams = {
				'filter': this.searchFor
			}
			this.$nextTick(function() {
				this.$refs.vuetable.refresh()
			})
		},
		resetFilter: function() {
			this.searchFor = ''
			this.setFilter()
		},
		onCellClicked: function(data, field, event) {
			if(field.name !== '__actions') {
				this.$refs.vuetable.toggleDetailRow(data.id)
			}
		},
		onLoadSuccess: function(response) {		
			this.jumpMarker_list = [];
			var data = response.data.data;
			if(this.searchFor !== '') {
				for(var n in data) {
					data[n].name = this.highlight(this.searchFor, data[n].name);
					data[n].email = this.highlight(this.searchFor, data[n].email);
				}
			}
			//debugger
			for(var n in data) {
				if(n <= 9) {
					this.jumpMarker_list.push(data[n].stationId);
				}
			}
   			this.$refs.vuetable.css.tableClass=this.tableClass;
			this.tableHeight = $(window).height() - 200;
			this.$refs.vuetable.$el.childNodes[2].childNodes[0].className = 'table no-borders';

			var data = response.data.data;
			if(data == null) {
				weatherVM.clearMarkers();
			} else {
				weatherVM.addMarkers(data);
			}
			//queryData(weatherVM.queryParams);
		},
		onLoadError: function(response) {
			if(response.status == 400) {
				sweetAlert('Something\'s Wrong!', response.data.message, 'error')
			} else {
				sweetAlert('Oops', E_SERVER_ERROR, 'error')
			}

			layer.msg("加载失败！")
			closeLayreLoader();
			return false;
		},
		onChangePage: function(page) {
			this.$refs.vuetable.changePage(page)
		},
		onInitialized: function(fields) {
			this.vuetableFields = fields;
		},
		onCellMouseEnter: function(data, field, event) {
			var msg = '';
			if(field.name == "pvalue") {
				if(weatherVM.queryParams.pollutionType == 'aqi') {
					msg = data.validComment;
					//debugger					
				} else if(weatherVM.queryParams.pollutionType == 'aqi2') {
					msg = data.validCommentRt;
				}
				if(msg != '') {
					layer.tips(msg, event.srcElement, {
						tips: [4, '#000'],
						top: '210px',
						zIndex: 99999999, //重点1
						time: 0
					});
				}
			}
		},
		onCellMouseLeave: function(data, field, event) {
			if(field.name == "pvalue") {
				if(weatherVM.queryParams.pollutionType == 'aqi' || weatherVM.queryParams.pollutionType == 'aqi2') {
					layer.closeAll('tips'); //关闭所有的tips层
				}
			}
		},
		onRowClicked: function(data, field, event) {
			//debugger
			if(field.name == "stationName") {
				this.showStationTip(data.stationId);
			}
		},
		//展示站点信息
		showStationTip: function(stationId) {
			if(stationId) {
				$.ajax({
					type: "POST",
					url: $.coreApiPath + "/station/getStationPoint",
					data: {
						searchKey: stationId,
						domainId: cityId
					},
					success: function(data) {
						$.each(data, function(index, obj) {
							var type = obj.stationType == null ? "" : obj.stationType;
							var address = obj.addr == null || 'null' == obj.addr ? "" : obj.addr;
							var district = obj.district == null || 'null' == obj.district ? "" : obj.district;
							var content = type + ' ' + obj.stationName + ' [' + obj.stationId + '] ' + district + '<br>' + address;
							openStationWin(obj.lat, obj.lng, content);
						});
					},
					error: function() {}
				});
			}
		}
	}
})

$(document).ready(function(){
	window.onresize=function(){
		staRankVM.tableHeight = $(window).height() - 200;
	}
});
