const mongoose = require("mongoose");

const resourceInstanceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, default: "" },
  uniqueIdentifier: { type: String, required: true, unique: true },
  unavailableTimes: [{ start: Date, end: Date, reason: String }],
});

module.exports = mongoose.model("ResourceInstance", resourceInstanceSchema);
