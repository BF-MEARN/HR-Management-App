import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    // Changed employeeInfo to employeeId
    // Changed ref to Employee
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      unique: true,
      index: true,
      sparse: true,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    role: { type: String, enum: ['employee', 'hr'] },
    token: { type: String }, // optional, for registration token tracking
    isActive: { type: Boolean, default: true },
    // Changed isCreated to isOnBoarding
    isOnboardingSubmitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
