export const filterGroup = (devices, name) => devices.filter(
  ({ groups = [] }) => {
    const not = name.startsWith('!');
    return not ? !groups.includes(name.slice(1)) : groups.includes(name);
  },
);

const dispatchForGroup = (devices, group, action) => dispatch => {
  return filterGroup(devices, group).forEach(
    (device) => dispatch(action(device.id)),
  )
};

export default { dispatchForGroup };
