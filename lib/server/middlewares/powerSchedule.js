import schedule from './schedule';
import { activate, deactivate } from '../actions/devicePowerPoint';
import dateUtil from '../utils/date';

export const isLocationChanged = ({ user }, { user: prevUser }) => (
  user.location !== prevUser.location
);

export const isNight = ({ date, weather }) => {
  const weatherId = dateUtil.getFormattedDate(date.currentTimestamp);
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

export const isUserAtHome = ({ user }) => user.location === 'in_range';
export const isUserAway = ({ user }) => user.location !== 'in_range';

export default {
  activateLightOnEnter: schedule.onAction(
    isLocationChanged,
    isUserAtHome,
    isNight,
    (dispatch) => {
      dispatch(activate(2));
      dispatch(activate(3));
    },
  ),

  deactivatePowerOnLeave: schedule.onAction(
    isLocationChanged,
    isUserAway,
    (dispatch) => {
      dispatch(deactivate(0));
      dispatch(deactivate(1));
      dispatch(deactivate(2));
      dispatch(deactivate(3));
      dispatch(deactivate(4));
    },
  ),

  activatePlantLightOnLeave: schedule.onAction(
    isLocationChanged,
    isUserAway,
    dispatch => dispatch(activate(999)),
  ),

  deactiavtePlantLightOnEnter: schedule.onAction(
    isLocationChanged,
    isUserAtHome,
    dispatch => dispatch(deactivate(999)),
  ),
};
