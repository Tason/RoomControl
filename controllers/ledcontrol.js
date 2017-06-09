/**
 * Created by niclas on 09.06.2017.
 */
const Ledcontrol = require('../models/ledcontrol');
const serialport = require('../controllers/serial_c');


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

module.exports.postControl = (req, res, next) => {
  const id = req.body.id;
  Ledcontrol.getControlPackets(id, (packets) => {
    if (req.app.locals.sp.isOpen()) {
      for (let i = 0; packets.length > i; i++) {
        const packet = packets[i];
        const waitString = packet[1];
        const buffer = Buffer.from(packet[0], 'hex');
        if (waitString) {
          req.app.locals.sp.on('data', (data) => serialport.waitForString(data, serialport.sendBuffer(buffer, next)));
          req.app.locals.sp.removeListener('data', serialport.waitForString);
        } else {
          serialport.sendBuffer(buffer, next);
        }
        console.log(packet);
      }
    }
  });

  return next();
};
