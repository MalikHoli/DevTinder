const mongoose = require("mongoose");

const password = encodeURIComponent(`${process.env.MONGODB_PWD}#`); //problem with special character # in .env

const uri = `${process.env.MONGODB_URI_PART1}${password}${process.env.MONGODB_URI_PART2}`;

async function connectToMongodb() {
  try {
    console.log("connecting to the Mongo DB...");
    await mongoose.connect(uri);
  } catch (err) {
    console.log("could not connect to the database: ", err.message);
    /*Error needs to be thrown here to prevent the program flow to start listening to client even though databse is not connected*/
    throw err;
  }
}

module.exports = { connectToMongodb };
