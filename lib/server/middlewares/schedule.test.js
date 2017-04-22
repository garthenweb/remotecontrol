import schedule, { isTimeRangeBetweenDates } from './schedule';

describe('schedule middleware', () => {
  describe('atTime', () => {
    it('should create a middleware', () => {
      expect(typeof schedule.atTime({})).toBe('function');
      expect(typeof schedule.atTime({})()).toBe('function');
      expect(typeof schedule.atTime({})()()).toBe('function');
    });
  });

  describe('isTimeRangeBetweenDates', () => {
    it('should be true when hour overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 4);
      const date = new Date(2017, 22, 1, 5);
      expect(isTimeRangeBetweenDates([5, 0], prevDate, date)).toBe(true);
    });

    it('should be true when minute overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 5, 0);
      const date = new Date(2017, 22, 1, 5, 1);
      expect(isTimeRangeBetweenDates([5, 1], prevDate, date)).toBe(true);
    });

    it('should be true when minute and hour overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 4, 59);
      const date = new Date(2017, 22, 1, 5, 0);
      expect(isTimeRangeBetweenDates([5, 0], prevDate, date)).toBe(true);
    });

    it('should be true when range overlaps on new day', () => {
      const prevDate = new Date(2017, 22, 1, 23, 59);
      const date = new Date(2017, 22, 2, 0);
      expect(isTimeRangeBetweenDates([0, 0], prevDate, date)).toBe(true);
    });

    it('should be true when range overlaps on prev day', () => {
      const prevDate = new Date(2017, 22, 1, 23, 58);
      const date = new Date(2017, 22, 2, 0);
      expect(isTimeRangeBetweenDates([23, 59], prevDate, date)).toBe(true);
    });

    it('should be true time overlap range heavily', () => {
      const prevDate = new Date(2017, 22, 1);
      const date = new Date(2017, 22, 2, 5);
      expect(isTimeRangeBetweenDates([0, 0], prevDate, date)).toBe(true);
    });

    it('should be false when range does not overlap', () => {
      const prevDate = new Date(2017, 22, 1, 4, 59);
      const date = new Date(2017, 22, 1, 5, 0);
      expect(isTimeRangeBetweenDates([4, 0], prevDate, date)).toBe(false);
    });

    it('should ignore seconds', () => {
      const prevDate = new Date(2017, 22, 1, 5, 0, 0);
      const date = new Date(2017, 22, 1, 5, 0, 1);
      expect(isTimeRangeBetweenDates([5, 0], prevDate, date)).toBe(false);
    });
  });
});
