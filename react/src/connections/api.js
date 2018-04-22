const connect = url => {
  // eslint-disable-next-line no-undef
  const socket = io.connect(url, {
    'reconnection delay': 100,
    'reconnection limit': 100,
    'max reconnection attempts': Infinity,
  });

  // socket.on('error', (err) => {
  //   alert('error' + JSON.stringify(err));
  // });

  // socket.on('reconnect_failed', (err) {
  //   alert('reconnect_failed' + JSON.stringify(err));
  // });
  return socket;
};

export default (url = window.location.origin) => {
  const socket = connect(url);
  return {
    updateDevice: device => {
      socket.emit('device:mutate', device);
      return this;
    },
    addDeviceChangeListener: fn => {
      socket.on('device:sync', fn);
      return this;
    },
  };
};
