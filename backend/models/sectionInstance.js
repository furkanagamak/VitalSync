const mongoose = require("mongoose");

const sectionInstanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  procedureInstances: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcedureInstance",
    },
  ],
  processID: { type: String, ref: "ProcessInstance.processID" },
});

module.exports = mongoose.model("SectionInstance", sectionInstanceSchema);
