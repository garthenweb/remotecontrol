import locals from '../../../locals.json';

const filterGroup = name => locals.powerControl.devices.filter(
  typeof name === 'function' ? name : ({ group }) => group.includes(name),
);

const dispatchForGroup = (group, action) => dispatch => (
  filterGroup(group).forEach(({ code }) => dispatch(action(code)))
);

export default { dispatchForGroup };
