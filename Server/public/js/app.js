/*************************************
//
// accelerometer-server app
//
**************************************/

// connect to our socket server
var socket = io.connect('http://127.0.0.1:1337/');

var app = app || {};

    var emitted = {
    	x : 0,
    	y : 0,
    	z : 0
    };    
    var emittedPrevious = {
    	x : 0,
    	y : 0,
    	z : 0
    };

$(function(){
	//SOCKET STUFF


	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	var container = document.body.appendChild( renderer.domElement );

	THREEx.WindowResize(renderer, camera);
	
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	document.body.appendChild( stats.domElement );



    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x303030
      }),
      geometry = new THREE.Geometry(),
      floor = 0,
      step = 25;

    for (var i = 40; i >= 0; i-=1) {

      geometry.vertices.push(new THREE.Vector3(-500, floor, i * step - 500));
      geometry.vertices.push(new THREE.Vector3(500, floor, i * step - 500));

      geometry.vertices.push(new THREE.Vector3(i * step - 500, floor, -500));
      geometry.vertices.push(new THREE.Vector3(i * step - 500, floor, 500));

    }

    var line = new THREE.Line(geometry, lineMaterial, THREE.LinePieces);
    scene.add(line);

	var cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 50, 300 ), new THREE.MeshNormalMaterial() );

	scene.add( cube );

    camera.position.set(100, 200, 300);
    camera.lookAt(scene.position);

	//http://developer.nokia.com/community/wiki/How_to_get_pitch_and_roll_from_accelerometer_data_on_Windows_Phone
	socket.on("Accelerize", function(data){
		if(typeof(data.acceleration) !== 'undefined'){
	        var alpha = 0.9;
	        var fXg = 0;
	        var fYg = 0;
	        var fZg = 0;
            //Low Pass Filter
            fXg = data.acceleration.x.toFixed(2) * alpha + (fXg * (1.0 - alpha));
            fYg = data.acceleration.y.toFixed(2) * alpha + (fYg * (1.0 - alpha));
            fZg = data.acceleration.z.toFixed(2) * alpha + (fZg * (1.0 - alpha));
            //Roll & Pitch Equations
            var pitch = (Math.atan2(-fYg, fZg) * 180.0) / Math.PI;
            var roll = (Math.atan2(fXg, Math.sqrt(fYg * fYg + fZg * fZg)) * 180.0) / Math.PI;
            pitch = (pitch >= 0) ? (180 - pitch) : (-pitch - 180);
        	//Degree to Radians
        	pitch = (pitch * Math.PI) / 180;
        	roll = (roll * Math.PI) / 180;
        	window.emitted.x = pitch.toFixed(2);
        	window.emitted.z = -roll.toFixed(2);
        	//window.emitted.y = get compass data
			console.log(window.emitted);
		}
	});

	function render() {
		requestAnimationFrame(render);
	
		cube.rotation.x = window.emitted.x;
		cube.rotation.z = window.emitted.z;
		//cube.rotation.z = window.emitted.z;
	
		renderer.render(scene, camera);
		stats.update();
	}
	render();


});