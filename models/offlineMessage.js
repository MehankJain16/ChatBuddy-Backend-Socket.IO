const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offlineMessageSchema = new Schema({
  toName: {
    type: String,
    required: true,
  },
  fromName: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sendTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OfflineMessage", offlineMessageSchema);
