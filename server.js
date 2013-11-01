var express = require('express');
var http    = require('http');
var engines = require('consolidate');
var swig    = require('swig');
var exec    = require('child_process').exec;

var app     = express();
var server  = http.createServer(app);
var io      = require('socket.io').listen(server);
var elro_wiringpi = function(options) {
	console.log(__dirname + '/elro_wiringpi.py');
	exec('sudo ' + __dirname + '/elro_wiringpi.py ' + options.join(' '));
};

// configure template engine
swig.init({
	root: __dirname + '/views',
	cache: false
});

app.engine('html', engines.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.configure('production', function() {

	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	io.set('log level', 1);
	io.set('transports', [
		'websocket',
		'flashsocket',
		'htmlfile',
		'xhr-polling',
		'jsonp-polling'
	]);

});
// io.set('transports', ['websocket']);

app.get('/', function(req, res) {

	res.render('index');

});

io.sockets.on('connection', function(socket) {
	socket.on('toggleState', function _toggleState(data) {

		console.log(data.unitCode, Object.prototype.toString.call(data.unitCode))

		if(Object.prototype.toString.call(data.unitCode) === '[object Array]') {
			var timeout = 0;
			data.unitCode.forEach(function(unitCode) {

				setTimeout(_toggleState, timeout, {
					unitCode: unitCode,
					state: data.state
				});
				timeout += 500;

			});
			return;

		} else {

			var unitCode = Math.pow(2, data.unitCode);
			var state    = parseInt(data.state, 10);

			elro_wiringpi([unitCode, state]);

		}

	});
});

server.listen(process.env.PORT || 3001);
console.log("Express server listening on port %d in %s mode", server.address().port, app.get('env'));