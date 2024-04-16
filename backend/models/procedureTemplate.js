const mongoose = require("mongoose");

const procedureTemplateSchema = new mongoose.Schema({
  procedureName: { type: String, required: true },
  description: { type: String, default: "" },
  requiredResources: [
    {
      resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ResourceTemplate",
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  roles: [
    {
      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  estimatedTime: { type: Number, required: true },
  specialNotes: { type: String, default: "" },
});

module.exports = mongoose.model("ProcedureTemplate", procedureTemplateSchema);
