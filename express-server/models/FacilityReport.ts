const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FacilityReportSchema = new Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: "Housing" },
  title: { type: String },
  description: { type: String },
  status: { type: String, enum: ["Open", "In Progress", "Closed"] },
  createdAt: { type: Date },
  comments: [
    {
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "FacilityReport" },
      description: { type: String },
      timestamp: { type: Date },
    },
  ],
});

const FacilityReport = mongoose.model("FacilityReport", FacilityReportSchema);

module.exports = FacilityReport;
