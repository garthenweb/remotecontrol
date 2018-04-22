import schedule from './schedule';

import { setLocation } from '../../../lib/server/actions/user';
import { lookup } from '../../../lib/service/bluethooth';
import locals from '../../../locals.json';

export const IN_RANGE = 'in_range';

async function getLocationState(addr) {
  return await lookup(addr) ? IN_RANGE : null;
}

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_SECONDS = 1000 * 30;
export default locals.bdaddrs.map(addr => schedule.every(
  THIRTY_SECONDS,
  () => async (dispatch, getState) => {
    const { user: { location }, date: { currentTimestamp } } = getState();
    const lastCheckDiff = currentTimestamp - location.lastChecked;
    // if in range only check in 5 minute interval
    if (location.state === IN_RANGE && lastCheckDiff <= FIVE_MINUTES) {
      return;
    }
    let nextState;
    try {
      nextState = await getLocationState(addr);
    } catch (exc) {
      console.error(`Unable to lookup device \`${addr}\``, exc);
      return;
    }
    const stateChange = nextState !== location.state;
    // in case the state will change, double check first before dispatching
    if (stateChange && nextState !== await getLocationState(addr)) {
      return;
    }
    dispatch(setLocation({
      state: nextState,
      lastChecked: currentTimestamp,
    }));
  },
));
