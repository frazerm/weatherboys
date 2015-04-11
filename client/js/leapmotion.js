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

        var pointers = []

        var Pointer = function () {
            var pointer = this;
            var img = document.createElement('img');
            img.src = 'circle_red.png';
            img.style.position = 'absolute';
            img.onload = function () {
                pointer.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
            document.body.appendChild(img);
  }

            pointer.setTransform = function (pos) {
                img.style.left = pos[0] - img.width  / 2 + 'px';
                img.style.top  = pos[1] - img.height / 2 + 'px';
            }
        }

        pointers[0] = new Pointer();

        Leap.loop(function (frame) {
            if(frame.valid) {
                handOne = frame.hands[0]
                handTwo = frame.hands[1]

                if(handOne) {
                    var pointerOne = ( pointers[0] || (pointers[0] = new Pointer()) );

                    pointerOne.setTransform(handOne.screenPosition());
                }

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

        }).use('screenPosition', {scale: 0.5});