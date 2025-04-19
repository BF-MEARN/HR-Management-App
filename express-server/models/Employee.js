import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    preferredName: { type: String },
    profilePicture: { type: String },
    ssn: {
      type: String,
      required: true,
      match: [/^\d{3}-\d{2}-\d{4}$/, 'Please use ###-##-#### format for SSN'],
    },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ['male', 'female', 'prefer_not_to_say'],
      required: true,
    },
    isCitizenOrPR: { type: Boolean, required: true },
    visaInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'VisaStatus' },
    driverLicense: {
      number: { type: String },
      expirationDate: { type: Date },
      file: { type: String },
    },
    reference: {
      firstName: { type: String },
      lastName: { type: String },
      middleName: { type: String },
      phone: {
        type: String,
        match: [
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
          'Please fill a valid phone number',
        ],
      },
      email: {
        type: String,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
      },
      relationship: { type: String },
    },
    emergencyContacts: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String },
        phone: {
          type: String,
          required: true,
          match: [
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
            'Please fill a valid phone number',
          ],
        },
        email: {
          type: String,
          lowercase: true,
          required: true,
          match: [/.+@.+\..+/, 'Please fill a valid email address'],
        },
        relationship: { type: String, required: true },
      },
    ],
    contactInfo: {
      cellPhone: {
        type: String,
        required: true,
        match: [
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
          'Please fill a valid phone number',
        ],
      },
      workPhone: {
        type: String,
        match: [
          /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
          'Please fill a valid phone number',
        ],
      },
    },
    address: {
      building: { type: String },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    carInfo: {
      make: { type: String },
      model: { type: String },
      color: { type: String },
    },
    onboardingStatus: {
      type: String,
      enum: ['Not Started', 'Pending', 'Approved', 'Rejected'],
      default: 'Not Started',
    },
    onboardingFeedback: { type: String },
    // Add houseId
    houseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Housing',
      index: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;
