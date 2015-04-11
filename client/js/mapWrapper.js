var Weather = Weather || {};

Weather.mapWrapper = (function () {

    var initialMapCenter = [10, 50],
        mapReady = false;

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
                'esri/config',
                'dojo/_base/Color',
                'dojo/dom',
                'dojo/domReady!'
            ], function(
                Map, Geocoder, SimpleMarkerSymbol, Graphic, esriConfig, Color, dom
            ) {
                esriConfig.defaults.map.panDuration = 1;
                esriConfig.defaults.map.panRate = 1;

                that.map = new Map('map-canvas', {
                    basemap: 'terrain',
                    center: initialMapCenter,
                    zoom: 5
                });
                that.map.on('load', function() {
                    //that.map.hideZoomSlider();

                    mapReady = true;

                    /*var geocoder = new Geocoder({
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

                    document.getElementById('search-container_input').focus();*/


                });
            });
        },


        panByDelta: (function () {
            var previousCenter = initialMapCenter.slice(), // Cloning the array
                panning = false,
                velocityScale = 0.005;

            return function(velocity) {
                if (panning || !mapReady) { // Already panning, ignore this call.
                    return;
                }

                var that = this;
                require(['esri/geometry/Point', 'esri/geometry/webMercatorUtils'], function (Point, webMercatorUtils){
                    var zoom = that.map.getLevel();

                    //console.log(velocity);
                    var newCenter = new Point(
                        previousCenter[0] + velocityScale * velocity[0],
                        previousCenter[1] + velocityScale * velocity[1]
                    );

                    panning = true;
                    that.map.centerAt(newCenter).then(function () {
                        panning = false;
                        previousCenter[0] = newCenter.x;
                        previousCenter[1] = newCenter.y;
                    })
                });
            }
        })(),

        changeZoom: (function () {
            var zooming = false;

            return function (zoomChange) {
                if (zooming || !mapReady) {
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
