const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  email: { type: String, required: true, unique: true },
  accountType: {
    type: String,
    required: true,
    enum: ["staff", "hospital admin", "system admin"],
  },
  profileUrl: { type: String, default: "" },
  isTerminated: { type: Boolean, default: false },
  position: { type: String, required: true },
  department: { type: String, required: true },
  degree: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  officePhoneNumber: { type: String, default: "" },
  officeLocation: { type: String, default: "" },
  eligibleRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  assignedProcedures: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProcedureInstance" },
  ],
  usualHours: {
    type: [
      {
        day: {
          type: String,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        start: String,
        end: String,
      },
    ],
    default: [
      { day: "Sunday", start: "09:00", end: "17:00" },
      { day: "Monday", start: "09:00", end: "17:00" },
      { day: "Tuesday", start: "09:00", end: "17:00" },
      { day: "Wednesday", start: "09:00", end: "17:00" },
      { day: "Thursday", start: "09:00", end: "17:00" },
      { day: "Friday", start: "09:00", end: "17:00" },
      { day: "Saturday", start: "09:00", end: "17:00" },
    ],
  },
  unavailableTimes: [{ start: Date, end: Date, reason: String }],
  otp: {
    code: { type: String, default: null },
    expiry: { type: Date, default: null },
    used: { type: Boolean, default: false },
  },
  notificationBox: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
  ],
});

module.exports = mongoose.model("Account", accountSchema);
