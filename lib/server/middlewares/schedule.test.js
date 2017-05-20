import schedule, {
  isTimeRangeBetweenDates,
  milisecondsToTimeKey,
  timeKeysFromInterval,
} from './schedule';

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
      expect(isTimeRangeBetweenDates([5, 0, 0], prevDate, date)).toBe(true);
    });

    it('should be true when minute overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 5, 0);
      const date = new Date(2017, 22, 1, 5, 1);
      expect(isTimeRangeBetweenDates([5, 1, 0], prevDate, date)).toBe(true);
    });

    it('should be true when second overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 5, 0, 0);
      const date = new Date(2017, 22, 1, 5, 0, 1);
      expect(isTimeRangeBetweenDates([5, 0, 1], prevDate, date)).toBe(true);
    });

    it('should be true when minute and hour overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 4, 59);
      const date = new Date(2017, 22, 1, 5, 0);
      expect(isTimeRangeBetweenDates([5, 0, 0], prevDate, date)).toBe(true);
    });

    it('should be true when second, minute and hour overlap range', () => {
      const prevDate = new Date(2017, 22, 1, 4, 59, 59);
      const date = new Date(2017, 22, 1, 5, 0, 0);
      expect(isTimeRangeBetweenDates([5, 0, 0], prevDate, date)).toBe(true);
    });

    it('should be true when range overlaps on new day', () => {
      const prevDate = new Date(2017, 22, 1, 23, 59);
      const date = new Date(2017, 22, 2, 0);
      expect(isTimeRangeBetweenDates([0, 0, 0], prevDate, date)).toBe(true);
    });

    it('should be true when range overlaps on prev day', () => {
      const prevDate = new Date(2017, 22, 1, 23, 58);
      const date = new Date(2017, 22, 2, 0);
      expect(isTimeRangeBetweenDates([23, 59, 0], prevDate, date)).toBe(true);
    });

    it('should be true when time overlap range heavily', () => {
      const prevDate = new Date(2017, 22, 1);
      const date = new Date(2017, 22, 2, 5);
      expect(isTimeRangeBetweenDates([0, 0, 0], prevDate, date)).toBe(true);
    });

    it('should be false when range does not overlap', () => {
      const prevDate = new Date(2017, 22, 1, 4, 59);
      const date = new Date(2017, 22, 1, 5, 0);
      expect(isTimeRangeBetweenDates([4, 0, 0], prevDate, date)).toBe(false);
    });

    it('should ignore microseconds', () => {
      const prevDate = new Date(2017, 22, 1, 5, 0, 0, 0);
      const date = new Date(2017, 22, 1, 5, 0, 0, 1);
      expect(isTimeRangeBetweenDates([5, 0, 0], prevDate, date)).toBe(false);
    });
  });

  describe('milisecondsToTimeKey', () => {
    it('should create a time key', () => {
      expect(milisecondsToTimeKey(0)).toEqual([0, 0, 0]);
    });

    it('should work for seconds', () => {
      expect(milisecondsToTimeKey(30000)).toEqual([0, 0, 30]);
    });

    it('should work for minutes', () => {
      expect(milisecondsToTimeKey(90000)).toEqual([0, 1, 30]);
    });

    it('should work for hours', () => {
      expect(milisecondsToTimeKey(18100000)).toEqual([5, 1, 40]);
    });
  });

  describe('timeKeysFromInterval', () => {
    it('should generate correct amount of time keys', () => {
      expect(timeKeysFromInterval(1000 * 60 * 60).length).toBe(24);
      expect(timeKeysFromInterval(30000).length).toBe(2880);
    });

    it('should generate quarter day time keys', () => {
      expect(timeKeysFromInterval(1000 * 60 * 60 * 6).length).toBe(4);
      expect(timeKeysFromInterval(1000 * 60 * 60 * 6)).toEqual([
        [0, 0, 0],
        [6, 0, 0],
        [12, 0, 0],
        [18, 0, 0],
      ]);
    });

    it('should work with uneven values', () => {
      const FOURHUNDERDFIFTYONE_SECONDS = 1000 * 451;
      const interval = (1000 * 60 * 60 * 6) + FOURHUNDERDFIFTYONE_SECONDS;
      expect(timeKeysFromInterval(interval).length).toBe(4);
      expect(timeKeysFromInterval(interval)).toEqual([
        [0, 0, 0],
        [6, 7, 31],
        [12, 15, 2],
        [18, 22, 33],
      ]);
    });
  });
});
