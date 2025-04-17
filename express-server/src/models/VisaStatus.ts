import mongoose from "mongoose";

const Schema = mongoose.Schema;

const VisaStatusSchema = new Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },
    workAuthorization: {
      type: {
        type: String,
        enum: ["Green Card", "Citizen", "H1-B", "L2", "F1", "H4", "Other"],
      },
      startDate: { type: Date },
      endDate: { type: Date },
      otherTitle: { type: String },
    },
    optReceipt: {
      file: { type: String },
      status: {
        type: String,
        enum: ["Not Uploaded", "Pending Approval", "Approved", "Rejected"],
        default: "Not Uploaded",
      },
      feedback: { type: String },
    },
    optEAD: {
      file: { type: String },
      status: {
        type: String,
        enum: ["Not Uploaded", "Pending Approval", "Approved", "Rejected"],
        default: "Not Uploaded",
      },
      feedback: { type: String },
    },
    i983: {
      file: { type: String },
      status: {
        type: String,
        enum: ["Not Uploaded", "Pending Approval", "Approved", "Rejected"],
        default: "Not Uploaded",
      },
      feedback: { type: String },
    },
    i20: {
      file: { type: String },
      status: {
        type: String,
        enum: ["Not Uploaded", "Pending Approval", "Approved", "Rejected"],
        default: "Not Uploaded",
      },
      feedback: { type: String },
    },
  },
  { timestamps: true }
);

const VisaStatus = mongoose.model("VisaStatus", VisaStatusSchema);

export default VisaStatus;
