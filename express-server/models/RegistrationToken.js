import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RegistrationTokenSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const RegistrationToken = mongoose.model('RegistrationToken', RegistrationTokenSchema);
export default RegistrationToken;
