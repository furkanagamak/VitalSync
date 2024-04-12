const mongoose = require("mongoose");

const processTemplateSchema = new mongoose.Schema({
  processName: { type: String, required: true },
  description: { type: String, default: "" },
  sectionTemplates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SectionTemplate",
    },
  ],
});

module.exports = mongoose.model("ProcessTemplate", processTemplateSchema);
