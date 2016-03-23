import board from './board';
import { setupBits, toBangs, iterate, LOW } from './helper';

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
