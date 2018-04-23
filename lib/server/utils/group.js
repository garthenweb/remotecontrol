import locals from '../../../locals.json';

export const filterGroup = name => locals.devices.filter(
  ({ group = [] }) => {
    const not = name.startsWith('!');
    return not ? !group.includes(name.slice(1)) : group.includes(name);
  },
);

const dispatchForGroup = (group, action) => dispatch => (
  filterGroup(group).forEach(
    (device) => dispatch(action(device.id)),
  )
);

export default { dispatchForGroup };
