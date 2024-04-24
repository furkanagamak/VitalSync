const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true },
  dob: { type: Date, required: true },
  sex: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyContacts: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
    },
  ],
  knownConditions: [String],
  allergies: [String],
});

module.exports = mongoose.model("Patient", patientSchema);
