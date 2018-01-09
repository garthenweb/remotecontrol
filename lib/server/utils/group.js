import locals from '../../../locals.json';

export const filterGroup = name => locals.powerControl.devices.filter(
  ({ group = [] }) => {
    const not = name.startsWith('!');
    return not ? !group.includes(name.slice(1)) : group.includes(name);
  },
);

const dispatchForGroup = (group, action) => dispatch => (
  filterGroup(group).forEach(
    ({ code, channel }) => dispatch(action({ code, channel })),
  )
);

export default { dispatchForGroup };
