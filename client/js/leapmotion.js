
var spinClockwise = function () {
    console.log("spin clockwise")
}

var spinAnticlockwise = function () {
    console.log("spin anticlockwise")
}

var pan = function (x, y) {
    Weather.mapWrapper.panByDelta([x, y]);
}

var zoom = function (rate) {
    rate > 0 ? Weather.mapWrapper.zoomIn() : Weather.mapWrapper.zoomOut();

}

var output = document.getElementById('output');
var SENSITIVITY = 1;

var Z_SENSITIVITY = 200;

var grabLast = 0;

Leap.loop(function (frame) {
    if(frame.valid) {
        handOne = frame.hands[0]
        handTwo = frame.hands[1]

        if(handTwo) {
            console.log(handTwo);
            if (Math.abs(handOne.palmVelocity[2]) < Z_SENSITIVITY &&
                Math.abs(handTwo.palmVelocity[2]) < Z_SENSITIVITY) {
                //two hands, do a zoom

                dist = Math.sqrt(handOne.indexFinger.tipPosition[0]*handOne.indexFinger.tipPosition[0] +
                    handOne.indexFinger.tipPosition[1]*handOne.indexFinger.tipPosition[1])

                delta = dist - grabLast

                if(Math.abs(delta) > SENSITIVITY) {
                    zoom(delta);
                };

                grabLast = dist;
            }
        } else if(handOne && handOne.indexFinger.tipPosition[2] < 0) {
            var velocity = handOne.indexFinger.tipVelocity;

            if (Math.abs(velocity[2]) < Z_SENSITIVITY) { // Ignoring velocities with too large of a z component
                Weather.mapWrapper.panByDelta(velocity);
            }
            //console.log("One finger press");
        } else if(frame.gestures.length > 0) {
            grabLast = 0;
            frame.gestures.forEach(function(gesture) {
                if(gesture.center) {
                    //got a circlegesture

                    //TODO: make this better?
                    gesture.normal[0] < 0 ? spinClockwise() : spinAnticlockwise();
                }
            });
        } else {
            grabLast = 0;
        };
    }
});
