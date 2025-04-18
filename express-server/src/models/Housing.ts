import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HousingSchema = new Schema(
  {
    address: {
      building: { type: String },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    landlord: {
      fullName: { type: String },
      phone: { type: String, required: true },
      email: { type: String },
    },
    facility: {
      beds: { type: Number },
      mattresses: { type: Number },
      tables: { type: Number },
      chairs: { type: Number },
    },
    residents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  },
  { timestamps: true }
);

const Housing = mongoose.model('Housing', HousingSchema);

export default Housing;
