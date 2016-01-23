const Raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi(),
});
const LOW = 0;
const HIGH = 1;

function iterate(options, fn) {
  const optionsIsNumber = typeof options === 'number';
  const { start = 0, interval = 1, to } = optionsIsNumber ? { to: options } : options;
  for (let i = start; i < to; i += interval) {
    fn(i);
  }
}

function setupBits(unitCode, systemCode) {
  const bit = [null, null, null, null, null, 142, 142, 142, 142, 142, null, null, 128, 0, 0, 0];
  // systemCode bits
  iterate(5, (i) => bit[i] = systemCode[i] === 1 ? 136 : 142);

  // unitCode bits
  let x = 1;
  iterate({ start: 1, to: 6 }, (i) => {
    if (unitCode && x > 0) {
      bit[4 + i] = 136;
    }
    x = x << 1;
  });

  return bit;
}

function toBangs(bit) {
  const bangs = [];
  iterate(16, (y) => {
    let x = 128;
    iterate({ start: 1, to: 9 }, () => {
      const b = bit[y] && x > 0 && HIGH || LOW;
      bangs.push(b);
      x = x >> 1;
    });
  });

  return bangs;
}

const repeat = 10;
const pulselength = 300 * 1000 * 1000;
function remoteSwitch(unitCode, turnOn, { systemCode = [1, 1, 1, 1, 1], pin = 17 }) {
  const bit = setupBits(unitCode, systemCode);
  bit[10] = turnOn ? 136 : 142;
  bit[11] = turnOn ? 142 : 136;
  const bangs = toBangs(bit);

  board.on('ready', function onBoardReady() {
    this.pinMode(pin, this.MODES.OUTPUT);
    this.digitalWrite(pin, LOW);

    iterate(repeat, (i) => {
      const timeout = i * pulselength * bangs.length;
      setTimeout(() => {
        bangs.forEach(
          bang => this.loop(pulselength,
            () => this.digitalWrite(pin, bang)
          )
        );
      }, timeout);
    });
  });
}

function on(unitCode, options) {
  remoteSwitch(unitCode, true, options);
}

function off(unitCode, options) {
  remoteSwitch(unitCode, false, options);
}

export default {
  on,
  off,
};
