var E_SERVER_ERROR = 'Error communicating with the server'

Vue.component('custom-actions', {
    template: [
        '<div>',
        '<button class="ui red button" @click="onClick(\'view-item\', rowData)"><i class="zoom icon"></i></button>',
        '<button class="ui blue button" @click="onClick(\'edit-item\', rowData)"><i class="edit icon"></i></button>',
        '<button class="ui green button" @click="onClick(\'devar e-item\', rowData)"><i class="devar e icon"></i></button>',
        '</div>'
    ].join(''),
    props: {
        rowData: {
            type: Object,
            required: true
        }
    },
    methods: {
        onClick: function (action, data) {
            console.log('actions: on-click', data.name)
            sweetAlert(action, data.name)
        },
    }
})

Vue.component('my-detail-row', {
    template: [
        '<div @click="onClick">',
        '<div class="inline field">',
        '<label>Name: </label>',
        '<span>{{rowData.name}}</span>',
        '</div>',
        '<div class="inline field">',
        '<label>Email: </label>',
        '<span>{{rowData.email}}</span>',
        '</div>',
        '<div class="inline field">',
        '<label>Nickname: </label>',
        '<span>{{rowData.nickname}}</span>',
        '</div>',
        '<div class="inline field">',
        '<label>Birthdate: </label>',
        '<span>{{rowData.birthdate}}</span>',
        '</div>',
        '<div class="inline field">',
        '<label>Gender: </label>',
        '<span>{{rowData.gender}}</span>',
        '</div>',
        '</div>'
    ].join(''),
    props: {
        rowData: {
            type: Object,
            required: true
        }
    },
    methods: {
        onClick: function (event) {
            console.log('my-detail-row: on-click', event.target)
        }
    },
})

Vue.component('settings-modal', {
    template: '<div class="ui small modal" id="settingsModal">' +
    '      <div class="header">Settings</div>' +
    '<div class="content ui form">' +
    '     <div class="field">' +
    '   <div class="ui checkbox">' +
    '       <input type="checkbox" v-model="$parent.multiSort">' +
    '   <label>Multisort (use Alt+Click)</label>' +
    ' </div>' +
    '        </div>' +
    '<div class="inline fields">' +
    '  <div class="field">' +
    '   <div class="ui checkbox">' +
    '     <input type="checkbox" checked="$parent.tableHeight" @change="setTableHeight($event)">' +
    '     <label>Table Height</label>' +
    '    </div>' +
    ' </div>' +
    ' <div class="field">' +
    '   <input type="text" v-model="$parent.tableHeight">' +
    ' </div>' +
    '</div>' +
    '<div class="ui divider"></div>' +
    '<div class="field">' +
    ' <label>Pagination:</label>' +
    ' <select class="ui simple dropdown" v-model="$parent.paginationComponent">' +
    '   <option value="vuetable-pagination">vuetable-pagination</option>' +
    '   <option value="vuetable-pagination-dropdown">vuetable-pagination-dropdown</option>' +
    ' </select>' +
    '</div>' +
    '<div class="field">' +
    ' <label>Per Page:</label>' +
    ' <select class="ui simple dropdown" v-model="$parent.perPage">' +
    '   <option :value="10">10</option>' +
    '   <option :value="15">15</option>' +
    '   <option :value="20">20</option>' +
    '   <option :value="25">25</option>' +
    ' </select>' +
    '</div>' +
    '<div class="ui fluid card">' +
    '  <div class="content">' +
    '    <div class="header">Visible fields</div>' +
    ' </div>' +
    ' <div v-if="vuetableFields" class="content">' +
    '   <div v-for="(field, idx) in vuetableFields" class="field">' +
    '     <div class="ui checkbox">' +
    '       <input type="checkbox" :checked="field.visible" @change="toggleField(idx, $event)">' +
    '       <label>{{ getFieldTitle(field) }}</label>' +
    '     </div>' +
    '   </div>' +
    ' </div>' +
    '</div>' +
    '</div>' +
    '<div class="actions">' +
    '<div class="ui cancel button">Close</div>' +
    '</div>' +
    '</div>',
    props: ['vuetableFields'],
    data: function () {
        return {}
    },
    methods: {
        getFieldTitle: function (field) {
            if (typeof(field.title) === 'function') return field.title(true)

            var title = field.title
            if (title !== '') return this.stripHTML(title)

            title = ''
            if (field.name.slice(0, 2) === '__') {
                title = field.name.indexOf(':') >= 0
                    ? field.name.split(':')[1]
                    : field.name.replace('__', '')
            }

            return title
        },
        stripHTML: function (str) {
            return str ? str.replace(/(<([^>]+)>)/ig, "") : ''
        },
        toggleField: function (index, event) {
            console.log('toggleField: ', index, event.target.checked)
            this.$parent.$refs.vuetable.toggleField(index)
        },
        setTableHeight: function (event) {
            if (event.target.checked) {
                this.$parent.tableHeight = '600px'
                return
            }

            this.$parent.tableHeight = null
        }
    }
})

