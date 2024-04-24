const mongoose = require("mongoose");

const processInstanceSchema = new mongoose.Schema({
  processID: { type: String, required: true, unique: true},
  processName: { type: String, required: true },
  description: { type: String, default: "" },
  sectionInstances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SectionInstance",
    },
  ],
  currentProcedure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProcedureInstance",
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  messageHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("ProcessInstance", processInstanceSchema);
