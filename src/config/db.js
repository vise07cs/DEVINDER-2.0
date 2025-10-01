const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vikram07cs_db_user:3mE3kWNY37ev5kFT@devtinde2.sexnzuf.mongodb.net/devTinder2");
};

module.exports = connectDB;

