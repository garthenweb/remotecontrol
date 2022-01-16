import schedule from './schedule';

import { setLocation } from '../../../lib/server/actions/user';
import { lookup as lookupBluethooth } from '../../../lib/service/bluethooth';
import { lookup as lookupWlan } from '../../../lib/service/wlan';
import locals from '../../../locals.json';

export const IN_RANGE = 'in_range';

async function getLocationState({ bluetoothDeviceIdentifier, macAddress }) {
  const [wlanAvailable, bluethoothAvailable] = await Promise.all([
    macAddress
      ? lookupWlan(macAddress)
          .then((device) => Boolean(device))
          .catch(() => false)
      : false,
    bluetoothDeviceIdentifier
      ? lookupBluethooth(bluetoothDeviceIdentifier)
          .then((deviceName) => Boolean(deviceName))
          .catch(() => false)
      : false,
  ]);

  if (wlanAvailable) {
    return IN_RANGE;
  }
  if (bluethoothAvailable) {
    return IN_RANGE;
  }
  return null;
}

const IN_RANGE_UPDATE_INTERVAL = 1000 * 60 * 5;
const UPDATE_INTERVAL = 1000 * 15;

export default schedule.every(
  UPDATE_INTERVAL,
  () => async (dispatch, getState) => {
    const {
      user: { location },
      date: { currentTimestamp },
    } = getState();
    const lastCheckDiff = currentTimestamp - location.lastChecked;
    // if in range don't check all the time to safe resources
    if (
      location.state === IN_RANGE &&
      lastCheckDiff <= IN_RANGE_UPDATE_INTERVAL
    ) {
      return;
    }

    const locationStates = await Promise.all(
      locals.userDevices.map(({ bluetoothDeviceIdentifier, macAddress }) =>
        getLocationState({ bluetoothDeviceIdentifier, macAddress })
      )
    );

    const nextIsAnyUserAtHome = locationStates.some(
      (state) => state === IN_RANGE
    );

    // coming home
    if (location.state === null && nextIsAnyUserAtHome) {
      dispatch(
        setLocation({
          state: IN_RANGE,
          pending: false,
          lastChecked: currentTimestamp,
        })
      );
      return;
    }

    // leave detected but not verified
    if (
      location.state === IN_RANGE &&
      !nextIsAnyUserAtHome &&
      location.pending === false
    ) {
      dispatch(
        setLocation({
          state: null,
          pending: true,
          lastChecked: currentTimestamp,
        })
      );
      return;
    }

    // leave verified
    if (
      location.state === null &&
      !nextIsAnyUserAtHome &&
      location.pending === true
    ) {
      dispatch(
        setLocation({
          state: null,
          pending: false,
          lastChecked: currentTimestamp,
        })
      );
      return;
    }

    // no change detected, just update the timestamp
    dispatch(
      setLocation({
        ...location,
        lastChecked: currentTimestamp,
      })
    );
  }
);
