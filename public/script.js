(function() {

	'use strict';

	document.addEventListener('click', function(ev) {

		if(ev.target.nodeName === 'BUTTON') {
			sendRequest(ev.target.getAttribute('data-device'), ev.target.value);
			ev.target.classList.add('touch-active');
		}

	}, false);

	document.addEventListener('touchstart', function(ev) {

		if(ev.target.nodeName === 'BUTTON') {
			ev.target.classList.add('touch-active');
		}

	}, false);

	document.addEventListener('touchend', function(ev) {
		setTimeout(function() {
			var el = document.querySelector('.touch-active');
			if(el) { el.classList.remove('touch-active'); }
		}, 100);
	});

	var sendRequest = (function() {

		var socketUrl = location.origin; // location.protocol + '//' + location.host
		var socket    = io.connect(socketUrl);

		return function(device, state) {

			socket.emit('toggleState', {
				unitCode: JSON.parse(device),
				state: state
			});

		};

	})();

})();