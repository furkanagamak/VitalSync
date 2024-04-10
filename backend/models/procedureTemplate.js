const mongoose = require("mongoose");

const procedureTemplateSchema = new mongoose.Schema({
  procedureName: { type: String, required: true },
  description: { type: String, default: "" },
  requiredResources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResourceTemplate",
    },
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],
  estimatedTime: { type: Number, required: true },
  specialNotes: { type: String, default: "" },
});

module.exports = mongoose.model("ProcedureTemplate", procedureTemplateSchema);
