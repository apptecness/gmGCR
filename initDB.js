const mongoose = require("mongoose");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@${process.env.MONGODB_URI}`;
module.exports = () => {
  mongoose
    .connect(uri, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("Mongodb connected....");
    })
    .catch((err) => console.log(err.message));

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db...");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected...");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Mongoose connection is disconnected due to app termination...");
      process.exit(0);
    });
  });
};
