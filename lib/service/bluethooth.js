import childProcess from 'child_process';
import EventEmitter from 'events';

export const LOST = Symbol('LOST');
export const FOUND = Symbol('FOUND');

export const lookup = bdaddr => new Promise((resolve, reject) => {
  childProcess.exec(
    `hcitool name ${bdaddr}`,
    (err, stdout, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
        return;
      }
      resolve(stdout);
    });
});

let state;
export default (bdaddr, interval = 60000) => {
  const emitter = new EventEmitter();
  const iID = setInterval(async () => {
    const inRange = Boolean(await lookup(bdaddr));
    if (state !== inRange) {
      state = inRange;
      emitter.emit('stateChange', {
        state: inRange ? FOUND : LOST,
      });
    }
  }, interval);

  return {
    on: emitter.on,
    stop: () => clearInterval(iID),
  };
};
