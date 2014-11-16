var express = require('express');
var http    = require('http');
var swig    = require('swig');
var exec    = require('child_process').exec;

var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var elro_wiringpi = function(options, cb) {
	console.log(__dirname + '/elro_wiringpi.py');
	exec('sudo ' + __dirname + '/elro_wiringpi.py ' + options.join(' '), cb);
};

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

var isProd = app.get('env') === 'production';

app.set('view cache', isProd);
swig.setDefaults({ cache: isProd });

if(isProd) {
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
}

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.render('index', {
		isProd: app.get('env') === 'production'
	});
});

var _state = {};
var _toString = Object.prototype.toString;
io.sockets.on('connection', function(socket) {
	socket.emit('update', _state);
	socket.on('toggleState', function _toggleState(data) {

		if(_toString.call(data.unitCode) === '[object Array]') {
			var timeout = 0;
			var stateIsArray = _toString.call(data.state) === '[object Array]';
			data.unitCode.forEach(function(unitCode, key) {

				setTimeout(_toggleState, timeout, {
					unitCode: unitCode,
					state: stateIsArray ? data.state[key] : data.state
				});
				timeout += 500;

			});
			return;

		} else {

			var unitCode = Math.pow(2, data.unitCode);
			var state    = parseInt(data.state, 10);

			elro_wiringpi([unitCode, state], function() {
				_state[data.unitCode] = data.state;
				io.sockets.emit('update', _state);
			});

		}

	});
});

var port = process.env.PORT || 3001;
server.listen(port);
console.log('Express server listening on port %d in %s mode', port, app.get('env'));
