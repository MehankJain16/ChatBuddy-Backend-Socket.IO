const OnlineUser = require("../models/onlineUser");
const OfflineMessage = require("../models/offlineMessage");

exports.addUserToOnlineList = (socket, io) => {
  console.log(socket.id + " Connected");
  socket.on("addUserToOnline", (data) => {
    OnlineUser.findOne({ mobile_number: data.mobile_number })
      .then((doc) => {
        if (doc) {
          console.log("User already online !");
          socket.mobile_number = doc.mobile_number;
          checkOlderMessagesFor(doc, io);
        } else {
          const user = new OnlineUser({
            name: data.name,
            mobile_number: data.mobile_number,
            device_id: data.device_id,
            socketId: socket.id,
          });
          user.save().then((doc) => {
            socket.mobile_number = data.mobile_number;
            console.log("User Added To Online List");
            checkOlderMessagesFor(doc, io);
            OnlineUser.find()
              .then((doc) => {
                io.emit("onlineUsers", doc);
              })
              .catch((err) => console.log(err));
          });
        }
      })
      .catch((err) => console.log("Error In Adding"));
  });
};

exports.removeUserFromOnlineList = (socket, io) => {
  socket.on("disconnect", () => {
    OnlineUser.deleteOne({ mobile_number: socket.mobile_number }).then(() => {
      console.log(socket.id + " Disconnected");
      console.log(socket.mobile_number + " Removed From Online users");
      OnlineUser.find()
        .then((doc) => {
          io.emit("onlineUsers", doc);
        })
        .catch((err) => console.log(err));
    });
  });
};

exports.handleSendingAndReceiving = (socket, io) => {
  socket.on("send", (data) => {
    OnlineUser.findOne({ mobile_number: data.to })
      .then((user) => {
        if (user) {
          io.to(user.socketId).emit("receive", data);
        } else {
          saveMessage(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.handleTyping = (socket, io) => {
  socket.on("typing", (data) => {
    OnlineUser.findOne({ mobile_number: data.to })
      .then((user) => {
        if (user) {
          io.to(user.socketId).emit("receive-typing", data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.handleOnlineStatus = (socket, io) => {
  socket.on("getUserOnlineStatus", (data, callback) => {
    console.log(data);
    OnlineUser.find()
      .then((doc) => {
        io.emit("onlineUsers", doc);
      })
      .catch((err) => console.log(err));
    callback(true);
  });
};

const saveMessage = (data) => {
  const message = OfflineMessage({
    toName: data.toName,
    fromName: data.fromName,
    to: data.to,
    from: data.from,
    message: data.message,
    sendTime: data.sendTime,
  });
  message.save().then(() => {
    console.log("Message Saved");
  });
};

const checkOlderMessagesFor = (data, io) => {
  OfflineMessage.find({ to: data.mobile_number })
    .then((messages) => {
      if (messages.length !== 0) {
        messages.map((msg) => {
          OfflineMessage.deleteOne({ message: msg.message })
            .then((doc) => {
              io.to(data.socketId).emit("receive", msg);
            })
            .catch((err) => console.log(err));
        });
      } else {
        console.log("No Messages Found For This User!!");
      }
    })
    .catch((err) => console.log(err));
};
