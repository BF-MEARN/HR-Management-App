const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  employeeInfo: { type: mongoose.Schema.Types.ObjectId, ref: "VisaStatus" },
  username: { type: String, required: true },
  password: { type: String },
  email: { type: String, required: true },
  role: { type: String, enum: ["employee", "hr"] },
  token: { type: String }, // optional, for registration token tracking
  isActive: { type: Boolean },
  isCreated: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
