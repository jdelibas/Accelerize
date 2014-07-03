// connect to our socket server
var socket = io.connect('http://127.0.0.1:1337/');

var app = app || {};

    var emitted = {
    	x : 0,
    	y : 50,
    	z : 0
    };

$(function(){
	//SOCKET STUFF


	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

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

	var geometry = new THREE.CubeGeometry(100,100,100);
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

    camera.position.set(100, 200, 300);
    camera.lookAt(scene.position);




	socket.on("Accelerize", function(data){
		if(typeof(data.acceleration) !== 'undefined'){
			window.emitted.x = data.acceleration.x * 10;
			window.emitted.y = data.acceleration.y * 10;
			window.emitted.z = data.acceleration.z * 10;
		}
	});

	function render() {
		requestAnimationFrame(render);
		
		cube.position.x = window.emitted.x;
		cube.position.y = window.emitted.y;
		cube.position.z = window.emitted.z;

		renderer.render(scene, camera);
	}
	render();


});