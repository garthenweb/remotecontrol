import schedule from './schedule';

import { setLocation } from '../../../lib/server/actions/user';
import { lookup } from '../../../lib/service/bluethooth';
import locals from '../../../locals.json';

export const IN_RANGE = 'in_range';

async function getLocationState(addr) {
  return await lookup(addr) ? IN_RANGE : null;
}

const IN_RANGE_UPDATE_INTERVAL = 1000 * 60 * 5;
const UPDATE_INTERVAL = 1000 * 15;

export default locals.bdaddrs.map((addr) =>
  schedule.every(UPDATE_INTERVAL, () => async (dispatch, getState) => {
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

    const nextLocationState = await getLocationState(addr);
    // coming home
    if (location.state === null && nextLocationState === IN_RANGE) {
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
      nextLocationState === null &&
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
      nextLocationState === null &&
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
  })
);
