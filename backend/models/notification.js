const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  type: {
    type: String,
    required: true,
    enum: ["alert", "action", "Chat Message", "check"],
  },
  title: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  timeCreated: {
    type: Date,
    required: true,
    default: new Date(),
  },
  processID: { type: String, ref: "ProcessInstance.processID" },
});

module.exports = mongoose.model("Notification", notificationSchema);
