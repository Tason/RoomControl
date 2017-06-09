/**
 * Created by niclas on 09.06.2017.
 */

const mongoose = require('mongoose');

const ledcontrolSchema = new mongoose.Schema({
  controltext: String,
  packets: [[String]]

}, { timestamps: true, collection: 'ledcontrol' });


const Ledcontrol = mongoose.model('Ledcontrol', ledcontrolSchema);

module.exports = Ledcontrol;

module.exports.getControlPackets = (id, next) => {
  Ledcontrol.findOne({ _id: id }, (err, control) => {
    if (err) {
      return next(err);
    }

    return next(control.packets);
  });
};
