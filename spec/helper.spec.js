import { setupBits } from '../lib/helper';

describe('helper', () => {
  it('setupBits for unit 1 for system (1, 1, 1, 1, 1)', () => {
    expect(setupBits(1, [1, 1, 1, 1, 1])).toEqual(
      [136, 136, 136, 136, 136, 136, 142, 142, 142, 142, null, null, 128, 0, 0, 0]
    );
  });
  it('setupBits for unit 2 for system (1, 1, 1, 1, 1)', () => {
    expect(setupBits(2, [1, 1, 1, 1, 1])).toEqual(
      [136, 136, 136, 136, 136, 142, 136, 142, 142, 142, null, null, 128, 0, 0, 0]
    );
  });
  it('setupBits for unit 4 for system (1, 1, 1, 1, 1)', () => {
    expect(setupBits(4, [1, 1, 1, 1, 1])).toEqual(
      [136, 136, 136, 136, 136, 142, 142, 136, 142, 142, null, null, 128, 0, 0, 0]
    );
  });
  it('setupBits for unit 1 for system (0, 0, 0, 0, 0)', () => {
    expect(setupBits(1, [0, 0, 0, 0, 0])).toEqual(
      [142, 142, 142, 142, 142, 136, 142, 142, 142, 142, null, null, 128, 0, 0, 0]
    );
  });
  it('setupBits for unit 2 for system (0, 0, 0, 0, 0)', () => {
    expect(setupBits(2, [0, 0, 0, 0, 0])).toEqual(
      [142, 142, 142, 142, 142, 142, 136, 142, 142, 142, null, null, 128, 0, 0, 0]
    );
  });
  it('setupBits for unit 4 for system (0, 0, 0, 0, 0)', () => {
    expect(setupBits(4, [0, 0, 0, 0, 0])).toEqual(
      [142, 142, 142, 142, 142, 142, 142, 136, 142, 142, null, null, 128, 0, 0, 0]
    );
  });
});
