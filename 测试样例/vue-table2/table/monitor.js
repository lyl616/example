

var  E_SERVER_ERROR = 'Error communicating with the server'


var tableColumns = [
    {
        name: '__checkbox:id',
        width: '30px',
        title: 'checkbox'
    },
    {
        name: '__sequence',
        title: '序号',
        titleClass: 'right aligned',
        dataClass: 'right aligned',
        width: '50px'
    },
    {
        name: 'stationId',
        title: '监测点编号',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'stationName',
        title: '监测点名称',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'projectId',
        title: '所属项目',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'equipmentId',
        title: '监测点管理（新）',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'proName',
        title: '省市区',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'sTechType',
        title: '监测点种类',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'stationType',
        title: '监测点类型',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'status',
        title: '监测点状态',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    }, {
        name: 'lngReal',
        title: '经度',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    },
    {
        name: 'latReal',
        title: '纬度',
        titleClass: 'right aligned',
        dataClass: 'right aligned'
    }
]





Vue.use(Vuetable);
/* eslint-disable no-new */
var  vm = new Vue({
    el: '#app',
    data: {
        loading: '',
        searchFor: '',
        moreParams: {},
        fields: tableColumns,
        tableHeight: '300',//设置表格可滚动的区域高度
        sortOrder: [{
            field: 'name',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        noDataTemplate: '没有相关的数据',
        perPage: 10,
        pageList: [10, 20, 30, 40, 50],
        paginationInfoTemplate: '显示: {from} to {to} ，共 {total} 条',
    },
    watch: {
        'perPage':function (val, oldVal) {
            this.$nextTick(function() {
                this.$refs.vuetable.refresh()
            })
        },
        'paginationComponent':function (val, oldVal) {
            this.$nextTick(function() {
                this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
            })
        }
    },
    methods: {
        transform: function (response) {
            var pagination = response ;
            var transformed = {}
            transformed.pagination = {
                total: pagination.total,
                per_page: pagination.per_page,
                current_page: pagination.current_page,
                last_page: pagination.current_page,
                next_page_url: pagination.next_page_url,
                prev_page_url: pagination.prev_page_url,
                from: pagination.from,
                to: pagination.to
            }


            transformed.data = []
            var data = response.data
            for (var i = 0; i < data.length; i++) {
                transformed['data'].push({
                    id: data[i].id,
                    stationId: data[i].stationId,
                    stationName: data[i].stationName,
                    projectId: data[i].projectId,
                    pro: data[i].pro,
                    city: data[i].city,
                    district: data[i].district,
                    proName: data[i].proName + "/" + data[i].cityName + "/" + data[i].districtName,
                    sTechType: data[i].sTechType,
                    stationType: data[i].stationType,
                    status: data[i].status,
                    latReal: data[i].latReal,
                    lngReal: data[i].lngReal
                })
            }

            return transformed
        },
        showLoader :function() {
            this.loading = 'loading'
        },
        hideLoader :function() {
            this.loading = ''
        },
        allCap :function(value) {
            return value.toUpperCase()
        },

        onLoadSuccess :function(response) {
            // set pagination data to pagination-info component
            this.$refs.paginationInfo.setPaginationData(response.data)
            console.log(response.data)


        },
        onLoadError :function(response) {
            if (response.status == 400) {
                sweetAlert('Something\'s Wrong!', response.data.message, 'error')
            } else {
                sweetAlert('Oops', E_SERVER_ERROR, 'error')
            }
        },
        onPaginationData :function(tablePagination) {
            console.log(tablePagination)

            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage (page) {
            this.$refs.vuetable.changePage(page)
        },
    },
})
