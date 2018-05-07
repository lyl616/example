// Copyright 2013 Peter Cook @prcweb prcweb.co.uk
var chart = {
	data: null,
	xScale: null,
	yScale: null,
	svgLine: null,
	colorScale: null,
	yAxisNum: 0, //y轴的数据个数
	perspectiveOffsetX: 2,
	perspectiveOffsetY: 3.5, //曲线的倾斜度
	chartHeight: 500,
	lineWidth: 700,
	lineHeight: 120, //35
	bodyHeight: 2000, // Scroll height
	windowHeight: 0,
	scrollScale: null,
	menu: [{
			'label': '端站',
			'sortBy': 'year'
		},
		{
			'label': '最大值',
			'sortBy': 'max'
		},
		{
			'label': '最小值',
			'sortBy': 'min'
		},
		// { 'label': '平均值', 'sortBy': 'mean' }
	],
	uiState: {
		selectedIndex: 0,
		selectedDatum: null, // Automatically updated
		sortBy: 'year',
		sorting: false
	},

	sortFunction: {},
	openingTimer: null,

	translate: function(x, y) {
		return 'translate(' + x + ',' + y + ')';
	},
	calcMax: function(data) {
		var maxVal = [],
			calcmax = 0,
			calcarrmax = 0;
		var yVal = data;
		for(var i in yVal) {
			for(var j in yVal[i]) {
				if(calcmax < yVal[i][j]) {
					calcmax = yVal[i][j];
				}
			}
			//			console.log("calemax   " + calemax);
			maxVal.push(calcmax);
		}
		//console.info(maxVal);
		for(var k in maxVal) {
			if(calcarrmax < maxVal[k]) {
				calcarrmax = maxVal[k];
			}
		}
		return calcarrmax;
	},
	init: function() {
		this.yAxisNum = this.data.xArr.length; //根据横轴的数据个数，动态设置
		var data = {};
		var dataset = _.map(this.data.yArr.meanTemp, function(data, k) {
			var yearAve = _.reduce(data, function(m, v) {
				//				if(v == null) {
				//					v = '';
				//				}
				return m + v;
			}, 0) / this.yAxisNum;
			var yearMax = _.max(data);
			var yearMin = _.min(data);
			return {
				year: +k,
				data: data,
				mean: yearAve,
				max: yearMax,
				min: yearMin
			};
		});
		var calcarrmax = this.calcMax(this.data.yArr.meanTemp),
			dataNum = 0,
			datameanTemp = this.data.yArr.meanTemp;
		for(var m in datameanTemp) {
			dataNum++;
		}
		console.log("个数   " + dataNum,'    this.lineHeight  '+this.lineHeight);
		this.bodyHeight = this.lineHeight * dataNum; //this.lineHeight * dataNum
		this.data.meanTemp = {
			data: dataset.reverse(),
			extent: [0, calcarrmax]
		}; //y轴的区间范围
		d3.select('body').style('height', this.bodyHeight + 'px');
		this.windowHeight = $(window).height();
		this.scrollScale = d3.scale.linear().domain([0, this.bodyHeight - this.windowHeight * 0.80]).range([0, 170]).clamp(true); //150 为鼠标滑动的距离像素点

		this.sortFunction.year = function(a, b) {
			return d3.descending(a.year, b.year);
		}
		this.sortFunction.mean = function(a, b) {
			return d3.descending(a.mean, b.mean);
		}
		this.sortFunction.max = function(a, b) {
			return d3.descending(a.max, b.max);
		}
		this.sortFunction.min = function(a, b) {
			return d3.ascending(a.min, b.min);
		}

		this.initChart();
		this.initEvents();
		this.initMenu();
	},

	initMenu: function() {
		var that = this;
		d3.select('#menu')
			.text('排序：')
			.selectAll('span')
			.data(this.menu)
			.enter()
			.append('span')
			.html(function(d, i) {
				var html = '<span class="button">' + d.label + '</span>';
				if(i < that.menu.length - 1) html += ' / ';
				return html;
			});

		d3.select('#menu')
			.selectAll('span.button')
			.classed('selected', function(d, i) {
				return i === 0;
			})
			.on('click', function() {
				var d = d3.select(this.parentNode).datum();

				d3.selectAll('#menu span.button')
					.classed('selected', false);

				d3.select(this)
					.classed('selected', true);
				that.updateSort(d.sortBy);
			});
	},

	updateVisibleYears: function() {
		var that = chart; // Better way to do this?
		var datanum = 0;
		var index = that.uiState.selectedIndex;
		var years = d3.selectAll('#chart .years g.year');
		years.classed('hover', false);

		years
			.filter(function(d, i) {
				return i === index;
			})
			.classed('hover', true);

		d3.selectAll('.axes')
			.attr('transform', that.translate(30 + index * that.perspectiveOffsetX, that.chartHeight + that.yScale(0) + -index * that.perspectiveOffsetY));

		years
			.style('opacity', function(d, i) {
				if(i < index) return 0;
				return that.colorScale(i);
			});
		var getGobj = years.filter(function(d, i) {
			datanum = i;
			return i === index;
		});
		if(getGobj[0][0]) {
			var datum = getGobj.datum();
			that.uiState.selectedDatum = datum;
			that.updateInfo();
		}
	},
	updateInfo: function() {
		var that = chart;
		var d = that.uiState.selectedDatum;
		var html = '<h2>端站名称：';
		html += _.has(that.data.yArr.info, d.year) ? that.data.yArr.info[d.year].text : '';
		html += '    </h2>'
		html += '<h3>端站号：' + d.year + '</h3>';
		html += '<p>最大值：' + d.max + '</p>';
		html += '<p>最小值：' + d.min + '</p>';
		d3.select('#info').html(html);
	},

	handleScroll: function() {
		var that = chart; // Better way to do this?
		if(that.uiState.sorting) return;
		var scroll = $(window).scrollTop() - 10;
		that.uiState.selectedIndex = Math.round(that.scrollScale(scroll));
		that.updateVisibleYears();
	},

	initEvents: function() {
		var that = this;
		$(window).scroll(this.handleScroll);
		$(window).on('touchmove', this.handleScroll);
	},

	initChart: function() {
		var that = this;

		this.xScale = d3.scale.linear()
			.domain([0, that.yAxisNum - 1])
			.range([0, this.lineWidth]);

		this.yScale = d3.scale.linear()
			.domain(this.data.meanTemp.extent) //this.data.meanTemp.extent
			.range([this.lineHeight, 0]); //lineHeight

		this.colorScale = d3.scale.linear()
			.domain([0, 102])
			.range([1, 0.5]);

		this.svgLine = d3.svg.line()
			.interpolate('cardinal')
			.x(function(d, i) {
				return that.xScale(i);
			})
			.y(function(d) {
				return that.yScale(d);
			});

		// YEAR LINES
		var years = d3.select('#chart svg')
			.append('g')
			.classed('years', true)
			.attr('transform', this.translate(30, this.chartHeight))
			.selectAll('g.year')
			.data(this.data.meanTemp.data)
			.enter()
			.append('g')
			.attr('class', function(d, i) {
				return 'year-' + d.year;
			})
			.classed('year', true)
			.sort(this.sortFunction[this.uiState.sortBy])
			.attr('transform', function(d, i) {
				return that.translate(i * that.perspectiveOffsetX, -i * that.perspectiveOffsetY);
			})
			.style('opacity', function(d, i) {
				return that.colorScale(i);
			});

		// Add paths
		years
			.append('path')
			.attr({
				d: function(d, i) {
					return that.svgLine(d.data);
				},
				fill: 'none',
				stroke: function(d, i) { //设置绘制的曲线的颜色
					//return '#242833';					
					var yArrinfoData = chart.data.yArr.info;
					for(var i in yArrinfoData) {
						if(d.year == i) {
							if(yArrinfoData[i].GK == "GK") {
								return '#4fa2b9';
							} else {
								return '#da5359';
							}							
						}
					}
				},
				id: function(d, i) {
					return d.year;
				},
				name: function(d, i) {
					return i;
				}
			});
		d3.select('#chart svg')
			.append('g')
			.classed('axes', true)
			.attr('transform', this.translate(30, this.chartHeight));

		this.renderAxes(this.data);
	},

	renderAxes: function(d) {
		var x_index = d.xArr;
		var monthScale = d3.scale.ordinal()
			.domain(x_index)
			.rangePoints([0, this.lineWidth]);

		var calcarrmax = this.calcMax(d.yArr.meanTemp);
		var yAxis = d3.svg.axis()
			.scale(this.yScale)
			.orient('left')
			.tickValues([0, calcarrmax]);

		d3.select('#chart .axes')
			.append('g')
			.classed('axis y', true)
			.attr('transform', this.translate(0, -this.yScale(0)))
			.call(yAxis);

		var xAxis = d3.svg.axis()
			.scale(monthScale)
			.orient('bottom');

		d3.select('#chart .axes')
			.append('g')
			.classed('axis x', true)
			.call(xAxis);
	},

	updateSort: function(sortBy) {
		var that = this;
		this.uiState.sortBy = sortBy;

		// Do the sort
		var years = d3.select('#chart .years')
			.selectAll('g.year')
			.sort(this.sortFunction[this.uiState.sortBy]);

		// Persist the chosen year: get the index of the chosen year
		var index = null;
		d3.selectAll('#chart .years g.year')
			.each(function(d, i) {
				if(d.year === that.uiState.selectedDatum.year) index = i;
			});
		if (!index) return;
		that.uiState.selectedIndex = index;

		// Transform the axes
		d3.selectAll('.axes')
			.transition()
			.duration(2000)
			//.attr('transform', that.translate(25 + index * that.perspectiveOffsetX, that.chartHeight + that.yScale(0) + -index * that.perspectiveOffsetY))
			.attr('transform', this.translate(30, this.chartHeight + this.lineHeight))
			//让两个坐标轴跟着筛选的条件变化
			.each('end', function() {
				that.uiState.sorting = false;
			});

		// Transform the year paths
		d3.selectAll('#chart .years .year')
			.transition()
			.duration(2000)
			.attr('transform', function(d, i) {
				return that.translate(i * that.perspectiveOffsetX, -i * that.perspectiveOffsetY);
			})
			.style('opacity', function(d, i) {
				if(i < index) return 1; //当按照某个点排序的时候，0 就不显示某些曲线
				return that.colorScale(i);
			});

		// Reset scroll
		this.uiState.sorting = true;
		$(window).scrollTop(0); //this.scrollScale.invert(index)
	}
}

