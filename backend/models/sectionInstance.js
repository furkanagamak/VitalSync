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
  processID: { type: mongoose.Schema.Types.ObjectId, ref: "ProcessInstance" },
});

module.exports = mongoose.model("SectionInstance", sectionInstanceSchema);
