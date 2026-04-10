const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.SERVERDB)
    console.log(`${response.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};

module.exports =connectDB