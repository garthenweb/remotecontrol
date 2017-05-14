import schedule from './schedule';

import { setLocation } from '../../../lib/server/actions/user';
import { lookup } from '../../../lib/service/bluethooth';
import locals from '../../../locals.json';

export default locals.bdaddrs.map(addr => schedule.every(30000, () => async (dispatch) => {
  const inRange = Boolean(await lookup(addr));
  return dispatch(setLocation(inRange ? 'in_range' : null));
}));
