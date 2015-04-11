var map;
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
    var mapCenter = [10, 50];


    map = new Map('map-canvas', {
        basemap: 'dark-gray',
        center: mapCenter,
        zoom: 5
    });
    map.on('load', function() {
        map.hideZoomSlider();
    });

    var geocoder = new Geocoder({
        autoComplete: true,
        map: map,
    }, dom.byId('search-container'));
    geocoder.startup();
    geocoder.on('select', function (event) {
        map.graphics.clear();

        var point = event.result.feature.geometry,
            symbol = new SimpleMarkerSymbol()
                .setStyle('square')
                .setColor(new Color([255,0,0,0.5])),
            graphic = new Graphic(point, symbol);

        map.graphics.add(graphic);
        map.infoWindow.setTitle('Search Result');
        map.infoWindow.setContent(event.result.name);
        map.infoWindow.show(event.result.feature.geometry);
    });

    document.getElementById('search-container_input').focus();

    var mapPanHandler = (function () {
        var previousCenter = {
                x: mapCenter[0],
                y: mapCenter[1]
            };

        return function(delta) {
            dojo.stopEvent(event);

            map.centerAt(previousCenter = {
                x: previousCenter.x + delta[0],
                y: previousCenter.y + delta[1]
            });
        }
    })());
});
