import schedule from './schedule';
import { activate, deactivate } from '../actions/devicePowerPoint';
import idUtil from '../utils/id';

export const isLocationChanged = ({ user }, { user: prevUser }) => (
  user.location !== prevUser.location
);

export const isNight = ({ date, weather }) => {
  const weatherId = idUtil.getWeatherId(date.currentTimestamp);
  const todayWeather = weather[weatherId];
  // weather might be undefined because it was not imported jet
  // in this case we don't want to handle the event
  if (!todayWeather) {
    return false;
  }

  return (
    date.currentTimestamp > weather[weatherId].sunset ||
    date.currentTimestamp < weather[weatherId].sunrise
  );
};

export default {
  lightOnOnEnter: schedule.onAction(
    isLocationChanged,
    ({ user }) => user.location === 'in_range',
    isNight,
    (dispatch) => {
      dispatch(activate(2));
      dispatch(activate(3));
    },
  ),

  powerOffOnLeave: schedule.onAction(
    isLocationChanged,
    ({ user }) => user.location !== 'in_range',
    (dispatch) => {
      dispatch(deactivate(0));
      dispatch(deactivate(1));
      dispatch(deactivate(2));
      dispatch(deactivate(3));
      dispatch(deactivate(4));
    },
  ),
};
