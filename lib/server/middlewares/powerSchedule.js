import schedule from './schedule';
import { IN_RANGE } from './locationLookup';
import deviceActions from '../../../react/src/actions/device';
import dateUtil from '../utils/date';
import groupUtil from '../utils/group';

export const isLocationChanged = ({ user }, { user: prevUser }) => {
  return (
    user.location.state !== prevUser.location.state ||
    user.location.pending !== prevUser.location.pending
  );
};

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

export const isUserAtHome = ({ user }) => {
  return (
    user.location.state === IN_RANGE ||
    (user.location.state === null && user.location.pending)
  );
};
export const isUserAway = ({ user }) =>
  user.location.state === null && !user.location.pending;

export default {
  activateLightOnEnter: (store) => schedule.onAction(
    isLocationChanged,
    isUserAtHome,
    isNight,
    groupUtil.dispatchForGroup(
      Object.values(store.getState().devices),
      'light',
      deviceActions.powerOn,
    ),
  )(store),

  deactivatePowerOnLeave: (store) => schedule.onAction(
    isLocationChanged,
    isUserAway,
    groupUtil.dispatchForGroup(
      Object.values(store.getState().devices),
      '!away',
      deviceActions.powerOff,
    ),
  )(store),

  activatePlantLightOnLeave: (store) => schedule.onAction(
    isLocationChanged,
    isUserAway,
    // isDay,
    groupUtil.dispatchForGroup(
      Object.values(store.getState().devices),
      'away',
      deviceActions.powerOn,
    ),
  )(store),

  deactivatePlantLightOnEnter: (store) => schedule.onAction(
    isLocationChanged,
    isUserAtHome,
    groupUtil.dispatchForGroup(
      Object.values(store.getState().devices),
      'away',
      deviceActions.powerOff,
    ),
  )(store),

  activatePlantLightAtDay: (store) => schedule.onAction(
    isDayTimeChanged,
    isDay,
    // isUserAway,
    groupUtil.dispatchForGroup(
      Object.values(store.getState().devices),
      'away',
      deviceActions.powerOn,
    ),
  )(store),

  deactivatePlantLightAtNight: (store) => schedule.onAction(
    isDayTimeChanged,
    isNight,
    groupUtil.dispatchForGroup(
      Object.values(store.getState().devices),
      'away',
      deviceActions.powerOff,
    ),
  )(store),
};
