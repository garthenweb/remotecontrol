import schedule from './schedule';
import { activate, deactivate } from '../actions/devicePowerPoint';
import dateUtil from '../utils/date';
import groupUtil from '../utils/group';

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
    groupUtil.dispatchForGroup('light', activate),
  ),

  deactivatePowerOnLeave: schedule.onAction(
    isLocationChanged,
    isUserAway,
    groupUtil.dispatchForGroup(
      ({ group = [] }) => !group.includes('away'),
      deactivate,
    ),
  ),

  activatePlantLightOnLeave: schedule.onAction(
    isLocationChanged,
    isUserAway,
    groupUtil.dispatchForGroup('away', activate),
  ),

  deactiavtePlantLightOnEnter: schedule.onAction(
    isLocationChanged,
    isUserAtHome,
    groupUtil.dispatchForGroup('away', deactivate),
  ),
};
