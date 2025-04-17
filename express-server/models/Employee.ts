const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  preferredName: { type: String },
  profilePicture: { type: String },
  ssn: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'prefer_not_to_say'] },
  isCitizenOrPR: { type: Boolean },
  visaInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'VisaStatus' },
  driverLicense: {
    number: { type: String },
    expirationDate: { type: Date },
    file: { type: String }
  },
  reference: {
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String }
  },
  emergencyContacts: [{
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
    phone: { type: String },
    email: { type: String },
    relationship: { type: String }
  }],
  contactInfo: {
    cellPhone: { type: String },
    workPhone: { type: String }
  },
  address: {
    building: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  },
  carInfo: {
    make: { type: String },
    model: { type: String },
    color: { type: String }
  },
  onboardingStatus: { type: String, enum: ['Not Started', 'Pending', 'Approved', 'Rejected'] },
  onboardingFeedback: { type: String }
})




const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee