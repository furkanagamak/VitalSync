const mongoose = require("mongoose");

const resourceTemplateSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
});

module.exports = mongoose.model("ResourceTemplate", resourceTemplateSchema);
