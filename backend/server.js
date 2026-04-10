const app = require("./app");
const connectDB = require("./config/db")
const PORT = process.env.PORT
connectDB()
app.listen(PORT, ((req,res) => {
  console.log(`server is running on PORT ${PORT}`)
}))