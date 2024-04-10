const mongoose = require("mongoose");

const sectionTemplateSchema = new mongoose.Schema({
  sectionName: { type: String, required: true },
  description: { type: String, default: "" },
  procedureTemplates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcedureTemplate",
    },
  ],
});

module.exports = mongoose.model("SectionTemplate", sectionTemplateSchema);
