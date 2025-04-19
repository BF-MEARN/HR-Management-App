import mongoose from 'mongoose';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RegistrationTokenSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, index: true },
    token: { type: String, index: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true, expireAfterSeconds: 3 * 60 * 60 }
);

const RegistrationToken = mongoose.model('RegistrationToken', RegistrationTokenSchema);

export default RegistrationToken;
