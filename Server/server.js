/*************************************
//
// accelerometer-server app
//
**************************************/

// express magic
var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

var runningPortNumber = 1337;


app.configure(function(){
	// I need to access everything in '/public' directly
	app.use(express.static(__dirname + '/public'));

	//set the view engine
	app.set('view engine', 'ejs');
	app.set('views', __dirname +'/views');

});


// logs every request
/*
app.use(function(req, res, next){
	// output every request in the array
	//console.log({method:req.method, url: req.url, device: req.device});

	// goes onto the next function in line
	next();
});
*/
app.get("/", function(req, res){
	res.render('index', {});
});

//io.set('log level', 1);

io.sockets.on('connection', function (socket) {

	io.sockets.emit('Accelerize', {msg: 'connection'});

	socket.on('Accelerize', function(data, fn){
		if(typeof(data.acceleration) !== 'undefined'){
			io.sockets.emit('Accelerize', {acceleration : data.acceleration});
		} else {
			io.sockets.emit('Accelerize', {msg : data.msg});
		}


		fn();//call the client back to clear out the field
	});

});


server.listen(runningPortNumber);