const express = require('express');
const exec = require('child_process').exec;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const elroWiringpi = (options, cb) => {
  exec(`sudo ${__dirname}/elro_wiringpi.py ${options.join(' ')}`, cb);
};

const isProd = app.get('env') === 'production';

if (isProd) {
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

app.use(express.static(`${__dirname}/public`));
// app.get('/', (req, res) => {
//   res.render('index');
// });

const _state = {};
const _toString = Object.prototype.toString;
io.sockets.on('connection', (socket) => {
  socket.emit('update', _state);
  socket.on('toggleState', function _toggleState(data) {
    if (_toString.call(data.unitCode) === '[object Array]') {
      let timeout = 0;
      const stateIsArray = _toString.call(data.state) === '[object Array]';
      data.unitCode.forEach((unitCode, key) => {
        setTimeout(_toggleState, timeout, {
          unitCode,
          state: stateIsArray ? data.state[key] : data.state,
        });
        timeout += 500;
      });
      return;
    }
    const unitCode = Math.pow(2, data.unitCode);
    const state = parseInt(data.state, 10);

    elroWiringpi([unitCode, state], () => {
      _state[data.unitCode] = data.state;
      io.sockets.emit('update', _state);
    });
  });
});

const port = process.env.PORT || 3001;
server.listen(port);
console.log('Express server listening on port %d in %s mode', port, app.get('env'));
