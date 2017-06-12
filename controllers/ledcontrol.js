/**
 * Created by niclas on 09.06.2017.
 */
const Ledcontrol = require('../models/ledcontrol');
const serialport = require('../controllers/serial_c');
const EventEmitter = require('events');


module.exports.postcreatecontrol = (req, res, next) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/ledcontrol');
  }

  const ledcontrol = new Ledcontrol({
    controltext: req.body.controltext,
    packets: req.body.packets
  });

  ledcontrol.findOne({ controltext: req.body.controltext }, (err, existingControl) => {
    if (err) { return next(err); }
    if (existingControl) {
      req.flash('errors', { msg: 'Control already exists.' });
      return res.redirect('/ledcontrol');
    }
    ledcontrol.save((err) => {
      if (err) { return next(err); }
      res.redirect('/ledcontrol');
    });
  });
};

module.exports.getAllControls = (req, res, next) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/ledcontrol');
  }


  Ledcontrol.find({}, (err, docs) => {
    if (err) {
      return next(err);
    }
    // console.log(docs);
    res.render('ledcontrol/ledcontrol', {
      title: 'LedControl',
      controls: docs
    });
  });
};


const myEmitter = new EventEmitter();

module.exports.postControl = (req, res, next) => {
  const id = req.body.id;
  const sp = req.app.locals.sp;
  Ledcontrol.getControlPackets(id, (packets) => {
    if (sp.isOpen()) {
      for (let i = 0; packets.length > i; i++) {
        console.log(`===Packet: ${i}`);
        const packet = packets[i];
        let waitString = packet[1];
        const buffer = Buffer.from(packet[0], 'hex');
        console.log(`Packet: ${packet[0]}`);
        if (waitString) {
          console.log(`Waiting for: ${waitString}`);
          sp.on('data', data => serialport.waitForString(
              data, waitString, err => serialport.sendBuffer(
                  err, buffer, () => {
                    console.log('Removing wait for');
                    sp.removeListener('data', serialport.waitForString);
                    waitString = undefined;
                  }
                  )
          ));
        } else {
          console.log('Sending Buffer without Wait');
          serialport.sendBuffer(null, buffer, next);
        }
      }
    }
  });

  return next();
};
