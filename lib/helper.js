export const LOW = 0;
export const HIGH = 1;

export function iterate(options, fn) {
  const optionsIsNumber = typeof options === 'number';
  const { start = 0, interval = 1, to } = optionsIsNumber ? { to: options } : options;
  for (let i = start; i < to; i += interval) {
    fn(i);
  }
}

export function setupBitsByCodes(unitCode, systemCode) {
  const bit = [null, null, null, null, null, 142, 142, 142, 142, 142, null, null, 128, 0, 0, 0];
  // systemCode bits
  iterate(5, (i) => bit[i] = systemCode[i] === 1 ? 136 : 142);

  // unitCode bits
  let x = 1;
  iterate({ start: 1, to: 6 }, (i) => {
    if ((unitCode & x) > 0) {
      bit[4 + i] = 136;
    }
    x = x << 1;
  });

  return bit;
}

export function bitsToBangs(bit) {
  const bangs = [];
  iterate(16, (y) => {
    let x = 128;
    iterate({ start: 1, to: 9 }, () => {
      const b = ((bit[y] & x) > 0) ? HIGH : LOW;
      bangs.push(b);
      x = x >> 1;
    });
  });

  return bangs;
}

export function getBangsByCodes(turnOn, { unitCode, systemCode }) {
  const bit = setupBitsByCodes(unitCode, systemCode);
  bit[10] = turnOn ? 136 : 142;
  bit[11] = turnOn ? 142 : 136;
  return bitsToBangs(bit);
}