function chartInit() {
	chart.data = d3_data;
	for(var i in chart.data.yArr.meanTemp) {
		for(var j in chart.data.yArr.meanTemp[i]) {
			if(chart.data.yArr.meanTemp[i][j] == null) {
				chart.data.yArr.meanTemp[i][j] = 0;
			}
		}
	}
	chart.init();
	chart.updateVisibleYears();
}

function resitHtml(_currID) { //获取当前的站点编号，并取出数据，写入大小、平均值
	$('#info h2').text('');
	$('#info h3').text('');
	$('#info p').remove();
	var datainfo = chart.data.yArr.info,
		years = d3.selectAll('#chart .years g.year'),
		stationName = '',
		maxVal = minVal = meanVal = 0,
		stationNum = _currID;
	for(var i in datainfo) { //获取端站名称，根据ajax 得到数据获取值
		if(_currID == i && datainfo[i].text != undefined) {
			stationName = datainfo[i].text;
		}
	}
	for(var k = 0; k < years[0].length; k++) { //根据计算获得的数据取值
		var tmpVal = years[0][k]['__data__'];
		if(years[0][k]['__data__'].year == _currID) {
			maxVal = tmpVal.max;
			minVal = tmpVal.min;
			meanVal = tmpVal.mean;
		}
	}
	$('#info h2').text('端站名称：' + stationName);
	$('#info h3').text('端站号：' + stationNum);
	$('#info').append('<p>最大值：' + maxVal + '</span>');
	$('#info').append('<p>最小值：' + minVal + '</span>');

}

// 绑定鼠标滑动事件
$('#chart svg').on('mouseenter', 'path', function(event) {
	var _currID = $(this).context.id;
	if(_currID) {
		$('#chart svg .year path').attr('stroke-width', .5);
		$(this).attr('stroke-width', 3);
		resitHtml(_currID);
	}
});

$('#chart').on('mouseleave', 'svg', function(event) {
	$('#chart svg path').attr('stroke-width', 1);
	var datainfo = chart.data.yArr.info;
	for(var i in datainfo) {
		var firstID = i;
		break;
	}
	resitHtml(firstID);
});