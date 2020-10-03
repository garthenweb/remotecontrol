import schedule from './schedule';
import { IN_RANGE } from './locationLookup';
import deviceActions from '../../../react/src/actions/device';
import dateUtil from '../utils/date';
import groupUtil from '../utils/group';

const isLocationChanged = ({ user }, { user: prevUser }) => {
  // pending does not count as changed
  if (user.location.pending) {
    return false
  }
  // when prev position was pending but is not pending any longer, if the state does not change it was applied and we need to update.
  // if it was changed, the pending state was rejected and no update was triggered
  if (prevUser.location.pending) {
    return user.location.state === prevUser.location.state
  }

  // if not pending and not pending before we need we just take the state into account and whether it changed
  return user.location.state !== prevUser.location.state
};

const isNight = ({ date, weather }) => {
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

const isDay = (...args) => !isNight(...args);
const isDayTimeChanged = (state, prevState) => (
  isNight(state) !== isNight(prevState)
);

const isUserAtHome = ({ user }) => user.location.state === IN_RANGE;
const isUserAway = ({ user }) => user.location.state === null;

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
