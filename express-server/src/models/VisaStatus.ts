import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const VisaStatusSchema = new Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  workAuthorization: {
    type: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  optReceipt: {
    file: { type: String },
    status: { type: String },
    feedback: { type: String }
  },
  optEAD: {
    file: { type: String },
    status: { type: String },
    feedback: { type: String }
  },
  i983: {
    file: { type: String },
    status: { type: String },
    feedback: { type: String }
  },
  i20: {
    file: { type: String },
    status: { type: String },
    feedback: { type: String }
  }
}
)

const VisaStatus = mongoose.model('VisaStatus', VisaStatusSchema);

module.exports = VisaStatus;