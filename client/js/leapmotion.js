// var toType = function(obj) {
//     return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
// }

// var SENSITIVITY = 10

// var touchLast = []

// Leap.loop(function (frame) {
//     if(frame.valid) {
//         handOne = frame.hands[0]
//         handTwo = frame.hands[1]

//         if(handTwo) {
//             //two hands, do a zoom
//             touchLast = [];
//             indexPosOne = handOne.indexFinger.tipPosition;
//             indexPosTwo = handTwo.indexFinger.tipPosition;

//             console.log("Two fingers");
//         } else if(handOne && handOne.indexFinger.tipPosition[2] < 0) {
//             indexPos = handOne.indexFinger.tipPosition;
//             //check for pan
//             if(touchLast.length > 0) {
//                 delta = [indexPos[0] - touchLast[0], indexPos[1] - touchLast[1]];
//                 if(Math.abs(delta[0]) < SENSITIVITY) {
//                     delta[0] = 0;
//                 }
//                 if(Math.abs(delta[1]) < SENSITIVITY) {
//                     delta[1] = 0;
//                 }
//                 if(delta[0] || delta[1]) {
//                     Weather.mapWrapper.panByDelta(delta);
//                     //pan(delta[0], delta[1])
//                 }
//             };
//             touchLast = [indexPos[0], indexPos[1]];
//             console.log("One finger press");
//         } else if(frame.gestures.length > 0) {
//             touchLast = [];
//             frame.gestures.forEach(function(gesture) {
//                 if(gesture.center) {
//                     //got a circlegesture

//                     var normal = gesture.normal;
//                     normal[0] < 0 ? Weather.mapWrapper.zoomIn() : Weather.mapWrapper.zoomOut();
//                 }
//             });
//         } else {
//             touchLast = [];
//         };
//     }

// });
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
        var SENSITIVITY = 1

        var touchLast = []
        var grabLast = 0

        Leap.loop(function (frame) {
            if(frame.valid) {
                handOne = frame.hands[0]
                handTwo = frame.hands[1]
            
                if(handTwo) {
                    //two hands, do a zoom
                    touchLast = [];
                    dist = Math.sqrt(handOne.indexFinger.tipPosition[0]*handOne.indexFinger.tipPosition[0] +
                        handOne.indexFinger.tipPosition[1]*handOne.indexFinger.tipPosition[1])

                    delta = dist - grabLast

                    if(Math.abs(delta) > SENSITIVITY) {
                        zoom(delta);
                    };

                    grabLast = dist;

                } else if(handOne && handOne.indexFinger.tipPosition[2] < 0) {
                    grabLast = []
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
                            pan(delta[0], delta[1])
                        }
                    };
                    touchLast = indexPos;

                } else if(frame.gestures.length > 0) {
                    touchLast = [];
                    grabLast = 0;
                    frame.gestures.forEach(function(gesture) {
                        if(gesture.center) {
                            //got a circlegesture

                            //TODO: make this better?
                            gesture.normal[0] < 0 ? spinClockwise() : spinAnticlockwise();
                        }
                    });
                } else {
                    touchLast = [];
                    grabLast = 0;
                };
            }

        });