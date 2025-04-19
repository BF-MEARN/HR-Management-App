import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FacilityReportSchema = new Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', index: true },
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Housing', index: true },
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
    comments: [
      {
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          // Changed ref from FacilityReport to User
          ref: 'User',
        },
        description: { type: String },
        timestamp: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

const FacilityReport = mongoose.model('FacilityReport', FacilityReportSchema);

export default FacilityReport;
