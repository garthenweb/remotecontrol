import createDevice, { POWER_ON, POWER_OFF, togglePower } from './Device';

describe('Device', () => {
  it('should accept id and name', () => {
    const device = createDevice({
      id: 'myid',
      name: 'myname',
    });
    expect(device.id).toBe('myid');
    expect(device.name).toBe('myname');
  });

  it('should have a default state', () => {
    const device = createDevice({
      id: 'myid',
      name: 'myname',
    });
    expect(device.props.power).toBe(false);
  });

  it('should insert properties', () => {
    const device = createDevice({
      id: 'myid',
      name: 'myname',
      props: {
        power: true,
      },
    });

    expect(device.props.power).toBe(true);
  });

  it('should insert state', () => {
    const device = createDevice({
      id: 'myid',
      name: 'myname',
      props: {
        power: true,
      },
      state: {
        power: POWER_ON,
      },
    });

    expect(device.power).toBe(POWER_ON);
  });

  it('should copy the device', () => {
    const device = createDevice({
      id: 'myid',
      name: 'myname',
      props: {
        power: true,
      },
      state: {
        power: POWER_ON,
      },
    });

    const copy = device.copy({
      power: POWER_OFF,
    });

    expect(device.power).toBe(POWER_ON);
    expect(copy).not.toBe(device);
    expect(copy.power).toBe(POWER_OFF);
  });

  it('should only mutate state when copied', () => {
    const device = createDevice({
      id: 'myid',
      name: 'myname',
      props: {
        power: true,
      },
      state: {
        power: POWER_ON,
      },
    });

    const copy = device.copy({
      power: POWER_OFF,
    });

    expect(copy.id).toBe('myid');
    expect(copy.name).toBe('myname');
  });

  it('should be serializable', () => {
    const device = createDevice({
      name: 'test',
      id: '1234',
      props: {
        power: true,
      },
      state: {
        power: POWER_ON,
      },
    });

    expect(device.serialize()).toEqual({
      name: 'test',
      id: '1234',
      props: {
        power: true,
      },
      state: {
        power: 1,
      },
    });
  });

  it('should toggle power', () => {
    let device = createDevice({
      id: 'myid',
      name: 'myname',
    });

    expect(device.power).toBe(POWER_OFF);
    device = device.copy(togglePower);
    expect(device.power).toBe(POWER_ON);
    device = device.copy(togglePower);
    expect(device.power).toBe(POWER_OFF);
  });
});
