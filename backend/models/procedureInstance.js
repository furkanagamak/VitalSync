const mongoose = require("mongoose");

const procedureInstanceSchema = new mongoose.Schema({
  procedureName: { type: String, required: true },
  description: { type: String, default: "" },
  specialNotes: { type: String, default: "" },
  requiredResources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceTemplate",
    },
  ],
  assignedResources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceInstance",
    },
  ],
  rolesAssignedPeople: [
    {
      role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
      accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
    },
  ],
  peopleMarkAsCompleted: [
    {
      role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
      accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
    },
  ],
  timeStart: { type: Date, required: true },
  timeEnd: { type: Date, required: true },
  processID: { type: String, ref: "ProcessInstance.processID" },
  sectionID: { type: mongoose.Schema.Types.ObjectId, ref: "SectionInstance" },
});

module.exports = mongoose.model("ProcedureInstance", procedureInstanceSchema);
