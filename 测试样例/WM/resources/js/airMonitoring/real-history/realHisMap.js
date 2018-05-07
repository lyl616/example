/**
 * c预留方法   圈选功能
 */
function initDrawingManager() {
    var _self = airMonitoringVM;
    if (_self.map == null) {
        _self.initAirMap();
    }
    _self.toggleBtnActive('mapOperat', _self.mapControl);
    var options = {
        renderOptions: {
            map: _self.map,
            selectFirstResult: false
        },
        onSearchComplete: function (results) {
        }
    };
    localSearch = new BMap.LocalSearch(_self.map, options);
    localSearch.disableAutoViewport();
    localSearch = new BMap.LocalSearch(_self.map, options);
    localSearch.disableAutoViewport();
    _self.drawingManager = new BMapLib.DrawingManager(_self.map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: false, // 是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_LEFT, // 位置
            offset: new BMap.Size(570, 5), // 偏离值
            scale: 0.8, // 工具栏缩放比例
            drawingModes: [BMAP_DRAWING_RECTANGLE]
        }
    });
    _self.drawingManager.addEventListener('rectanglecomplete', function (e, d_overlay) {
        d_overlay.hide();
        _self.drawingManager.close();
        _self.toggleBtnActive('mapOperat', _self.mapControl);
        _self.clearSearch();
        var stationIds = [];
        var overlays = _self.map.getOverlays();
        for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            if (d_overlay.containPoint(overlay.point)) {

            }
        }
        var myKeys = ["餐馆", "加油站", "电厂", "钢厂", "汽车站"];
        localSearch.searchInBounds(myKeys, d_overlay.getBounds());
    });
    _self.openDrawingManager();

}