var lang = {
    'nickname': 'Nickname',
    'birthdate': 'Birthdate',
}

var tableColumns =
    [
        {
            name: '__handle',
            width: '50px'
        },
        {
            name: '__sequence',
            title: 'No.',
            titleClass: 'right aligned',
            dataClass: 'right aligned',
            width: '50px'
        },
        {
            name: '__checkbox',
            width: '30px',
            title: 'checkbox',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
        },
        {
            name: 'id',
            title: '<i class="unordered list icon"></i> Detail',
            dataClass: 'center aligned',
            width: '100px',
            callback: 'showDetailRow'

        },
        {
            name: 'name',
            title: '<i class="book icon"></i> Full Name',
            sortField: 'name',
            width: '150px'
        },
        {
            name: 'email',
            title: '<i class="mail outline icon"></i> Email',
            sortField: 'email',
            width: '200px',
            dataClass: "vuetable-clip-text",
            visible: true
        }, {

        name: 'nickname',
        title: "nickname",
        sortField: 'nickname',
        callback: 'allCap',
        width: '120px'
    },
        {
            name: 'birthdate',
            title: "birthdate"
        },
        {
            name: 'gender',
            title: 'Gender',
            sortField: 'gender',
            titleClass: 'center aligned',
            dataClass: 'center aligned',
            callback: 'gender',
            width: '100px',
        },
        {
            name: '__component:custom-actions',
            title: 'Actions',
            titleClass: 'center aligned',
            dataClass: 'center aligned',
            width: '150px'
        }
    ]


