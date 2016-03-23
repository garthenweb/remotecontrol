import five from 'johnny-five';
import Raspi from 'raspi-io';

export default new five.Board({
  io: new Raspi(),
});
