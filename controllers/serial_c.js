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

module.exports.sendBuffer = (err, buffer, next) => {
  if (err) { return next(err); }
  console.log('Sending Buffer');
  SerialPort.write(buffer, (err) => {
    if (err) {
      console.log(`Error while sending message : ${err}`);
      return next(err);
    }
    return next();
  });
};

module.exports.waitForString = (data, waitString, next) => {
  // console.log(`Wait Data: ${data}`);
  if (data.includes(waitString)) {
    console.log(`Found: ${waitString}`);
    return next();
  }
};
