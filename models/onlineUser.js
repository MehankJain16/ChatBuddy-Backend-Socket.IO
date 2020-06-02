const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const onlineUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  device_id: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OnlineUsers", onlineUserSchema);
