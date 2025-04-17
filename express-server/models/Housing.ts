const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HousingSchema = new Schema({
  address: {
    building: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  },
  landlord: {
    fullName: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  facility: {
    beds: { type: Number },
    mattresses: { type: Number },
    tables: { type: Number },
    chairs: { type: Number }
  },
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
}
)

const Housing = mongoose.model('Housing', HousingSchema);

module.exports = Housing;