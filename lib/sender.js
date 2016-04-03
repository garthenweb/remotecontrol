import five from 'johnny-five';
import board from './board';
import { setupBits, toBangs, iterate, LOW } from './helper';

const clock = (start) => {
  const end = process.hrtime(start);
  return (end[0] * 1000) + (end[1] / 1000000);
};

const sleep = (ms) => {
  const startTime = process.hrtime();
  while (ms >= clock(startTime));
};

function remoteSwitch(unitCode, turnOn, { systemCode = [1, 1, 1, 1, 1], pin = 17 } = {}) {
  const bit = setupBits(unitCode, systemCode);
  bit[10] = turnOn ? 136 : 142;
  bit[11] = turnOn ? 142 : 136;
  const bangs = toBangs(bit);

  board.on('ready', function onBoardReady() {
    console.log('pin', pin);
    console.log('system code', systemCode);
    console.log('mode', five.Pin.OUTPUT);
    console.log('write first', LOW);
    this.pinMode(pin, five.Pin.OUTPUT);
    this.digitalWrite(pin, LOW);

    const start = process.hrtime();
    iterate(10, () => {
      const len = bangs.length;
      for (let i = 0; i < len; i++) {
        this.digitalWrite(pin, bangs[i]);
        sleep(0.3);
      }
    });
    console.log('Done', clock(start));
    this.repl.inject({
      repeat: onBoardReady.bind(this),
    });
  });
}

export function on(unitCode, options) {
  console.log('on', unitCode);
  remoteSwitch(unitCode, true, options);
}

export function off(unitCode, options) {
  console.log('off', unitCode);
  remoteSwitch(unitCode, false, options);
}

export default {
  on,
  off,
};
