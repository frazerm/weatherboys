var Weather = Weather || {};

Weather.mapWrapper = (function () {

    var initialMapCenter = [10, 50];

    var MapWrapper = function (mapCanvasId) {
        this.mapCanvasId = mapCanvasId;
        this.initialize();
    };

    MapWrapper.prototype = {
        mapCanvasId: null,

        map: undefined,

        initialize: function () {
            var that = this;
            require([
                'esri/map',
                'esri/dijit/Geocoder',
                'esri/symbols/SimpleMarkerSymbol',
                'esri/graphic',
                'dojo/_base/Color',
                'dojo/dom',
                'dojo/domReady!'
            ], function(
                Map, Geocoder, SimpleMarkerSymbol, Graphic, Color, dom
            ) {
                that.map = new Map('map-canvas', {
                    basemap: 'dark-gray',
                    center: initialMapCenter,
                    zoom: 5
                });
                that.map.on('load', function() {
                    map.hideZoomSlider();
                });

                var geocoder = new Geocoder({
                    autoComplete: true,
                    map: that.map,
                }, dom.byId('search-container'));
                geocoder.startup();
                geocoder.on('select', function (event) {
                    that.map.graphics.clear();

                    var point = event.result.feature.geometry,
                        symbol = new SimpleMarkerSymbol()
                            .setStyle('square')
                            .setColor(new Color([255,0,0,0.5])),
                        graphic = new Graphic(point, symbol);

                    that.map.graphics.add(graphic);
                    that.map.infoWindow.setTitle('Search Result');
                    that.map.infoWindow.setContent(event.result.name);
                    that.map.infoWindow.show(event.result.feature.geometry);
                });

                document.getElementById('search-container_input').focus();
            });
        },


        panByDelta: (function () {
            var previousCenter = {
                    x: initialMapCenter[0],
                    y: initialMapCenter[1]
                },
                panning = false;

            return function(delta) {
                if (panning) { // Already panning, ignore this call.
                    return;
                }

                var that = this;
                require(['esri/geometry/ScreenPoint', 'esri/geometry/webMercatorUtils'], function (ScreenPoint, webMercatorUtils){
                    var zoom = that.map.getLevel(),
                        center = webMercatorUtils.webMercatorToGeographic(that.map.extent.getCenter());

                    console.log('should pan', delta, center);

                    var newCenter = {
                        x: center.x + 0.2 * delta[0],
                        y: center.y + 0.2 * delta[1]
                    };

                    panning = true;
                    that.map.centerAt(delta).then(function () {
                        panning = false;
                    })
                });
            }
        })(),

        changeZoom: (function () {
            var zooming = false;

            return function (zoomChange) {
                if (zooming) {
                    return;
                }
                zooming = true;

                this.map.setLevel(this.map.getLevel() + zoomChange).then(function () {
                    zooming = false;
                });
            }
        })(),

        zoomIn: function () {
            console.log('zooming in');
            this.changeZoom(1);
        },

        zoomOut: function () {
            console.log('zooming out');
            this.changeZoom(-1);
        }
    };

    return new MapWrapper('map-canvas');
})();
