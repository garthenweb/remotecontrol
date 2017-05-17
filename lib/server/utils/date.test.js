import dateUtil from './date';

// Wed May 17 2017 22:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)
const MAY_17_2017_22_00 = 1495051200000;

describe('date utility', () => {
  describe('getFormattedDate', () => {
    it('should return formatted date strings', () => {
      expect(dateUtil.getFormattedDate(MAY_17_2017_22_00)).toBe('2017-05-17');
    });
  });
});
