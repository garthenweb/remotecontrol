jest.mock('../utils/date', () => ({
  getFormattedDate: () => '2017-05-17',
}));

import { isNight } from './powerSchedule';

const createState = ({
  currentDate,
  sunset = '2017-05-17 21:00',
  sunrise = '2017-05-17 04:00',
}) => ({
  date: { currentTimestamp: new Date(currentDate).getTime() },
  weather: {
    '2017-05-17': {
      sunset: new Date(sunset).getTime(),
      sunrise: new Date(sunrise).getTime(),
    },
  },
});

describe('power schedule middleware', () => {
  describe('isNight', () => {
    const table = [
      {
        currentDate: '2017-05-17 22:00',
        expect: true,
        describe: 'should define night for evening',
      },
      {
        currentDate: '2017-05-17 03:00',
        expect: true,
        describe: 'should define night for morning',
      },
      {
        currentDate: '2017-05-17 12:00',
        expect: false,
        describe: 'should define day for midday',
      },
      {
        currentDate: '2017-05-17 00:00',
        expect: true,
        describe: 'should define night for midnight',
      },
    ];

    table.forEach((test) => {
      it(test.describe, () => {
        const state = createState({
          currentDate: test.currentDate,
          sunset: test.sunset,
          sunrise: test.sunrise,
        });
        expect(isNight(state)).toBe(test.expect);
      });
    });
  });
});
