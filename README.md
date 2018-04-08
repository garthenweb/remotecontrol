
Tested on Raspberry Pi Model B Rev 2 with [Raspbian Stretch Lite](https://www.raspberrypi.org/downloads/raspbian/).

# API

emit('action', {
  type: 'DEVICE_MUTATE_POWER',
  payload: {
    channel: [0,0,0,0,0],
    code: 4,
    state: 'on',
  },
  meta: {
    access: PUBLIC,
  },
});

emit('action', {
  type: 'DEVICE_CREATE',
  payload: {
    id: '1234567',
    type: 'power',
  },
  meta: {
    access: PUBLIC,
  },
});
