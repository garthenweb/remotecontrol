import { activate } from '../actions/devicePowerPoint';
import { SET_LOCATION } from '../actions/user';

const getTodayTime = (hours, ...time) => {
  const d = new Date();
  // -2 two hours because of different time zone
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours - 2, ...time);
};
const getTomorrowTime = (hours, ...time) => {
  const d = new Date();
  // -2 two hours because of different time zone
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, hours - 2, ...time);
};

const middleware = store => next => (action) => {
  switch (action.type) {
    case SET_LOCATION: {
      const prevLocation = store.getState().user.location;
      next(action);
      const location = store.getState().user.location;
      const shouldTurnOnLight = (
        prevLocation !== location &&
        location === 'in_range' &&
        (new Date() > getTodayTime(20)) &&
        (new Date() < getTomorrowTime(5))
      );
      if (shouldTurnOnLight) {
        store.dispatch(activate(2));
        store.dispatch(activate(3));
      }

      break;
    }

    default:
      next(action);
  }
};

export default middleware;
