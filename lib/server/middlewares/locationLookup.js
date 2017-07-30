import schedule from './schedule';

import { setLocation } from '../../../lib/server/actions/user';
import { lookup } from '../../../lib/service/bluethooth';
import locals from '../../../locals.json';

async function getLocationState(addr) {
  return await lookup(addr) ? 'in_range' : null;
}

const FIVE_MINUTES = 1000 * 60 * 5;
export default locals.bdaddrs.map(addr => schedule.every(
  30000,
  () => async (dispatch, getState) => {
    const { user: { location }, date: { currentTimestamp } } = getState();
    const lastCheckDiff = location.lastChecked - currentTimestamp;
    // if in range only check in 5 minute interval
    if (location.state === 'in_range' && lastCheckDiff <= FIVE_MINUTES) {
      return;
    }
    const nextState = await getLocationState(addr);
    const stateChange = nextState !== location.state;
    // in case the state will change, double check first before dispatching
    if (stateChange && nextState !== await getState(addr)) {
      return;
    }
    dispatch(setLocation({
      state: nextState,
      lastChecked: currentTimestamp,
    }));
  },
));
