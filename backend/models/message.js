const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  text: { type: String, required: true },
  timeCreated: { type: Date, required: true, default: new Date() },
});

module.exports = mongoose.model("Message", messageSchema);
