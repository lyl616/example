/* 
 * Leaflet Panel Layers v0.9.5 - 2016-12-08 
 * 
 * Copyright 2016 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demos: 
 * http://labs.easyblog.it/maps/leaflet-panel-layers/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-panel-layers.git 
 * 
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
})(function (L) {
    function getnumber(value) { //获取数字
        var num = value.replace(/[^0-9]/ig, "");
        return num;
    }

    function getletter(value) { //获取字母
        var letter = value.replace(/[^a-z]+/ig, "");
        return letter;
    }

    function change_sel_pollution(value) {
        //相关站点的操作
        $('#select_down').show();
        $('.select_down-base div').removeClass('active');
        var nlue = value.toLowerCase();
        if (nlue == 'pm2.5') {
            nlue = 'pm25';
        }
        $('.select_down-base div' + '#' + nlue).addClass('active');
        var num_pollution = getnumber(value),
            str_pollution = getletter(value);
        if (num_pollution == 25) {
            num_pollution = 2.5;
        }
        var html = str_pollution.toUpperCase() + "<sub>" + num_pollution + "</sub>  ";
        $('#pollution_val').html(html);
        var imgurl = '../resources/img/wm-legend-' + value + '.png';
        console.log(imgurl);
        $('#img_polltype').prop('src', imgurl);
        $('#select_down').hide();
    }

    L.Control.PanelLayers = L.Control.Layers.extend({

        includes: L.Mixin.Events,
        //
        //Events:
        //	Event				Data passed		Description
        //
        //	panel:selected		{layerDef}		fired when an item of panel is added
        //	panel:unselected	{layerDef}		fired when an item of panel is removed
        //
        //Methods:
        //	Method 			Data passed		Description
        //
        //	addBaseLayer	{panel item}	add new layer item defition to panel as baselayers
        //	addOverlay		{panel item}	add new layer item defition to panel as overlay
        //	removeLayer	    {panel item}	remove layer item from panel
        //
        //Static Methods:
        //	Method 					Data passed		Description
        //
        //	configToControlLayers	{layerDef}		convert config from Control.PanelLayers to Control.Layers
        //

        options: {
            compact: false,
            collapsed: false,
            autoZIndex: true,
            collapsibleGroups: false,
            buildItem: null, //function that return row item html node(or html string)
            title: '', //title of panel
            //button: false, //TODO supporto button mode
            className: '', //additional class name for panel
            position: 'bottomleft'
        },

        initialize: function (baseLayers, options) {
            L.setOptions(this, options);
            this._layers = {};
            this._groups = {};
            this._items = {};
            this._layersActives = [];
            this._lastZIndex = 0;
            this._handlingClick = false;
            this.className = 'select_down';
            var i, n, isCollapsed;
            for (i in baseLayers) {
                if (baseLayers[i].group && baseLayers[i].layers) {
                    isCollapsed = baseLayers[i].collapsed || false;
                    for (n in baseLayers[i].layers)
                        this._addLayer(baseLayers[i].layers[n], false, baseLayers[i].group, isCollapsed);
                } else
                    this._addLayer(baseLayers[i], false);
            }
        },

        onAdd: function (map) {
            var self = this;
            for (var i in this._layersActives) {
                map.addLayer(this._layersActives[i]);
            }

            L.Control.Layers.prototype.onAdd.call(this, map);

            this._map.on('resize', function (e) {
                //this._form.style.maxHeight = (e.newSize.y-30)+'px';
                //self._updateHeight(e.newSize.y); 设置高度
            });

            return this._container;
        },

        //TODO addBaseLayerGroup
        //TODO addOverlayGroup

        addBaseLayer: function (layer, name, group) {
            layer.name = name || layer.name || '';
            this._addLayer(layer, false, group);
            this._update();
            return this;
        },

        addOverlay: function (layer, name, group) {
            layer.name = name || layer.name || '';
            this._addLayer(layer, true, group);
            this._update();
            return this;
        },

        removeLayer: function (layerDef) {
            var layer = layerDef.hasOwnProperty('layer') ? this._layerFromDef(layerDef) : layerDef;
            this._map.removeLayer(layer);
            L.Control.Layers.prototype.removeLayer.call(this, layer);
            return this;
        },

        clearLayers: function () {
            for (var id in this._layers) {
                this.removeLayer(this._layers[id]);
            }
        },

        _layerFromDef: function (layerDef) {
            for (var id in this._layers) {

                //TODO add more conditions to comaparing definitions
                if (this._layers[id].name === layerDef.name)
                    return this._layers[id].layer;
            }
        },

        _update: function () {
            this._groups = {};
            this._items = {};
            L.Control.Layers.prototype._update.call(this);
        },

        _addLayer: function (layerDef, overlay, group, isCollapsed) {

            if (!layerDef.layer)
                throw new Error('layer not defined in item: ' + (layerDef.name || ''));

            if (!(layerDef.layer instanceof L.Class) &&
                (layerDef.layer.type && layerDef.layer.args)) {
                layerDef.layer = this._getPath(L, layerDef.layer.type).apply(L, layerDef.layer.args);
            }

            if (!layerDef.hasOwnProperty('id'))
                layerDef.id = L.stamp(layerDef.layer);

            if (layerDef.active)
                this._layersActives.push(layerDef.layer);

            this._layers[layerDef.id] = L.Util.extend(layerDef, {
                collapsed: isCollapsed,
                overlay: overlay,
                group: group
            });

            if (this.options.autoZIndex && layerDef.layer && layerDef.layer.setZIndex) {
                this._lastZIndex++;
                layerDef.layer.setZIndex(this._lastZIndex);
            }

        },

        _createItem: function (obj) {
            var self = this;
            var item, input, checked;
            item = L.DomUtil.create('div', this.className + '-selector');

            var selVle = obj.name,
                num_pollution = getnumber(selVle),
                str_pollution = getletter(selVle);
            if (num_pollution == 25) {
                num_pollution = 2.5;
            }
            var html = str_pollution.toUpperCase() + "<sub>" + num_pollution + "</sub>  ";

            item.innerHTML = html;
            item.setAttribute('id', obj.id);
            L.DomEvent.on(item, 'click', function (e) {
                self._onInputClick(obj.id, item);
            }, this);
            this._items[obj.name] = item;
            return item;
        },

        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
        _createRadioElement: function (name, checked) {

            var radioHtml = '<input type="radio" class="' + this.className + '-selector" name="' + name + '"';
            if (checked) {
                radioHtml += ' checked="checked"';
            }
            radioHtml += ' />';

            var radioFragment = document.createElement('div');
            radioFragment.innerHTML = radioHtml;

            return radioFragment.firstChild;
        },

        _addItem: function (obj) {
            var self = this,
                label, input, icon, checked;
            var list = obj.overlay ? this._overlaysList : this._baseLayersList;
            if (obj.group) {
                if (!obj.group.hasOwnProperty('name'))
                    obj.group = {
                        name: obj.group
                    };

                if (!this._groups[obj.group.name]) {
                    var collapsed = false;
                    if (obj.collapsed === true)
                        collapsed = true;
                    this._groups[obj.group.name] = this._createGroup(obj.group, collapsed);
                }

                list.appendChild(this._groups[obj.group.name]);
                list = this._groups[obj.group.name];
            }

            label = this._createItem(obj);

            list.appendChild(label);

            return label;
        },

        _createGroup: function (groupdata, isCollapsed) {

            var self = this,
                groupdiv = L.DomUtil.create('div', this.className + '-group'),
                grouplabel, grouptit, groupexp;

            if (this.options.collapsibleGroups) {

                L.DomUtil.addClass(groupdiv, 'collapsible');

                groupexp = L.DomUtil.create('i', this.className + '-icon', groupdiv);
                if (isCollapsed === true)
                    groupexp.innerHTML = ' + ';
                else
                    groupexp.innerHTML = ' - ';

                L.DomEvent.on(groupexp, 'click', function () {
                    if (L.DomUtil.hasClass(groupdiv, 'expanded')) {
                        L.DomUtil.removeClass(groupdiv, 'expanded');
                        groupexp.innerHTML = ' + ';
                    } else {
                        L.DomUtil.addClass(groupdiv, 'expanded');
                        groupexp.innerHTML = ' - ';
                    }
                    //self._updateHeight();
                });

                if (isCollapsed === false)
                    L.DomUtil.addClass(groupdiv, 'expanded');
            }

            grouplabel = L.DomUtil.create('label', this.className + '-grouplabel', groupdiv);
            grouptit = L.DomUtil.create('span', this.className + '-title', grouplabel);
            grouptit.innerHTML = groupdata.name;

            return groupdiv;
        },

        _onInputClick: function (id, item) {
            console.log("获得的对象id   " + id);
            change_sel_pollution(id);

            var i, input, obj,
                inputs = this._form.getElementsByClassName(this.className + '-selector'),
                inputsLen = inputs.length;

            this._handlingClick = true;
            for (var j = 0; j < inputsLen; j++) { //移除所有的地图上的点
                var nobj = this._layers[inputs[j].id];
                this._map.removeLayer(nobj.layer);
            }

            for (i = 0; i < inputsLen; i++) {
                input = inputs[i];
                obj = this._layers[id];
                if (!this._map.hasLayer(obj.layer)) {
                    this._map.addLayer(obj.layer);
                } else if (this._map.hasLayer(obj.layer)) {
                    this._map.removeLayer(obj.layer);
                }
            }
            this._handlingClick = false;
            this._refocusOnMap();
        },

        _initLayout: function () {
            this._form = this._container = L.DomUtil.create('div', this.className);
            this._container.setAttribute('id', 'select_down');
            L.DomEvent.disableClickPropagation(this._form); //阻止事件冒泡
            this._baseLayersList = L.DomUtil.create('div', this.className + '-base', this._form);
            this._separator = L.DomUtil.create('div', this.className + '-separator', this._form);
            this._overlaysList = L.DomUtil.create('div', this.className + '-overlays', this._form);

            //leftBottom_menu.appendChild(this._container);
        },

        _updateHeight: function (h) {
            h = h || this._map.getSize().y;
            if (this.options.compact)
                this._form.style.maxHeight = (h - 30) + 'px';
            else
                this._form.style.height = (h - 30) + 'px';
        },

        _expand: function () {
            L.DomUtil.addClass(this._container, 'expanded');
        },

        _collapse: function () {
            this._container.className = this._container.className.replace('expanded', '');
        },

        _getPath: function (obj, prop) {
            var parts = prop.split('.'),
                last = parts.pop(),
                len = parts.length,
                cur = parts[0],
                i = 1;
            if (len > 0)
                while ((obj = obj[cur]) && i < len)
                    cur = parts[i++];

            if (obj)
                return obj[last];
        }
    });

    L.control.panelLayers = function (baseLayers, overlays, options) {
        return new L.Control.PanelLayers(baseLayers, overlays, options);
    };

    return L.Control.PanelLayers;

});