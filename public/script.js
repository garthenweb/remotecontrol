(function() {
	'use strict';
	var api = (function() {
		var socket;
		return {
			send: function (device, state) {
				socket.emit('toggleState', {
					unitCode: JSON.parse(device),
					state: JSON.parse(state)
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

	api.on('update', function(state) {
		var keys = Object.keys(state);
		keys.forEach(function(key) {
			var el = document.querySelector('[data-device="' + key + '"]');
			if(parseInt(state[key], 10) === 0) {
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
		api.send(el.getAttribute('data-device'), el.value);
	});
})();
