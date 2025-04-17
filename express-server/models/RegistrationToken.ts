const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegistrationTokenSchema = new Schema({
  email: { type: String },
  token: { type: String },
  createdAt: { type: Date },
  used: { type: Boolean },
  expiresAt: { type: Date },
});

const RegistrationToken = mongoose.model(
  "RegistrationToken",
  RegistrationTokenSchema
);

module.exports = RegistrationToken;
