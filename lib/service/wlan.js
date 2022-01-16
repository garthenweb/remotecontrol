import find from 'local-devices';

export const lookup = (mac) =>
  find().then((devices) => {
    const device = devices.find(
      (device) => device && device.mac.toLowerCase() === mac.toLowerCase()
    );
    if (!device) {
      throw new Error('Device not found');
    }
    return device;
  });
