/**
 * Created by niclas on 03.06.2017.
 */

const serialport = require('serialport');


const SerialPort = new serialport('COM3', {
  baudrate: 9600,
  autoOpen: true,
  parser: serialport.parsers.readline('\n')
});

module.exports.serialPort = SerialPort;

module.exports.sendBuffer = (buffer, next) => {
  SerialPort.write(buffer, (err) => {
    if (err) {
      console.log(`Error while sending message : ${err}`);
      return next(err);
    }
  });
  return next();
};

module.exports.waitForString = (data, waitString, next) => {
  if (data.includes(waitString)) {
    return next();
  }
};
