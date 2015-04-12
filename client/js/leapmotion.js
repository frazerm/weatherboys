var spinClockwise = function () {
    console.log("spin clockwise")
}

var spinAnticlockwise = function () {
    console.log("spin anticlockwise")
}

var pan = function (velocity) {
    Weather.mapWrapper.panByDelta([-velocity[0], -velocity[1]]);
}

var zoom = function (rate) {
    rate > 0 ? Weather.mapWrapper.zoomIn() : Weather.mapWrapper.zoomOut();

}

var output = document.getElementById('output');
var SENSITIVITY = 1;
var pointers = [];

var Z_SENSITIVITY = 200;

var grabLast = 0;

var Pointer = function () {
	var pointer = this;
    var img = document.createElement('img');
    img.src = 'circle_red.png';
    img.style.position = 'absolute';
    img.left = 200;
    img.top = 200;
    img.onload = function () {
    	pointer.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
    	document.body.appendChild(img);
  	}

    pointer.getPos = function () {
        return [img.left, img.top]
    }

    pointer.setTransform = function (pos) {
    	img.style.left = pos[0] - img.width  / 2 + 'px';
    	img.style.top  = pos[1] - img.height / 2 + 'px';
    }
}

Leap.loop(function (frame) {
    if(frame.valid) {
        handOne = frame.hands[0]
        handTwo = frame.hands[1]

        if(handOne) {
        	var pointerOne = ( pointers[0] || (pointers[0] = new Pointer()) );
			pointerOne.setTransform(handOne.screenPosition());
        }


        if(handTwo) {
            if (Math.abs(handOne.palmVelocity[2]) < Z_SENSITIVITY &&
                Math.abs(handTwo.palmVelocity[2]) < Z_SENSITIVITY) {
                //two hands, do a zoom

                var velX = handOne.palmVelocity[0] - handTwo.palmVelocity[0];
                var velY = handOne.palmVelocity[1] - handTwo.palmVelocity[1];
                var vel = velX + velY;
                if(Math.abs(vel) > (SENSITIVITY*100)) {
                    zoom(-vel);
                }

                // dist = Math.sqrt(handOne.indexFinger.tipPosition[0]*handOne.indexFinger.tipPosition[0] +
                //     handOne.indexFinger.tipPosition[1]*handOne.indexFinger.tipPosition[1])

                // delta = dist - grabLast

                // if(Math.abs(delta) > SENSITIVITY) {
                //     zoom(delta);
                // };

                //grabLast = dist;
            }
        } else if(handOne && handOne.indexFinger.tipPosition[2] < 0) {
            var velocity = handOne.indexFinger.tipVelocity;

            if (Math.abs(velocity[2]) < Z_SENSITIVITY) { // Ignoring velocities with too large of a z component
                pan(velocity);
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
}).use('screenPosition', {scale: 0.75});;
