import apiConnector from '../connections/api';
import actions, { POWER_STATE_CHANGE } from '../actions/device';

export default store => {
  const api = apiConnector();
  api.addDeviceChangeListener(device => store.dispatch(actions.upsert(device)));
  return next => action => {
    switch (action.type) {
      case POWER_STATE_CHANGE: {
        next(action);

        const { devices } = store.getState();
        const updateDevices = []
          .concat(action.meta.id)
          .map(id => devices[id].serialize());
        api.updateDevice(updateDevices);
        return;
      }
      default:
        next(action);
    }
  };
};