Vue.use(Vuetable);
Vue.config.productionTip = false;
/* eslint-disable no-new */
var vm = new Vue({
    el: '#app',
    components: {
        // Vuetable: Vuetable ,
        // VuetablePagination: VuetablePagination ,
        // VuetablePaginationDropdown: VuetablePaginationDropdown ,
        // VuetablePaginationInfo:  VuetablePaginationInfo,
    },
    data: {
        loading: '',
        searchFor: '',
        moreParams: {},
        fields: tableColumns,
        tableHeight: '600px',
        selectedTo: [],
        vuetableFields: false,
        sortOrder: [{
            field: 'name',
            direction: 'asc',
        }],
        multiSort: true,
        paginationComponent: 'vuetable-pagination',
        perPage: 10,
        paginationInfoTemplate: '显示: {from} to {to} ，共 {total} item(s)'
    },
    watch: {
        'perPage': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        },
        'paginationComponent': function (val, oldVal) {
            this.$nextTick(function () {
                this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination)
            })
        }, 'selectedTo': function (val, oldVal) {
            alert(val);
        }
    },
    methods: {
        transform: function (data) {
            var transformed = {}
            transformed.pagination = {
                total: data.total,
                per_page: data.per_page,
                current_page: data.current_page,
                last_page: data.last_page,
                next_page_url: data.next_page_url,
                prev_page_url: data.prev_page_url,
                from: data.from,
                to: data.to
            }

            transformed.data = []
            data = data.data
            for (var i = 0; i < data.length; i++) {
                transformed['data'].push({
                    id: data[i].id,
                    name: data[i].name,
                    nickname: data[i].nickname,
                    email: data[i].email,
                    age: data[i].age,
                    birthdate: data[i].birthdate,
                    gender: data[i].gender,
                    address: data[i].address.line1 + ' ' + data[i].address.line2 + ' ' + data[i].address.zipcode
                })
            }

            return transformed
        },
        showSettingsModal: function () {
            var self = this
            $('#settingsModal').modal({
                detachable: true,
                onVisible: function () {
                    $('.ui.checkbox').checkbox()
                }
            }).modal('show')
        },
        showLoader: function () {
            this.loading = 'loading'
        },
        hideLoader: function () {
            this.loading = ''
        },
        allCap: function (value) {
            return value.toUpperCase()
        },
        formatDate: function (value, fmt) {
            if (value === null) return ''
            fmt = (typeof(fmt) === 'undefined') ? 'D MMM YYYY' : fmt
            return moment(value, 'YYYY-MM-DD').format(fmt)
        },
        gender: function (value) {
            return value === 'M'
                ? '<span class="ui teal label"><i class="male icon"></i>Male</span>'
                : '<span class="ui pink label"><i class="female icon"></i>Female</span>'
        },
        showDetailRow: function (value) {
            var icon = this.$refs.vuetable.isVisibleDetailRow(value) ? 'down' : 'right'
            return [
                '<a class="show-detail-row">',
                '<i class="chevron circle ' + icon + ' icon"></i>',
                '</a>'
            ].join('')
        },
        setFilter: function () {
            this.moreParams = {
                'filter': this.searchFor
            }
            this.$nextTick(function () {
                this.$refs.vuetable.refresh()
            })
        },
        resetFilter: function () {
            this.searchFor = ''
            this.setFilter()
        },
        preg_quote: function (str) {
            return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
        },
        highlight: function (needle, haystack) {
            return haystack.replace(
                new RegExp('(' + this.preg_quote(needle) + ')', 'ig'),
                '<span class="highlight">$1</span>'
            )
        },
        rowClassCB: function (data, index) {
            return (index % 2) === 0 ? 'odd' : 'even'
        },
        onCellClicked: function (data, field, event) {
            console.log('cellClicked', field.name)
            if (field.name !== '__actions') {
                this.$refs.vuetable.toggleDetailRow(data.id)
            }
        },
        onCellDoubleClicked: function (data, field, event) {
            console.log('cellDoubleClicked:', field.name)
        },
        onLoadSuccess: function (response) {
            // set pagination data to pagination-info component
            this.$refs.paginationInfo.setPaginationData(response.data)

            var data = response.data.data
            if (this.searchFor !== '') {
                for (var n in data) {
                    data[n].name = this.highlight(this.searchFor, data[n].name)
                    data[n].email = this.highlight(this.searchFor, data[n].email)
                }
            }
        },
        onLoadError: function (response) {
            if (response.status == 400) {
                sweetAlert('Something\'s Wrong!', response.data.message, 'error')
            } else {
                sweetAlert('Oops', E_SERVER_ERROR, 'error')
            }
        },
        onPaginationData: function (tablePagination) {
            this.$refs.paginationInfo.setPaginationData(tablePagination)
            this.$refs.pagination.setPaginationData(tablePagination)
        },
        onChangePage: function (page) {
            this.$refs.vuetable.changePage(page)
        },
        onInitialized: function (fields) {
            this.vuetableFields = fields
        },
        onDataReset: function () {
            console.log('onDataReset')
            this.$refs.paginationInfo.resetData()
            this.$refs.pagination.resetData()
        },
    },
})
