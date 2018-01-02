import childProcess from 'child_process';
import path from 'path';

const ELRO_PATH = path.join(__dirname, '..', '..', 'bin', 'elro_wiringpi.py');
const execElroWiringpi = (...args) => new Promise((resolve, reject) => {
  childProcess.exec(
    `${ELRO_PATH} ${args.join(' ')}`,
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
  try {
    await execElroWiringpi(...executionQueue.shift());
  } catch (exc) {
    console.error('Unable to execute elro wiring script', exc);
  } finally {
    processExecutionQueue();
  }
};

const appendQueue = (command) => {
  const stringifiedCommand = command.map(arg => JSON.stringify(arg));
  executionQueue = [
    // remove all commands that do not belong to the next unit
    // so one unit can only have one representation in the queue
    ...executionQueue.filter(
      ([queueUnitCode, queueChannel]) => !(
        queueUnitCode === stringifiedCommand[0] &&
        queueChannel === stringifiedCommand[1]
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
      throw new TypeError(`Only \`on\` and \`off\` are valid types, received \`${type}\``);
  }
};
