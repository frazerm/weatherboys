var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

var SENSITIVITY = 10

var touchLast = []

Leap.loop(function (frame) {
    if(frame.valid) {
        handOne = frame.hands[0]
        handTwo = frame.hands[1]

        if(handTwo) {
            //two hands, do a zoom
            touchLast = [];
            indexPosOne = handOne.indexFinger.tipPosition;
            indexPosTwo = handTwo.indexFinger.tipPosition;

            console.log("Two fingers");
        } else if(handOne && handOne.indexFinger.tipPosition[2] < 0) {
            indexPos = handOne.indexFinger.tipPosition;
            //check for pan
            if(touchLast.length > 0) {
                delta = [indexPos[0] - touchLast[0], indexPos[1] - touchLast[1]];
                if(Math.abs(delta[0]) < SENSITIVITY) {
                    delta[0] = 0;
                }
                if(Math.abs(delta[1]) < SENSITIVITY) {
                    delta[1] = 0;
                }
                if(delta[0] || delta[1]) {
                    Weather.mapWrapper.panByDelta(delta);
                    //pan(delta[0], delta[1])
                }
            };
            touchLast = [indexPos[0], indexPos[1]];
            console.log("One finger press");
        } else if(frame.gestures.length > 0) {
            touchLast = [];
            frame.gestures.forEach(function(gesture) {
                if(gesture.center) {
                    //got a circlegesture

                    var normal = gesture.normal;
                    normal[0] < 0 ? Weather.mapWrapper.zoomIn() : Weather.mapWrapper.zoomOut();
                }
            });
        } else {
            touchLast = [];
        };
    }

});
