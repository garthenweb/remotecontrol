(function() {
	'use strict';
	var api = (function() {
		var socket;
		return {
			send: function (unit, state) {
				socket.emit('device:mutate', {
					unit,
					state: Boolean(state),
				});
			},

			on: function() {
				return socket.on.apply(socket, arguments);
			},

			connect: function() {
				var socketUrl = location.origin;
				socket = io.connect(socketUrl, {
			    'reconnection delay': 100,
			    'reconnection limit': 100,
					'max reconnection attempts': Infinity
				});

				// catch errors
				socket.on('error', function() {
					alert('error' + JSON.stringify(arguments[0]));
				});

				// catch errors
				socket.on('reconnect_failed', function() {
					alert('reconnect_failed' + JSON.stringify(arguments[0]));
				});

				return this;
			},

			isConnected: function() {
				return socket.connected;
			}
		};
	})();

	api.connect();
	document.addEventListener('visibilitychange', function _handleVisibilityChange() {
		if(document.hidden || api.isConnected()) {
			return;
		}
		api.connect();
	});

  const DEFAULT_CHANNEL = [1, 1, 1, 1, 1];
	api.on('device:sync', function(state) {
		var deviceIds = Object.keys(state).map(unit => JSON.parse(unit));
		deviceIds.forEach(function(unit) {
      const el = [
        ...document.querySelectorAll('[data-device="' + unit.code + '"]'),
      ].find(e => (
        JSON.stringify(unit.channel) === (
          e.dataset.channel ||
          JSON.stringify(DEFAULT_CHANNEL)
        )
      ));

      if (!el) {
        return;
      }

			if(!state[JSON.stringify(unit)]) {
				el.value = 1;
				el.classList.remove('is-active');
			} else {
				el.value = 0;
				el.classList.add('is-active');
			}
		});
	});

	document.addEventListener('click', function(ev) {
		var el = ev.target;
		if(!el.matches('[data-device]')) {
			return;
		}

		if(typeof window.navigator.vibrate === 'function') {
			window.navigator.vibrate(25);
		}
    const device = JSON.parse(el.getAttribute('data-device'));
    const devices = Array.isArray(device) ? device : [device];
    const channel = JSON.parse(el.getAttribute('data-channel')) || DEFAULT_CHANNEL;

    const unit = devices.map(code => ({ code, channel }));

		api.send(unit, JSON.parse(el.value));
	});

  [...document.querySelectorAll('button')].forEach((el) => {
    el.addEventListener('touchstart', (ev) => {
      ev.target.classList.add('is-touch-active');
    });
  });

  document.addEventListener('touchend', () => {
    [...document.querySelectorAll('button')].forEach(el => {
      el.classList.remove('is-touch-active')
    });
  });
})();
