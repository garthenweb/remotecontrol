import schedule from './schedule';
import { activate, deactivate } from '../actions/devicePowerPoint';
import dateUtil from '../utils/date';
import groupUtil from '../utils/group';

export const isLocationChanged = ({ user }, { user: prevUser }) => (
  user.location.state !== prevUser.location.state
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
    date.currentTimestamp > todayWeather.sunset ||
    date.currentTimestamp < todayWeather.sunrise
  );
};

export const isDay = (...args) => !isNight(...args);
export const isDayTimeChanged = (state, prevState) => (
  isNight(state) !== isNight(prevState)
);

export const isUserAtHome = ({ user }) => user.location.state === 'in_range';
export const isUserAway = ({ user }) => user.location.state !== 'in_range';

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
    groupUtil.dispatchForGroup('!away', deactivate),
  ),

  activatePlantLightOnLeave: schedule.onAction(
    isLocationChanged,
    isUserAway,
    // isDay,
    groupUtil.dispatchForGroup('away', activate),
  ),

  deactivatePlantLightOnEnter: schedule.onAction(
    isLocationChanged,
    isUserAtHome,
    groupUtil.dispatchForGroup('away', deactivate),
  ),

  // activatePlantLightAtDay: schedule.onAction(
  //   isDayTimeChanged,
  //   isDay,
  //   isUserAway,
  //   groupUtil.dispatchForGroup('away', activate),
  // ),

  // deactivatePlantLightAtNight: schedule.onAction(
  //   isDayTimeChanged,
  //   isNight,
  //   groupUtil.dispatchForGroup('away', deactivate),
  // ),
};
