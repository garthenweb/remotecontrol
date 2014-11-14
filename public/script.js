// (function() {

// 	'use strict';

// 	var _switchTimer;

// 	var _buttonDown = false;
// 	document.addEventListener('touchstart', function(ev) {
// 		ev.preventDefault();
// // 
// 		ev.target.classList.add('touch-active');

// 		if(ev.target.nodeName === 'BUTTON') {
// 			_buttonDown = true;
// 			_switchTimer = setTimeout(function() {
// 				ev.target.parentNode.classList.add('switch');
// 				window.navigator.vibrate(50);
// 				removeTouchActive();
// 			}, 1000);
// 		} else {
// 			removeSwitch();
// 		}

// 	}, false);

// 	document.addEventListener('touchend', function(ev) {
// 		ev.target.classList.add('touch-end');
// 		setTimeout(removeTouchActive, 100);
// 		setTimeout(removeTouchEnd, 300);
// 		clearTimeout(_switchTimer);

// 		_buttonDown = false;
// 		if(ev.target.nodeName === 'BUTTON') {
// 			api.send(ev.target.getAttribute('data-device'), ev.target.value);
// 			ev.target.classList.add('touch-active');
// 		}

// 	});

// 	var api = (function() {

// 		var socketUrl = location.origin; // location.protocol + '//' + location.host
// 		var socket    = io.connect(socketUrl);

// 		socket.on('update', function(state) {
// 			var keys = Object.keys(state);
// 			keys.forEach(function(key) {
// 				var value = state[key];
// 				var activeSelector = '[data-device="' + key + '"][value="' + value + '"]';
// 				var inactiveSelector = '[data-device="' + key + '"]:not([value="' + value + '"])';
// 				var active = document.querySelector(activeSelector);
// 				var inactive = document.querySelector(inactiveSelector);
// 				active.classList.add('is-active');
// 				inactive.classList.add('is-inactive');
// 				active.classList.remove('is-inactive');
// 				inactive.classList.remove('is-active');
// 			});

// 		});

// 		return {
// 			send: function (device, state) {

// 				socket.emit('toggleState', {
// 					unitCode: JSON.parse(device),
// 					state: state
// 				});
// 			},

// 			on: function() {
// 				return socket.on.apply(this, arguments);
// 			}

// 		};

// 	})();

// 	var removeTouchActive = function() {
// 		var el = document.querySelector('.touch-active');
// 		if(el) { el.classList.remove('touch-active'); }
// 	};

// 	var removeTouchEnd = function() {
// 		var el = document.querySelector('.touch-end');
// 		if(el) { el.classList.remove('touch-end'); }
// 	};

// 	var removeSwitch = function() {
// 		[].splice.call(document.querySelectorAll('.switch'), 0).forEach(function(el) {
// 			el.classList.remove('switch');
// 		});
// 	};

// })();


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
				socket = io.connect(socketUrl);
			}

		};

	})();

	api.connect();
	api.on('update', function(state) {
		console.log(state);
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

		window.navigator.vibrate(25);
		api.send(el.getAttribute('data-device'), el.value);

	});



})();