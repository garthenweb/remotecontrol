import schedule from './schedule';
import { SET_LOCATION } from '../actions/user';

const storeUserEnters = ({ user }, { user: prevUser }) => (
  user.location === 'in_range' &&
  prevUser.location !== 'in_range'
);

const storeTimeBetween = (timeRange) => (
  ({ date }) => isTimeInRange(date.timestamp, timeRange)
);

export default schedule.sideeffect({
  [SET_LOCATION]: {
    action: activateLight,
    condition: [
      storeUserEnters,
      storeTimeBetween([[20, 0], [4, 0]]),
    ],
  },
});
