const mongoose = require("mongoose");
// console.log(process.env.serverDB)
const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.serverDB)
    console.log(`${response.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};

module.exports =connectDB