import childProcess from 'child_process';
import path from 'path';

const ELRO_PATH = path.join(__dirname, '..', '..', 'bin', 'elro_wiringpi.py');
const execElroWiringpi = options => new Promise((resolve, reject) => {
  childProcess.exec(
    `sudo ${ELRO_PATH} ${options.join(' ')}`,
    (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
});

let running = false;
let executionQueue = [];
const processExecutionQueue = async () => {
  if (executionQueue.length === 0) {
    running = false;
    return;
  }
  running = true;
  await execElroWiringpi(executionQueue.shift());
  processExecutionQueue();
};

const appendQueue = (command) => {
  const stringifiedCommand = command.map(arg => JSON.stringify(arg));
  executionQueue = [
    // remove all commands of the same unitcode (last wins)
    ...executionQueue.filter(
      ([queueUnitCode, queueChannel]) => (
        queueUnitCode !== stringifiedCommand[0] &&
        queueChannel !== stringifiedCommand[1]
      ),
    ),
    stringifiedCommand,
  ];
  if (!running) {
    processExecutionQueue();
  }
};

export default (type, { code, channel }) => {
  switch (type) {
    case 'on':
    case 'off':
      appendQueue([2 ** code, channel, (type === 'on' ? 1 : 0)]);
      return;
    default:
      throw new TypeError(`Type \`${type}\` is not defined`);
  }
};
