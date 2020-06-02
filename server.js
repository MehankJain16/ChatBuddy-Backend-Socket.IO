const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const OnlineUser = require("./models/onlineUser");
const port = process.env.PORT || 4000;

// Controllers
const {
  addUserToOnlineList,
  removeUserFromOnlineList,
  handleSendingAndReceiving,
  handleTyping,
  handleOnlineStatus,
} = require("./controllers/socketHandlers");

// Get Route
app.get("/", (req, res) => {
  res.send("Node JS Socket.IO Server For ChatBuddy Running");
});

mongoose
  .connect(
    "mongodb+srv://MehankJain:mehankjain16.@mehank-cluster-xciyz.mongodb.net/chatApp?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database Connected");
    io.on("connection", async (socket) => {
      addUserToOnlineList(socket, io);
      removeUserFromOnlineList(socket, io);
      handleSendingAndReceiving(socket, io);
      handleTyping(socket, io);
      handleOnlineStatus(socket, io);
    });

    http.listen(port, () => {
      console.log("Server Running On Port : " + port);
    });
  })
  .catch((err) => {
    console.log("Error Connecting To Database");
  });
