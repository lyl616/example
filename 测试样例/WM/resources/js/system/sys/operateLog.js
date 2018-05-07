var E_SERVER_ERROR = 'Error communicating with the server'
$("#pageName").html("操作日志");
var tableColumns = [
	{
		name: '__sequence',
		title: '序号',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '50px'
	},
	{
		name: 'pageName',
		title: '页面',
		titleClass: 'text-center',
		dataClass: 'text-center',
		sortField: 'page_name',
		width: '100px'
	},
	{
		name: 'operationName',
		title: '操作',
		titleClass: 'text-center',
		dataClass: 'text-center',
		width: '100px'
	},
	{
		name: 'userName',
		title: '操作人',
		titleClass: 'text-center',
		dataClass: 'text-center',
		sortField: 'user_name',
		width: '80px'
	},
	{
		name: 'operatingTime',
		title: '操作时间',
		titleClass: 'text-center',
		dataClass: 'text-center',
		sortField: 'operating_time',
		width: '100px',
        callback: 'formatDate|yyyy-MM-dd HH:mm'
	}, {
		name: 'operatingDetail',
		title: "详细内容",
		titleClass: 'text-center',
		dataClass: "text-center text-overflow",
		width: '350px'
	}
]

Vue.use(Vuetable);
Vue.config.productionTip = false;
/* eslint-disable no-new */
var vm = new Vue({
	el: '#app',	
	data: {
		loading: '',
		searchFor: '',
		loadOnStart: false,
		startTime: null,
		endTime: null,
		operatingPage: '',
		operation: '',
		userName: '',
		operatingDetail: '',
        pageList: [], //页面
		operationList: [],
		moreParams: {
			'startTime': null,
			'endTime': null,
			'operatingPage': '',
			'operation': '',
			'userName': '',
			'operatingDetail': ''
		},
		fields: tableColumns,
		tableHeight: 'auto',
		selectedTo: [],
		vuetableFields: false,
		sortOrder: [{
			field: 'operating_time',
			direction: 'desc',
		}],
		multiSort: true,
		paginationComponent: 'vuetable-pagination',
		perPage: 10
	},
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
		'operatingPage': function(val, oldVal){
			this.$nextTick(function() {
				this.loadOperationByPage();
			})
		}
	},
	methods: {
		transform: function(data) {
			var transformed = {}
			transformed.pagination = {
					/*
				total: data.total,
				per_page: data.per_page,
				current_page: data.current_page,
				last_page: data.last_page,
				next_page_url: data.next_page_url,
				prev_page_url: data.prev_page_url,
				from: data.from,
				to: data.to//*/
				total: data.pagination.total,
                per_page: data.pagination.per_page,
                current_page: data.pagination.current_page,
                last_page: data.pagination.last_page,
                next_page_url: data.pagination.next_page_url,
                prev_page_url: data.pagination.prev_page_url,
                from: data.pagination.from,
                to: data.pagination.to
			}
			transformed.data = []
			data = data.data
			for(var i = 0; i < data.length; i++) {
				transformed['data'].push({
					id: data[i].id,
					pageName: data[i].pageName,
					operationName: data[i].operationName,
					userName: data[i].userName,
					operatingTime: data[i].operatingTime,
					operatingDetail: data[i].operatingDetail
				})
			}
			return transformed
		},
        showLoader: function () {
            initLayerLoader();
            this.loading = 'loading';
        },
        hideLoader: function () {
            this.loading = '';
            closeLayreLoader();
        },
		formatDate: function(value, fmt) {
			if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'yyyy-MM-dd HH:mm:ss' : fmt
            return new Date(value).Format(fmt)
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
		rowClassCB: function(data, index) {
			return(index % 2) === 0 ? 'odd' : 'even'
		},
		onCellClicked: function(data, field, event) {
			console.log('cellClicked', field.name)
			if(field.name !== '__actions') {
				this.$refs.vuetable.toggleDetailRow(data.id)
			}
		},
		onCellDoubleClicked: function(data, field, event) {
			console.log('cellDoubleClicked:', field.name)
		},
		onLoadSuccess: function(response) {
			// set pagination data to pagination-info component
			this.$refs.paginationInfo.setPaginationData(response.data)
		},
		onLoadError: function(response) {
			if(response.status == 400) {
				sweetAlert('Something\'s Wrong!', response.data.message, 'error')
			} else {
				sweetAlert('Oops', E_SERVER_ERROR, 'error')
			}
		},
		onPaginationData: function(tablePagination) {
			this.$refs.paginationInfo.setPaginationData(tablePagination)
			this.$refs.pagination.setPaginationData(tablePagination)
		},
		onChangePage: function(page) {
			this.$refs.vuetable.changePage(page)
		},
		onInitialized: function(fields) {
			this.vuetableFields = fields
		},
		onDataReset: function() {
			console.log('onDataReset')
			this.$refs.paginationInfo.resetData()
			this.$refs.pagination.resetData()
		},
        onCellMouseEnter: function (data, field, event) {
            if (field.name == "operatingDetail") {
                if (data[field.name] != "" && data[field.name] != null
                    && event.srcElement.clientWidth < event.srcElement.scrollWidth) {
                    var val = data[field.name];
                    layer.tips(val, event.srcElement, {
                        tips: 1,
                        time: 0
                    });
                }
            }
        },
        onCellMouseLeave: function (data, field, event) {
            layer.closeAll('tips'); //关闭所有的tips层
        },
		operationLogSearch: function () {//日志查询
            var _self = this;
            var startTime = _self.startTime;
            var endTime = _self.endTime;
            if(startTime)
            	startTime = startTime.replace('年', '-').replace('月','-').replace('日','');
            if(endTime)
            	endTime = endTime.replace('年', '-').replace('月','-').replace('日','');
            var dateDiff = (new Date(endTime).getTime()- new Date(startTime).getTime()) / 1000 / 60 / 60 / 24;
            if(dateDiff > 31){
            	layer.msg("查询时间范围不能超过一个月");
            	return ;
            }
            _self.moreParams = {
        		'startTime': startTime + ' 00:00:00',
    			'endTime': endTime + ' 00:00:00',
    			'operatingPage': _self.operatingPage,
    			'operation': _self.operation,
    			'userName': _self.userName,
    			'operatingDetail': _self.operatingDetail
            }
            _self.$nextTick(function () {
                _self.$refs.vuetable._data.selectedTo = [];
                _self.$refs.vuetable.refresh()
            });
        },
        loadOperationByPage: function(){
        	var _self = this;
        	var pageId = null;
        	$.each(this.pageList, function(i, p){
        		if(p.code == _self.operatingPage){
        			pageId = p.id;
        		}
        	});
        	_self.operationList = [];
        	_self.operation = "";
        	ajax_get(coreApiPath + "/sysOpertaionLog/getOperationsByPage", {"pageId":pageId}, function (data) {
        		if(data.erroCode == 2000){
        			$.each(data.result, function(i, e){
    					_self.operationList.push({
    						id: e.id,
    						code:e.funcCode,
    						name:e.funcName
    					});
        			});
        		}
            });
        },
        initializePageList: function(){
        	var _self = this;
        	ajax_get(coreApiPath + "/sysOpertaionLog/getOpLogPages", {}, function (data) {
        		if(data.erroCode == 2000){
        			$.each(data.result, function(i, e){
    					_self.pageList.push({
    						id: e.id,
    						code:e.funcCode,
    						name:e.funcName
    					});
        			});
        		}
            });
        },
        initialize: function(){
        	var _self = this;
        	var now = new Date();
        	var initStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
        	this.startTime = initStart.Format("yyyy年MM月dd日");
        	this.endTime = now.Format("yyyy年MM月dd日");
        	this.initializePageList();
        	this.operationLogSearch();
        }
	},
    mounted: function () {
    	this.initialize();
    }
});

function showDatePicker(id){
	var options = {
		dateFmt:'yyyy年MM月dd日',
		maxDate:'%y-%M-%d',
		isShowClear: false,
		onpicked: function () {
			if('startTime' == id){
				vm.startTime = $dp.cal.getDateStr('yyyy年MM月dd日');
			}
			else{
				vm.endTime = $dp.cal.getDateStr('yyyy年MM月dd日');
			}
        }
	};
	/*
	if('startTime' == id){
		options['maxDate'] = '#F{$dp.$D(\'endTime\')||\'%y-%M-%d\'}';
		options['minDate'] = '#F{$dp.$D(\'endTime\',{M:-1})}';
	}
	else{
		options['maxDate'] = '#F{$dp.$D(\'startTime\',{M:1})||\'%y-%M-%d\'}';
		options['minDate'] = '#F{$dp.$D(\'startTime\')}';
	}//*/
	WdatePicker.call(this, options);
}